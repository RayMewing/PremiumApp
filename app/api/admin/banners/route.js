import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Banner } from '@/lib/models/Banner'
import { getSession } from '@/lib/auth'

async function adminCheck() {
  const s = await getSession()
  if (!s || s.role !== 'admin') return null
  return s
}

export async function GET() {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const banners = await Banner.find().sort({ order: 1, createdAt: -1 })
  return NextResponse.json({ success: true, banners })
}

export async function POST(req) {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  await connectDB()
  const banner = await Banner.create(data)
  return NextResponse.json({ success: true, banner })
}

export async function PUT(req) {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await req.json()
  await connectDB()
  const banner = await Banner.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ success: true, banner })
}

export async function DELETE(req) {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await connectDB()
  await Banner.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
