import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Example: use formidable or multer for parsing files
      // const file: Express.Multer.File = req.file; // typed
      res.status(200).json({ message: "File uploaded (example)" });
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(500).json({ error: err.message });
      return res.status(500).json({ error: "Unknown error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
