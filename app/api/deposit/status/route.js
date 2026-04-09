import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Deposit } from '@/lib/models/Deposit'
import { getSession } from '@/lib/auth'
import { atlantic } from '@/lib/apis'

export async function GET(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const invoice = searchParams.get('invoice')
    if (!invoice) return NextResponse.json({ success: false, message: 'Invoice wajib diisi' }, { status: 400 })

    await connectDB()
    const deposit = await Deposit.findOne({ invoice, userId: session.userId })
    if (!deposit) return NextResponse.json({ success: false, message: 'Deposit tidak ditemukan' }, { status: 404 })

    if (deposit.status === 'pending') {
      const apiRes = await atlantic.checkDeposit(invoice)
      const isPaid = apiRes?.status === 'success' || apiRes?.data?.status === 'success'
        || apiRes?.paid === true || apiRes?.data?.paid === true

      if (isPaid) {
        deposit.status = 'success'
        deposit.paidAt = new Date()
        await deposit.save()
        await User.findByIdAndUpdate(session.userId, {
          $inc: { saldo: deposit.amount, totalDeposit: 1 }
        })
      }
    }

    return NextResponse.json({ success: true, status: deposit.status, amount: deposit.amount, invoice: deposit.invoice })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
