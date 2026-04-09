import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Transaction } from '@/lib/models/Transaction'
import { getSession } from '@/lib/auth'

export async function GET() {
  const s = await getSession()
  if (!s || s.role !== 'admin') return NextResponse.json({ success:false }, { status:401 })
  await connectDB()
  const [users, trx, pending, revArr] = await Promise.all([
    User.countDocuments(),
    Transaction.countDocuments(),
    Transaction.countDocuments({ status: { $in: ['pending','process'] } }),
    Transaction.aggregate([{ $match: { status:'success' } }, { $group: { _id:null, total: { $sum:'$price' } } }])
  ])
  return NextResponse.json({ success:true, stats: { users, trx, pending, revenue: revArr[0]?.total || 0 } })
}
