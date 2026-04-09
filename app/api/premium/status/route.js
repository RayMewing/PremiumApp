import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Transaction } from '@/lib/models/Transaction'
import { getSession } from '@/lib/auth'
import { premku } from '@/lib/apis'

export async function GET(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const invoice = searchParams.get('invoice')
    if (!invoice) return NextResponse.json({ success: false, message: 'Invoice wajib' }, { status: 400 })

    await connectDB()
    const trx = await Transaction.findOne({ invoice, userId: session.userId })
    if (!trx) return NextResponse.json({ success: false, message: 'Transaksi tidak ditemukan' }, { status: 404 })

    // If already success with accounts, return from DB
    if (trx.status === 'success' && trx.accounts?.length > 0) {
      return NextResponse.json({
        success: true,
        invoice: trx.invoice,
        status: trx.status,
        product: trx.productName,
        accounts: trx.accounts,
        fromCache: true,
      })
    }

    // Check from Premku API
    const apiRes = await premku.checkStatus(invoice)
    const accounts = apiRes?.accounts || apiRes?.data?.accounts || []
    const status = apiRes?.status || (apiRes?.success ? 'success' : 'process')

    if (status === 'success' && accounts.length > 0) {
      await Transaction.findByIdAndUpdate(trx._id, { status: 'success', accounts, apiResponse: apiRes })
    }

    return NextResponse.json({
      success: apiRes?.success !== false,
      invoice,
      status,
      product: apiRes?.product || trx.productName,
      accounts,
    })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
