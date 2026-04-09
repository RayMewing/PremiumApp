import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Transaction } from '@/lib/models/Transaction'
import { Deposit } from '@/lib/models/Deposit'
import { getSession } from '@/lib/auth'

export async function GET(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const tab = searchParams.get('tab') || 'all' // all | premium | deposit
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    await connectDB()

    if (tab === 'deposit') {
      const deposits = await Deposit.find({ userId: session.userId })
        .sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit)
      return NextResponse.json({ success: true, data: deposits, tab })
    }

    const filter = { userId: session.userId }
    if (tab === 'premium') filter.type = 'premium'

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit)

    return NextResponse.json({ success: true, data: transactions, tab })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
