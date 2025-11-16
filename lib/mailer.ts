// lib/mailer.ts
import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST!;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER!;
const pass = process.env.SMTP_PASS!;
const from = process.env.EMAIL_FROM!;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass }
});

export async function sendEmail(to: string, subject: string, html: string) {
  const info = await transporter.sendMail({ from, to, subject, html });
  return info;
}
