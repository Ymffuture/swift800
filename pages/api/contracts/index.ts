import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/db";
import Contract from "@/models/contract.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  if (req.method === "POST") {
    try {
      const body = req.body as { title: string; userId: string };
      const contract = new Contract({
        title: body.title,
        userId: body.userId,
        createdAt: new Date(),
      });
      await contract.save();
      return res.status(201).json(contract);
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(500).json({ error: err.message });
      return res.status(500).json({ error: "Unknown error" });
    }
  }

  if (req.method === "GET") {
    const contracts = await Contract.find({});
    return res.status(200).json(contracts);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
