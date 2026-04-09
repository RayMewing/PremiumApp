import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  linkUrl: { type: String, default: '' },         // URL when tapped
  gradient: { type: String, default: 'linear-gradient(135deg,#1e40af,#2563eb)' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema)
