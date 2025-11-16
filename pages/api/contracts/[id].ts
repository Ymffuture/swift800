import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/db";
import Contract from "@/models/contract.model";
import { sendEmail } from "@/lib/email"; // typed function
// import { sendSms } from "@/lib/sms"; // remove if unused

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const contract = await Contract.findById(id as string);
      if (!contract) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(contract);
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(500).json({ error: err.message });
      return res.status(500).json({ error: "Unknown error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
