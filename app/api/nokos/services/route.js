import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const RO_BASE = process.env.API_RUMAHOTP_BASE || 'https://www.rumahotp.io/api/v2'
const RO_KEY  = process.env.API_RUMAHOTP_KEY  || ''

async function roGet(ep) {
  const r = await fetch(`${RO_BASE}${ep}`, { headers: { Accept:'application/json','x-apikey':RO_KEY } })
  return r.json()
}

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ success:false }, { status:401 })
  try {
    const [svcs, countries] = await Promise.all([
      roGet('/service'),
      roGet('/country'),
    ])
    return NextResponse.json({ success:true, services: svcs?.data || svcs || [], countries: countries?.data || countries || [] })
  } catch(e) {
    return NextResponse.json({ success:false, message:e.message, services:[], countries:[] })
  }
}
