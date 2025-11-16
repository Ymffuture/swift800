// lib/pdf.ts
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { IContract } from '../models/Contract';

// utility to build a simple HTML representation for PDF
function contractToHtml(contract: any) {
  const signerA = contract.signerA || {};
  const signerB = contract.signerB || {};
  return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Contract</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; padding: 32px; color: #111; }
      .header { text-align:center; margin-bottom: 16px; }
      .section { margin-bottom: 12px; }
      .signers { display:flex; gap:20px; }
      .box { border:1px solid #ddd; padding:12px; width:45%; }
      img { max-width:100%; height:auto; }
    </style>
  </head>
  <body>
    <div class="header"><h1>${contract.title}</h1></div>
    <div class="section">${contract.body.replace(/\n/g,'<br/>')}</div>
    <div class="signers">
      <div class="box">
        <h3>Signer A</h3>
        <p>Name: ${signerA.name || ''}</p>
        <p>ID: ${signerA.idNumber || ''}</p>
        ${signerA.idPhotoUrl ? `<img src="${signerA.idPhotoUrl}" alt="ID photo" />` : ''}
        ${signerA.signatureUrl ? `<div><p>Signature:</p><img src="${signerA.signatureUrl}" alt="sigA" /></div>` : ''}
        <p>Signed at: ${signerA.signedAt || ''}</p>
      </div>
      <div class="box">
        <h3>Signer B</h3>
        <p>Name: ${signerB.name || ''}</p>
        ${signerB.signatureUrl ? `<div><p>Signature:</p><img src="${signerB.signatureUrl}" alt="sigB" /></div>` : ''}
        <p>Signed at: ${signerB.signedAt || ''}</p>
      </div>
    </div>
    <div style="margin-top:20px; font-size:12px; color:#666;">Generated: ${new Date().toISOString()}</div>
  </body>
  </html>`;
}

export async function generatePdfBuffer(contract: any): Promise<Buffer> {
  const html = contractToHtml(contract);
  // Choose executablePath depending on environment
  const isAws = !!process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL;
  // chrome-aws-lambda provides an executable for Lambda-like envs
  let browser = null;
  try {
    const executablePath = await chromium.executablePath;
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath || process.env.PUPPETEER_EXEC_PATH,
      headless: chromium.headless,
    });
  } catch (err) {
    // fallback for local dev (you must have puppeteer installed locally)
    // If you want local fallback use "puppeteer" in devDependencies and set USE_PUPPETEER_FALLBACK=true
    // For brevity, attempt to use local chrome if available:
    const puppeteerLocal = require('puppeteer-core');
    browser = await puppeteerLocal.launch({ headless: true });
  }

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
  await browser.close();
  return Buffer.from(pdfBuffer);
}
