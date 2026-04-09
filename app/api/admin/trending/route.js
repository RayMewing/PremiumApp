import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Transaction } from '@/lib/models/Transaction'
import { getSession } from '@/lib/auth'

// Public API - trending fetched by dashboard
export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const trending = await Transaction.aggregate([
    { $match: { status: 'success', createdAt: { $gte: since } } },
    { $group: { _id: { productName: '$productName', type: '$type' }, count: { $sum: 1 }, price: { $first: '$price' } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, productName: '$_id.productName', type: '$_id.type', count: 1, price: 1 } }
  ])

  return NextResponse.json({ success: true, trending })
}
