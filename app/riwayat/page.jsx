'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon } from '@/components/Icons'

const TABS = [
  { key:'all',     label:'Semua',   icon:'history' },
  { key:'premium', label:'Premium', icon:'crown'   },
  { key:'deposit', label:'Deposit', icon:'wallet'  },
]

const TYPE_ICON = { pulsa:'phone', data:'wifi', emoney:'wallet', pln:'zap', games:'gamepad', voucher:'tag', premium:'crown', other:'package', nokos:'number' }
const TYPE_COLOR = { pulsa:'#2563eb', data:'#0891b2', emoney:'#059669', pln:'#d97706', games:'#7c3aed', premium:'#b45309', nokos:'#6d28d9', other:'#64748b' }

const STATUS = {
  success: { label:'Sukses',  bg:'#d1fae5', color:'#065f46' },
  process: { label:'Proses',  bg:'#dbeafe', color:'#1e40af' },
  pending: { label:'Pending', bg:'#fef3c7', color:'#92400e' },
  failed:  { label:'Gagal',   bg:'#fee2e2', color:'#991b1b' },
  expired: { label:'Expired', bg:'#f1f5f9', color:'#64748b' },
}

export default function RiwayatPage() {
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [checking, setChecking] = useState(false)
  const [copied, setCopied] = useState('')

  useEffect(() => { load() }, [tab])

  const load = async () => {
    setLoading(true)
    const r = await fetch(`/api/riwayat?tab=${tab}`).then(res => res.json())
    if (!r.success) { router.push('/login'); return }
    setData(r.data || [])
    setLoading(false)
  }

  const checkPremium = async (item) => {
    setChecking(true)
    const r = await fetch(`/api/premium/status?invoice=${item.invoice}`).then(res => res.json())
    setData(prev => prev.map(x => x.invoice === item.invoice ? { ...x, status:r.status, accounts:r.accounts } : x))
    setSelected(prev => prev ? { ...prev, status:r.status, accounts:r.accounts } : null)
    setChecking(false)
  }

  const copy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 2000)
  }

  const fmt = (d) => new Date(d).toLocaleDateString('id-ID',{ day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit' })

  return (
    <div style={{ background:'#f0f4ff',minHeight:'100dvh' }} className="page-content">
      {/* Header */}
      <div style={{ background:'linear-gradient(150deg,#0f2d6b,#1e40af,#2563eb)',padding:'48px 0 0' }}>
        <div style={{ padding:'0 20px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <Icon name="history" size={22} color="white" strokeWidth={2}/>
            <h1 style={{ margin:0,fontSize:20,fontWeight:800,color:'white' }}>Riwayat Transaksi</h1>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex',padding:'0 16px',gap:6 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding:'10px 16px',borderRadius:'12px 12px 0 0',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:700,fontSize:12,fontFamily:'Inter,sans-serif',whiteSpace:'nowrap',
                background:tab===t.key?'#f0f4ff':'rgba(255,255,255,0.12)',
                color:tab===t.key?'#2563eb':'rgba(255,255,255,0.8)' }}>
              <Icon name={t.icon} size={13} color={tab===t.key?'#2563eb':'rgba(255,255,255,0.8)'} strokeWidth={2}/>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px' }}>
        {loading ? (
          [...Array(5)].map((_,i) => <div key={i} className="shimmer" style={{ height:72,borderRadius:14,marginBottom:8 }}/>)
        ) : data.length === 0 ? (
          <div style={{ background:'white',borderRadius:20,padding:40,textAlign:'center',border:'1.5px solid #e8edf5' }}>
            <div style={{ width:56,height:56,borderRadius:18,background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
              <Icon name="history" size={26} color="#cbd5e1"/>
            </div>
            <p style={{ margin:0,fontWeight:700,color:'#374151',fontSize:15 }}>Belum ada riwayat</p>
            <p style={{ margin:'4px 0 0',color:'#94a3b8',fontSize:13 }}>Transaksi akan muncul di sini</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {data.map((item, i) => {
              const st = STATUS[item.status] || STATUS.pending
              const isDeposit = tab === 'deposit'
              const icolor = TYPE_COLOR[item.type || (isDeposit?'emoney':'other')] || '#64748b'
              const iname  = TYPE_ICON[item.type || (isDeposit?'wallet':'other')] || 'package'
              return (
                <button key={i} onClick={() => setSelected(item)}
                  style={{ display:'flex',alignItems:'center',gap:12,background:'white',borderRadius:16,padding:'13px 14px',border:'1.5px solid #e8edf5',cursor:'pointer',textAlign:'left',width:'100%',boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width:44,height:44,borderRadius:14,background:icolor+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <Icon name={iname} size={20} color={icolor} strokeWidth={1.9}/>
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#0f172a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>
                      {isDeposit ? 'Top Up QRIS' : item.productName}
                    </p>
                    <p style={{ margin:'2px 0 0',fontSize:11,color:'#94a3b8' }}>{fmt(item.createdAt)}</p>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <p style={{ margin:0,fontSize:13,fontWeight:800,color:isDeposit?'#059669':'#0f172a' }}>
                      {isDeposit?'+':'-'}Rp {Number(item.amount||item.price||0).toLocaleString('id-ID')}
                    </p>
                    <span style={{ display:'inline-block',marginTop:4,padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:700,background:st.bg,color:st.color }}>
                      {st.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width:36,height:4,borderRadius:99,background:'#e2e8f0',margin:'0 auto 22px' }}/>
            {/* Header */}
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:20 }}>
              <div style={{ width:50,height:50,borderRadius:16,background:(TYPE_COLOR[selected.type]||'#64748b')+'18',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name={TYPE_ICON[selected.type]||'package'} size={22} color={TYPE_COLOR[selected.type]||'#64748b'} strokeWidth={1.9}/>
              </div>
              <div>
                <p style={{ margin:0,fontSize:15,fontWeight:700,color:'#0f172a' }}>{selected.productName||'Top Up Saldo'}</p>
                <span style={{ display:'inline-block',marginTop:4,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,background:(STATUS[selected.status]||STATUS.pending).bg,color:(STATUS[selected.status]||STATUS.pending).color }}>
                  {(STATUS[selected.status]||STATUS.pending).label}
                </span>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ background:'#f8faff',borderRadius:16,padding:16,marginBottom:16 }}>
              {[
                ['Invoice', selected.invoice || selected._id?.slice(-12)],
                ['Tanggal', fmt(selected.createdAt)],
                selected.target && ['Tujuan', selected.target],
                selected.carrier && ['Operator', selected.carrier],
                ['Jumlah', `Rp ${Number(selected.amount||selected.price||0).toLocaleString('id-ID')}`],
              ].filter(Boolean).filter(([,v]) => v).map(([l, v]) => (
                <div key={l} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
                  <span style={{ fontSize:12,color:'#64748b' }}>{l}</span>
                  <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <span style={{ fontSize:12,fontWeight:700,color:'#0f172a',textAlign:'right',maxWidth:200,wordBreak:'break-all' }}>{v}</span>
                    {(l === 'Invoice') && (
                      <button onClick={() => copy(v)} style={{ background:'none',border:'none',cursor:'pointer',padding:4 }}>
                        <Icon name={copied===v?'check':'copy'} size={13} color={copied===v?'#10b981':'#94a3b8'}/>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Premium accounts */}
            {(selected.type==='premium' || tab==='premium') && selected.accounts?.length > 0 && (
              <div style={{ background:'linear-gradient(135deg,#fef3c7,#fffbeb)',borderRadius:16,padding:18,marginBottom:16,border:'1.5px solid #fde68a' }}>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14 }}>
                  <Icon name="crown" size={16} color="#b45309"/>
                  <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#92400e' }}>Detail Akun Premium</p>
                </div>
                {selected.accounts.map((acc, idx) => (
                  <div key={idx} style={{ background:'white',borderRadius:12,padding:'12px 14px',marginBottom:idx<selected.accounts.length-1?8:0 }}>
                    {[['Email / Username', acc.username], ['Password', acc.password]].map(([l,v]) => (
                      <div key={l} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6 }}>
                        <span style={{ fontSize:11,color:'#64748b' }}>{l}</span>
                        <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                          <span style={{ fontSize:12,fontWeight:700,color:'#0f172a',fontFamily:'monospace' }}>{v}</span>
                          <button onClick={() => copy(v)} style={{ background:'none',border:'none',cursor:'pointer',padding:2 }}>
                            <Icon name={copied===v?'check':'copy'} size={12} color={copied===v?'#10b981':'#94a3b8'}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {(selected.type==='premium' || tab==='premium') && (
              <button className="btn-primary" onClick={() => checkPremium(selected)} disabled={checking} style={{ marginBottom:10 }}>
                {checking
                  ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Spinner/> Mengecek status...</span>
                  : <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Icon name="refresh" size={17} color="white"/> Cek Status & Ambil Akun</span>}
              </button>
            )}
            <button className="btn-outline" onClick={() => setSelected(null)}>Tutup</button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  )
}

function Spinner() {
  return <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }}/>
}
