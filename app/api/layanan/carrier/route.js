import { NextResponse } from 'next/server'
import { detectCarrier } from '@/lib/carriers'
import { atlantic } from '@/lib/apis'
import { getSession } from '@/lib/auth'

export async function GET(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone') || ''
  const type = searchParams.get('type') || 'pulsa' // pulsa | data

  const carrier = detectCarrier(phone)
  if (!carrier) return NextResponse.json({ success: false, message: 'Nomor tidak dikenal' })

  // Fetch products for this carrier from Atlantic
  try {
    const apiRes = await atlantic.getProducts(type)
    const allProducts = apiRes?.data || apiRes?.products || []
    
    // Filter by carrier name
    const filtered = allProducts.filter(p => {
      const name = (p.name || p.product_name || '').toLowerCase()
      const code = (p.code || p.product_code || '').toLowerCase()
      return name.includes(carrier.name.toLowerCase()) || code.includes(carrier.name.toLowerCase().slice(0,4))
    })

    return NextResponse.json({ success: true, carrier, products: filtered })
  } catch (e) {
    return NextResponse.json({ success: true, carrier, products: [] })
  }
}
