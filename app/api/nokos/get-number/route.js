import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Transaction } from '@/lib/models/Transaction'

const RO_BASE = process.env.API_RUMAHOTP_BASE || 'https://www.rumahotp.io/api/v2'
const RO_KEY  = process.env.API_RUMAHOTP_KEY  || ''

async function roGet(ep) {
  const r = await fetch(`${RO_BASE}${ep}`, { headers: { Accept:'application/json','x-apikey':RO_KEY } })
  return r.json()
}

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success:false, message:'Unauthorized' }, { status:401 })

    const { service, country } = await req.json()
    if (!service) return NextResponse.json({ success:false, message:'Pilih layanan' }, { status:400 })

    await connectDB()
    const user = await User.findById(session.userId)

    // Get number from RumahOTP
    const params = new URLSearchParams({ service, country: country||'indonesia' })
    const res = await fetch(`${RO_BASE}/number?${params}`, { headers: { Accept:'application/json','x-apikey':RO_KEY } })
    const data = await res.json()

    const price = data?.price || data?.cost || 0
    if (user.saldo < price) {
      return NextResponse.json({ success:false, message:`Saldo tidak cukup. Dibutuhkan Rp ${price.toLocaleString('id-ID')}` }, { status:400 })
    }

    if (!data?.id && !data?.number) {
      return NextResponse.json({ success:false, message: data?.message || 'Nomor tidak tersedia saat ini' }, { status:400 })
    }

    // Deduct saldo
    if (price > 0) {
      await User.findByIdAndUpdate(session.userId, { $inc: { saldo: -price } })
      await Transaction.create({
        userId: session.userId,
        invoice: 'NOKOS' + Date.now(),
        type: 'other',
        category: 'nokos',
        productName: `Nomor Virtual - ${service}`,
        target: data.number || data.phone || '',
        price,
        status: 'success',
        apiResponse: data,
      })
    }

    return NextResponse.json({ success:true, data })
  } catch(e) {
    return NextResponse.json({ success:false, message:e.message }, { status:500 })
  }
}
