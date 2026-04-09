import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  nama: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  isActive: { type: Boolean, default: true },
  saldo: { type: Number, default: 0 },
  totalDeposit: { type: Number, default: 0 },
  totalTransaksi: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
