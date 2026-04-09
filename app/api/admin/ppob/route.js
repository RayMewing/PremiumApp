import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Transaction } from '@/lib/models/Transaction'
import { getSession } from '@/lib/auth'

export async function GET() {
  const s = await getSession()
  if (!s || s.role !== 'admin') return NextResponse.json({ success:false }, { status:401 })
  await connectDB()
  const transactions = await Transaction.find({
    type: { $nin: ['premium','other'] },
    status: { $in: ['pending','process'] }
  }).sort({ createdAt:-1 }).limit(50)
  return NextResponse.json({ success:true, transactions })
}

export async function POST(req) {
  const s = await getSession()
  if (!s || s.role !== 'admin') return NextResponse.json({ success:false }, { status:401 })
  const { id, action } = await req.json()
  await connectDB()
  const trx = await Transaction.findById(id)
  if (!trx) return NextResponse.json({ success:false, message:'Tidak ditemukan' }, { status:404 })
  if (action === 'success') {
    trx.status = 'success'; await trx.save()
    return NextResponse.json({ success:true, message:'PPOB ditandai sukses' })
  }
  if (action === 'refund') {
    trx.status = 'failed'; await trx.save()
    await User.findByIdAndUpdate(trx.userId, { $inc: { saldo: trx.price } })
    return NextResponse.json({ success:true, message:'PPOB ditolak & saldo dikembalikan' })
  }
  return NextResponse.json({ success:false, message:'Action tidak valid' }, { status:400 })
}
