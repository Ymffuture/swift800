// lib/sms.ts
import Twilio from 'twilio';
const sid = process.env.TWILIO_ACCOUNT_SID!;
const token = process.env.TWILIO_AUTH_TOKEN!;
const from = process.env.TWILIO_FROM!;
const client = Twilio(sid, token);

export async function sendSms(to: string, body: string) {
  if (!sid || !token) throw new Error('Twilio not configured');
  const msg = await client.messages.create({ from, to, body });
  return msg;
}
