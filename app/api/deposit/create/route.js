import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Deposit } from '@/lib/models/Deposit'
import { getSession } from '@/lib/auth'
import { atlantic } from '@/lib/apis'

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { amount } = await req.json()
    const amt = parseInt(amount)
    if (!amt || amt < 10000)
      return NextResponse.json({ success: false, message: 'Minimal deposit Rp 10.000' }, { status: 400 })
    if (amt > 10000000)
      return NextResponse.json({ success: false, message: 'Maksimal deposit Rp 10.000.000' }, { status: 400 })

    await connectDB()
    const fee = 200
    const invoice = 'DEP' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase()

    // Call Atlantic QRIS API
    const apiRes = await atlantic.createQRIS(amt, invoice)

    const deposit = await Deposit.create({
      userId: session.userId,
      invoice,
      amount: amt,
      fee,
      method: 'QRIS',
      status: 'pending',
      qrUrl: apiRes?.data?.qr_url || apiRes?.qr_url || '',
      qrString: apiRes?.data?.qr_string || apiRes?.qr_string || '',
      expiredAt: new Date(Date.now() + 30 * 60 * 1000),
      apiData: apiRes,
    })

    return NextResponse.json({
      success: true,
      deposit: {
        invoice: deposit.invoice,
        amount: deposit.amount,
        fee: deposit.fee,
        total: deposit.amount + deposit.fee,
        qrUrl: deposit.qrUrl,
        qrString: deposit.qrString,
        expiredAt: deposit.expiredAt,
        status: deposit.status,
      }
    })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
