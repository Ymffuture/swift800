// lib/notify.ts
import { sendEmail as sendEmailRaw } from './mailer';
import { sendSms as sendSmsRaw } from './sms';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured - skipping email to', to);
    return null;
  }
  try {
    return await sendEmailRaw(to, subject, html);
  } catch (e) {
    console.error('sendEmail error', e);
    return null;
  }
}

export async function sendSms(to: string, body: string) {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.warn('Twilio not configured - skipping sms to', to);
    return null;
  }
  try {
    return await sendSmsRaw(to, body);
  } catch (e) {
    console.error('sendSms error', e);
    return null;
  }
}
