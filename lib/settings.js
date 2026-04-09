import { connectDB } from './mongodb'
import { Settings, DEFAULTS } from './models/Settings'

export async function getSetting(key) {
  await connectDB()
  const doc = await Settings.findOne({ key })
  if (doc) return doc.value
  return DEFAULTS[key] ?? null
}

export async function getAllSettings() {
  await connectDB()
  const docs = await Settings.find({})
  const result = { ...DEFAULTS }
  for (const d of docs) result[d.key] = d.value
  return result
}

export async function setSetting(key, value) {
  await connectDB()
  await Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
}
