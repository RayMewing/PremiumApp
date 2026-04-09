import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, enum: ['register', 'change-password'], default: 'register' },
  tempData: { type: mongoose.Schema.Types.Mixed, default: {} },
  attempts: { type: Number, default: 0 },
  expiredAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true })

otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 })

export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema)
