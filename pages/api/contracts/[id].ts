// pages/api/contracts/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Contract from '../../../models/Contract';
import cloudinary from '../../../lib/cloudinary';
import { nowISO } from '../../../lib/utils';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
await dbConnect();
const { id } = req.query;
if (req.method === 'POST') {
try {
const { name, email, signature } = req.body; // signature = dataUrl (base64 png)
const contract = await Contract.findById(String(id));
if (!contract) return res.status(404).json({ ok: false, message: 'contract not found' });


// upload signature image
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


return res.json({ ok: true, contract });
} catch (err: any) {
console.error(err);
return res.status(500).json({ ok: false, message: err.message });
}
}
res.setHeader('Allow', 'POST');
res.status(405).end('Method Not Allowed');
}
