import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { getSession } from '@/lib/auth'

async function adminCheck() {
  const s = await getSession()
  if (!s || s.role !== 'admin') return null
  return s
}

export async function GET(req) {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false }, { status: 401 })
  await connectDB()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const filter = q ? { $or: [{ email: { $regex: q, $options: 'i' } }, { nama: { $regex: q, $options: 'i' } }] } : {}
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(100)
  return NextResponse.json({ success: true, users })
}

export async function PUT(req) {
  const s = await adminCheck()
  if (!s) return NextResponse.json({ success: false }, { status: 401 })
  const { id, action, value } = await req.json()
  await connectDB()
  let update = {}
  if (action === 'toggle-block') update = { isActive: value }
  if (action === 'set-role') update = { role: value }
  if (action === 'add-saldo') {
    const user = await User.findById(id)
    update = { saldo: (user.saldo || 0) + parseInt(value) }
  }
  const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password')
  return NextResponse.json({ success: true, user })
}
