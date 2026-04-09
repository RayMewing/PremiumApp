import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { CustomProduct } from '@/lib/models/CustomProduct'
import { getSession } from '@/lib/auth'

async function check() { const s = await getSession(); return s?.role === 'admin' ? s : null }

export async function GET() {
  if (!await check()) return NextResponse.json({ success:false }, { status:401 })
  await connectDB()
  const products = await CustomProduct.find({ isActive:true }).sort({ createdAt:-1 })
  return NextResponse.json({ success:true, products })
}
export async function POST(req) {
  if (!await check()) return NextResponse.json({ success:false }, { status:401 })
  const data = await req.json()
  await connectDB()
  const p = await CustomProduct.create(data)
  return NextResponse.json({ success:true, product:p })
}
export async function DELETE(req) {
  if (!await check()) return NextResponse.json({ success:false }, { status:401 })
  const { id } = await req.json()
  await connectDB()
  await CustomProduct.findByIdAndUpdate(id, { isActive:false })
  return NextResponse.json({ success:true })
}
