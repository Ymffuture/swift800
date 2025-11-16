// pages/api/contracts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Contract from '../../../models/Contract';
import cloudinary from '../../../lib/cloudinary';
import { makeShortCode, nowISO } from '../../../lib/utils';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
await dbConnect();
if (req.method === 'POST') {
try {
const { title, body, signerA } = req.body;
// signerA: { name, idNumber, idPhoto (dataUrl) }
// upload idPhoto to cloudinary
let idPhotoUrl = '';
if (signerA?.idPhoto) {
const uploadRes = await cloudinary.uploader.upload(signerA.idPhoto, { folder: 'contracts/ids' });
idPhotoUrl = uploadRes.secure_url;
}


const shortCode = makeShortCode(6);
const contract = await Contract.create({
title,
body,
shortCode,
signerA: {
name: signerA.name,
idNumber: signerA.idNumber,
idPhotoUrl,
signedAt: nowISO(),
ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
userAgent: req.headers['user-agent'] || ''
},
status: 'partially_signed'
});


return res.status(201).json({ ok: true, shortCode, contractId: contract._id });
} catch (err: any) {
console.error(err);
return res.status(500).json({ ok: false, message: err.message });
}
}
res.setHeader('Allow', 'POST');
res.status(405).end('Method Not Allowed');
}
