// pages/api/contracts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Contract from '../../../models/Contract';
import cloudinary from '../../../lib/cloudinary';
import { makeShortCode, nowISO } from '../../../lib/utils';
import { sendEmail } from '../../../lib/notify';
import { sendSms } from '../../../lib/notify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { title, body, signerA, notify } = req.body;
    // signerA: { name, idNumber, idPhoto (dataUrl), signature }
    let idPhotoUrl = '';
    let sigUrl = '';
    if (signerA?.idPhoto) {
      const up = await cloudinary.uploader.upload(signerA.idPhoto, { folder: 'contracts/ids' });
      idPhotoUrl = up.secure_url;
    }
    if (signerA?.signature) {
      const up2 = await cloudinary.uploader.upload(signerA.signature, { folder: 'contracts/signatures' });
      sigUrl = up2.secure_url;
    }

    const shortCode = makeShortCode(6);
    const c = await Contract.create({
      title,
      body,
      shortCode,
      signerA: {
        name: signerA.name,
        idNumber: signerA.idNumber,
        idPhotoUrl,
        signatureUrl: sigUrl,
        signedAt: nowISO(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'] || ''
      },
      status: 'partially_signed'
    });

    // Send notifications to user B (optional)
    const base = process.env.NEXT_PUBLIC_APP_URL || '';
    const link = `${base}/contract/${shortCode}`;
    if (notify?.email) {
      const subject = 'You have a contract to sign';
      const html = `<p>A contract was created and waiting your signature.</p><p>Open: <a href="${link}">${link}</a></p><p>Or enter code: <b>${shortCode}</b></p>`;
      try { await sendEmail(notify.email, subject, html); } catch (e) { console.error('email fail', e); }
    }
    if (notify?.phone) {
      try { await sendSms(notify.phone, `Contract ready: ${link} (code ${shortCode})`); } catch (e) { console.error('sms fail', e); }
    }

    res.status(201).json({ ok: true, shortCode, contractId: c._id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
}
