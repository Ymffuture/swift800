// models/contract.model.ts
import mongoose, { Schema, Document, model, Model } from "mongoose";

export interface IContract extends Document {
  title: string;
  userAIdPhoto: string;
  userBIdPhoto?: string;
  signatures: string[];
  createdAt: Date;
}

const ContractSchema: Schema<IContract> = new Schema<IContract>({
  title: { type: String, required: true },
  userAIdPhoto: { type: String, required: true },
  userBIdPhoto: { type: String },
  signatures: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.Contract as Model<IContract>) ||
  model<IContract>("Contract", ContractSchema);
