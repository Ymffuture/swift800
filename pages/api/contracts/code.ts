// pages/api/contracts/code.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '../../../lib/db';

import Contract from '../../../models/Contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  const code = String(req.query.code || '');
  if (!code) return res.status(400).json({ ok: false, message: 'code required' });
  const contract = await Contract.findOne({ shortCode: code }).lean();
  if (!contract) return res.status(404).json({ ok: false, message: 'Not found' });
  res.json({ ok: true, contract });
}
