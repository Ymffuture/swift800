// pages/api/contracts/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Contract from '../../../models/Contract';
import cloudinary from '../../../lib/cloudinary';
import { nowISO } from '../../../lib/utils';
import { generatePdfBuffer } from '../../../lib/pdf';
import { sendEmail, sendSms } from '../../../lib/notify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { name, email, signature } = req.body;
    const contract = await Contract.findById(String(id));
    if (!contract) return res.status(404).json({ ok: false, message: 'contract not found' });

    let sigUrl = '';
    if (signature) {
      const up = await cloudinary.uploader.upload(signature, { folder: 'contracts/signatures' });
      sigUrl = up.secure_url;
    }

    contract.signerB = {
      name,
      email,
      signatureUrl: sigUrl,
      signedAt: nowISO(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || ''
    } as any;

    contract.status = 'signed';
    await contract.save();

    // Generate final PDF (server-side) and upload to Cloudinary
    const pdfBuffer = await generatePdfBuffer(contract);
    const uploadRes = await cloudinary.uploader.upload(`data:application/pdf;base64,${pdfBuffer.toString('base64')}`, {
      folder: 'contracts/final',
      resource_type: 'raw',
      public_id: `contract-${contract._id}`
    });
    contract.pdfUrl = uploadRes.secure_url;
    await contract.save();

    // Notify both parties via email/SMS where possible
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const pdfLink = contract.pdfUrl || '';

    const htmlForA = `<p>Your contract has been signed by ${name}.</p><p>Download: <a href="${pdfLink}">${pdfLink}</a></p>`;
    try { if (contract.signerA?.email) await sendEmail(contract.signerA.email, 'Contract signed', htmlForA); } catch (e) { console.error(e); }
    try { if (email) await sendEmail(email, 'You signed the contract', `<p>Thanks for signing. Download: <a href="${pdfLink}">${pdfLink}</a></p>`); } catch (e) { console.error(e); }

    // optional: send SMS (if phone numbers stored)
    try { /* nothing by default */ } catch (e) { console.error(e); }

    res.json({ ok: true, contract });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
}
