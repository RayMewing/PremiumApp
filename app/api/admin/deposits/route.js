import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Deposit } from '@/lib/models/Deposit'
import { getSession } from '@/lib/auth'

export async function GET() {
  const s = await getSession()
  if (!s || s.role !== 'admin') return NextResponse.json({ success:false }, { status:401 })
  await connectDB()
  const deposits = await Deposit.find({ status:'pending' }).populate('userId','email nama').sort({ createdAt:-1 }).limit(50)
  return NextResponse.json({ success:true, deposits })
}

export async function POST(req) {
  const s = await getSession()
  if (!s || s.role !== 'admin') return NextResponse.json({ success:false }, { status:401 })
  const { id, action } = await req.json()
  await connectDB()
  const dep = await Deposit.findById(id)
  if (!dep) return NextResponse.json({ success:false, message:'Tidak ditemukan' }, { status:404 })
  if (action === 'confirm') {
    dep.status = 'success'; dep.paidAt = new Date(); await dep.save()
    await User.findByIdAndUpdate(dep.userId, { $inc: { saldo: dep.amount, totalDeposit: 1 } })
    return NextResponse.json({ success:true, message:'Deposit dikonfirmasi, saldo dikreditkan' })
  }
  if (action === 'reject') {
    dep.status = 'failed'; await dep.save()
    return NextResponse.json({ success:true, message:'Deposit ditolak' })
  }
  return NextResponse.json({ success:false, message:'Action tidak valid' }, { status:400 })
}
