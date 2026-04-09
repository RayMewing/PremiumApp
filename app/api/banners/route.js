import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Banner } from '@/lib/models/Banner'
import { getSession } from '@/lib/auth'

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ success: false }, { status: 401 })
  await connectDB()
  const banners = await Banner.find({ isActive: true }).sort({ order: 1 }).limit(10)
  return NextResponse.json({ success: true, banners })
}
