// pages/api/contracts/code.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Contract from '../../../models/Contract';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
await dbConnect();
const { code } = req.query;
if (!code) return res.status(400).json({ ok: false, message: 'code required' });
const contract = await Contract.findOne({ shortCode: String(code) });
if (!contract) return res.status(404).json({ ok: false, message: 'Not found' });
res.json({ ok: true, contract });
}
