import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { atlantic, premku } from '@/lib/apis'
import { getSetting, setSetting } from '@/lib/settings'
import { CustomProduct } from '@/lib/models/CustomProduct'
import { connectDB } from '@/lib/mongodb'

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export async function GET(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success:false, message:'Unauthorized' }, { status:401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'pulsa'
  const carrier = searchParams.get('carrier') || ''

  try {
    // Premium products
    if (type === 'premium') {
      await connectDB()
      const [customProds, cache] = await Promise.all([
        CustomProduct.find({ isActive:true }).sort({ createdAt:-1 }),
        getSetting('cache_prem')
      ])
      
      let apiProds = cache?.data || []
      if (!apiProds.length || !cache?.upd || Date.now() - cache.upd > CACHE_TTL) {
        const r = await premku.getProducts()
        apiProds = r?.products || r?.data || []
        if (apiProds.length) await setSetting('cache_prem', { upd: Date.now(), data: apiProds })
      }

      // Combine custom + API products
      const customFormatted = customProds.map(p => ({
        code: 'CUSTOM_' + p._id,
        name: p.name,
        price: p.priceM,
        img_url: p.imgUrl,
        desc: p.note,
        isCustom: true,
        _customId: p._id,
      }))
      return NextResponse.json({ success:true, products: [...customFormatted, ...apiProds] })
    }

    // PPOB products with caching
    let cache = await getSetting('cache_ppob')
    let products = cache?.data || []

    if (!products.length || !cache?.upd || Date.now() - cache.upd > CACHE_TTL) {
      const r = await atlantic.getProducts('prabayar')
      products = r?.data || r?.pricelist || []
      if (products.length) await setSetting('cache_ppob', { upd: Date.now(), data: products })
    }

    // Filter by carrier if given
    if (carrier && products.length) {
      const filterFn = {
        Telkomsel: p => /telkomsel|tsel|simpati|as\b|loop/i.test(p.name+' '+(p.category||'')+' '+(p.provider||'')),
        Indosat:   p => /indosat|im3|mentari|matrix/i.test(p.name+' '+(p.category||'')+' '+(p.provider||'')),
        XL:        p => /\bxl\b|axiata/i.test(p.name+' '+(p.category||'')+' '+(p.provider||'')),
        Axis:      p => /axis/i.test(p.name+' '+(p.category||'')+' '+(p.provider||'')),
        Smartfren: p => /smartfren|smarttelcom/i.test(p.name+' '+(p.category||'')+' '+(p.provider||'')),
        Three:     p => /\btri\b|\bthree\b|\b3\b/i.test(p.name+' '+(p.category||'')+' '+(p.provider||'')),
      }
      const fn = filterFn[carrier]
      if (fn) products = products.filter(fn)
    }

    return NextResponse.json({ success:true, products: products.slice(0, 200) })
  } catch(e) {
    return NextResponse.json({ success:false, message:e.message, products:[] }, { status:500 })
  }
}
