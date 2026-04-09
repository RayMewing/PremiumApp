import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoice: { type: String, unique: true },
  type: { type: String, enum: ['pulsa', 'data', 'emoney', 'pln', 'voucher', 'games', 'premium', 'other'], required: true },
  category: { type: String, default: '' },
  productName: { type: String, required: true },
  productCode: { type: String, default: '' },
  target: { type: String, default: '' }, // phone number / ID
  carrier: { type: String, default: '' },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'process', 'success', 'failed'], default: 'pending' },
  apiResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
  accounts: { type: [{ username: String, password: String }], default: [] }, // for premium
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)
