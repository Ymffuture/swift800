// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { dataUrl, folder } = req.body;
    const r = await cloudinary.uploader.upload(dataUrl, { folder: folder || 'contracts/tmp' });
    res.json({ ok: true, url: r.secure_url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
}
