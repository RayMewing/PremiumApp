import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllSettings, setSetting } from '@/lib/settings'

async function adminCheck() {
  const s = await getSession()
  if (!s || s.role !== 'admin') return null
  return s
}

export async function GET() {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const settings = await getAllSettings()
  return NextResponse.json({ success: true, settings })
}

export async function POST(req) {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const updates = await req.json() // { key: value, ... }
  for (const [key, value] of Object.entries(updates)) {
    await setSetting(key, value)
  }
  return NextResponse.json({ success: true, message: 'Pengaturan disimpan' })
}
