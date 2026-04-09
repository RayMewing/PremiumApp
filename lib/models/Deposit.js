import mongoose from 'mongoose'

const depositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoice: { type: String, unique: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  method: { type: String, default: 'QRIS' },
  status: { type: String, enum: ['pending', 'success', 'failed', 'expired'], default: 'pending' },
  qrUrl: { type: String, default: '' },
  qrString: { type: String, default: '' },
  expiredAt: { type: Date },
  paidAt: { type: Date },
  apiData: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

export const Deposit = mongoose.models.Deposit || mongoose.model('Deposit', depositSchema)
