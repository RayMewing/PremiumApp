import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Transaction } from '@/lib/models/Transaction'
import { getSession } from '@/lib/auth'
import { atlantic, premku } from '@/lib/apis'

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { type, productCode, productName, target, carrier, price } = await req.json()
    if (!type || !productCode || !price)
      return NextResponse.json({ success: false, message: 'Data order tidak lengkap' }, { status: 400 })

    await connectDB()
    const user = await User.findById(session.userId)
    if (!user) return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 })
    if (user.saldo < price)
      return NextResponse.json({ success: false, message: `Saldo tidak cukup. Saldo Anda: Rp ${user.saldo.toLocaleString('id')}` }, { status: 400 })

    const invoice = 'TRX' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase()

    // Deduct saldo
    await User.findByIdAndUpdate(session.userId, { $inc: { saldo: -price, totalTransaksi: 1 } })

    // Create transaction
    const trx = await Transaction.create({
      userId: session.userId,
      invoice,
      type: type === 'emoney' || type === 'pln' || type === 'games' ? type : type,
      category: type,
      productName,
      productCode,
      target: target || '',
      carrier: carrier || '',
      price,
      status: 'process',
    })

    // Call API
    let apiRes
    try {
      if (type === 'premium') {
        apiRes = await premku.order(productCode, 1)
        const status = apiRes?.success ? 'success' : 'process'
        await Transaction.findByIdAndUpdate(trx._id, {
          status,
          apiResponse: apiRes,
          accounts: apiRes?.data?.accounts || apiRes?.accounts || [],
        })
        return NextResponse.json({ success: true, invoice, status, message: 'Order berhasil diproses' })
      }

      apiRes = await atlantic.order(productCode, target, invoice)
      const success = apiRes?.status === 'success' || apiRes?.rc === '00' || apiRes?.success === true
      await Transaction.findByIdAndUpdate(trx._id, {
        status: success ? 'success' : 'process',
        apiResponse: apiRes,
      })
    } catch (apiErr) {
      await Transaction.findByIdAndUpdate(trx._id, { status: 'process', note: apiErr.message })
    }

    return NextResponse.json({ success: true, invoice, status: 'process', message: 'Order sedang diproses' })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
