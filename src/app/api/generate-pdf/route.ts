import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PdfRequest {
  html: string;
}

export async function POST(req: Request) {
  try {
    const { html } = (await req.json()) as PdfRequest;
    const pdfBuffer = await generatePDF(html);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=contract.pdf",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
