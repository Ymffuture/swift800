// models/Contract.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISigner {
  name?: string;
  email?: string;
  signedAt?: string;
  signatureUrl?: string;
  ip?: string;
  userAgent?: string;
  idNumber?: string;
  idPhotoUrl?: string;
}

export interface IContract extends Document {
  shortCode: string;
  title: string;
  body: string;
  status: 'pending' | 'partially_signed' | 'signed';
  signerA: ISigner;
  signerB?: ISigner;
  createdAt: string;
  pdfUrl?: string;
}

const SignerSchema = new Schema({
  name: String,
  email: String,
  signedAt: String,
  signatureUrl: String,
  ip: String,
  userAgent: String,
  idNumber: String,
  idPhotoUrl: String
}, { _id: false });

const ContractSchema = new Schema({
  shortCode: { type: String, required: true, index: true, unique: true },
  title: String,
  body: String,
  status: { type: String, default: 'pending' },
  signerA: { type: SignerSchema, required: true },
  signerB: { type: SignerSchema },
  createdAt: { type: String, default: () => new Date().toISOString() },
  pdfUrl: String
});

export default mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);
