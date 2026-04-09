import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { setSetting } from '@/lib/settings'
import { atlantic, premku, rumahotp } from '@/lib/apis'

export async function POST(req) {
  const s = await getSession()
  if (!s || s.role !== 'admin') return NextResponse.json({ success:false }, { status:401 })
  const { type } = await req.json()
  const updated = []
  try {
    if (type === 'ppob' || type === 'all') {
      const r = await atlantic.getProducts('prabayar')
      if (r?.data?.length) { await setSetting('cache_ppob', { upd: Date.now(), data: r.data }); updated.push('ppob') }
    }
    if (type === 'prem' || type === 'all') {
      const r = await premku.getProducts()
      const prods = r?.products || r?.data || []
      if (prods.length) { await setSetting('cache_prem', { upd: Date.now(), data: prods }); updated.push('prem') }
    }
    if (type === 'nokos' || type === 'all') {
      const r = await rumahotp.getServices()
      const svcs = r?.data || r || []
      if (svcs.length) { await setSetting('cache_nokos', { upd: Date.now(), data: svcs }); updated.push('nokos') }
    }
    return NextResponse.json({ success:true, message:`Cache diperbarui: ${updated.join(', ')||'tidak ada perubahan'}`, updated })
  } catch(e) {
    return NextResponse.json({ success:false, message:e.message }, { status:500 })
  }
}
