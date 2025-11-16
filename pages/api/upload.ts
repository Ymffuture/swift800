// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../lib/cloudinary';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== 'POST'
