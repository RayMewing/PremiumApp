import mongoose from 'mongoose'

const infoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  category: { type: String, enum: ['info', 'promo', 'event', 'harga'], default: 'info' },
  isPublished: { type: Boolean, default: true },
  author: { type: String, default: 'Admin' },
}, { timestamps: true })

export const Info = mongoose.models.Info || mongoose.model('Info', infoSchema)
