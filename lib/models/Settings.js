import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema)

// Default settings helpers
export const DEFAULTS = {
  app_name: 'PremiumKita',
  app_logo_url: '',                  // URL gambar logo untuk email & UI
  app_tagline: 'Layanan Digital Terpercaya',
  email_header_color: '#2563eb',
  deposit_fee: 200,
  min_deposit: 10000,
  max_deposit: 10000000,
  maintenance_mode: false,
  whatsapp_cs: '6281234567890',
}
