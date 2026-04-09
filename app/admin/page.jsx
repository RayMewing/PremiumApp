'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icons'

const MENU = [
  { key:'overview',   label:'Overview',    icon:'bar-chart' },
  { key:'banners',    label:'Banner',      icon:'image'     },
  { key:'deposit',    label:'Deposit',     icon:'dollar'    },
  { key:'ppob',       label:'PPOB',        icon:'zap'       },
  { key:'premium',    label:'Premium',     icon:'crown'     },
  { key:'users',      label:'Users',       icon:'users'     },
  { key:'settings',   label:'Setting',     icon:'settings'  },
]

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/user/me').then(r=>r.json()).then(d => {
      if (!d.success || d.user?.role !== 'admin') { router.push('/dashboard'); return }
      setUser(d.user)
    })
  }, [])

  if (!user) return (
    <div style={{ minHeight:'100dvh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ width:40,height:40,border:'3px solid #334155',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>
    </div>
  )

  return (
    <div style={{ minHeight:'100dvh',background:'#0f172a',display:'flex',flexDirection:'column' }}>
      {/* Topbar */}
      <div style={{ background:'#1e293b',borderBottom:'1px solid #334155',padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ width:34,height:34,borderRadius:10,background:'#334155',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Icon name="arrow-left" size={16} color="#94a3b8"/>
          </button>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:'linear-gradient(135deg,#2563eb,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Icon name="shield" size={15} color="white"/>
            </div>
            <p style={{ margin:0,fontSize:14,fontWeight:700,color:'white' }}>Admin Panel</p>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:7 }}>
          <div style={{ width:8,height:8,borderRadius:'50%',background:'#10b981' }}/>
          <span style={{ fontSize:12,color:'#64748b' }}>{user?.nama}</span>
        </div>
      </div>

      <div style={{ display:'flex',flex:1 }}>
        {/* Sidebar */}
        <div style={{ width:60,background:'#1e293b',borderRight:'1px solid #334155',display:'flex',flexDirection:'column',alignItems:'center',paddingTop:12,gap:2,position:'sticky',top:53,height:'calc(100dvh - 53px)' }}>
          {MENU.map(m => (
            <button key={m.key} onClick={() => setTab(m.key)} title={m.label}
              style={{ width:46,height:46,borderRadius:13,background:tab===m.key?'#2563eb':'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',margin:'1px 0' }}>
              <Icon name={m.icon} size={19} color={tab===m.key?'white':'#64748b'} strokeWidth={tab===m.key?2:1.7}/>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1,overflowY:'auto',maxHeight:'calc(100dvh - 53px)' }}>
          {tab==='overview' && <TabOverview onNav={setTab}/>}
          {tab==='banners'  && <TabBanners/>}
          {tab==='deposit'  && <TabDeposit/>}
          {tab==='ppob'     && <TabPPOB/>}
          {tab==='premium'  && <TabPremium/>}
          {tab==='users'    && <TabUsers/>}
          {tab==='settings' && <TabSettings/>}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════ OVERVIEW ═══════════════════════════ */
function TabOverview({ onNav }) {
  const [stats, setStats] = useState({ users:0, trx:0, pending:0, revenue:0 })
  useEffect(() => {
    fetch('/api/admin/stats').then(r=>r.json()).then(d => d.success && setStats(d.stats))
  }, [])

  const cards = [
    { label:'Total User',    val:stats.users,   icon:'users',     color:'#3b82f6' },
    { label:'Transaksi',     val:stats.trx,     icon:'history',   color:'#10b981' },
    { label:'Pending',       val:stats.pending, icon:'clock',     color:'#f59e0b' },
    { label:'Revenue (Rp)', val:`${Number(stats.revenue||0).toLocaleString('id-ID')}`, icon:'dollar', color:'#6366f1' },
  ]
  return (
    <div style={{ padding:18 }}>
      <h2 style={{ margin:'0 0 18px',color:'white',fontSize:17,fontWeight:700 }}>Overview</h2>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background:'#1e293b',borderRadius:14,padding:16,border:'1px solid #334155' }}>
            <div style={{ width:34,height:34,borderRadius:10,background:c.color+'22',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10 }}>
              <Icon name={c.icon} size={16} color={c.color}/>
            </div>
            <p style={{ margin:0,fontSize:22,fontWeight:800,color:'white' }}>{c.val}</p>
            <p style={{ margin:'3px 0 0',fontSize:11,color:'#64748b' }}>{c.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
        {[
          { label:'Konfirmasi Deposit', icon:'dollar',  k:'deposit',  color:'#10b981' },
          { label:'Cek PPOB Pending',   icon:'zap',     k:'ppob',     color:'#f59e0b' },
          { label:'Kelola Banner',      icon:'image',   k:'banners',  color:'#3b82f6' },
          { label:'Pengaturan Umum',    icon:'settings',k:'settings', color:'#6366f1' },
        ].map(i => (
          <button key={i.k} onClick={() => onNav(i.k)}
            style={{ display:'flex',alignItems:'center',gap:10,background:'#1e293b',border:'1px solid #334155',borderRadius:12,padding:'13px 14px',cursor:'pointer',color:'white' }}>
            <div style={{ width:30,height:30,borderRadius:8,background:i.color+'22',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Icon name={i.icon} size={14} color={i.color}/>
            </div>
            <span style={{ fontSize:12,fontWeight:600,color:'#94a3b8' }}>{i.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════ BANNERS ═══════════════════════════ */
function TabBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const blank = { title:'', subtitle:'', imageUrl:'', linkUrl:'', gradient:'linear-gradient(135deg,#1e40af,#2563eb)', isActive:true, order:0 }
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/banners').then(res=>res.json())
    setBanners(r.banners||[])
    setLoading(false)
  }

  const save = async () => {
    if (!form.title) return
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const body = editing ? { id:editing._id, ...form } : form
    await fetch('/api/admin/banners', { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    setMsg(editing ? 'Banner diperbarui!' : 'Banner ditambahkan!')
    setEditing(null); setForm(blank)
    await load(); setSaving(false)
    setTimeout(() => setMsg(''), 2500)
  }

  const del = async (id) => {
    if (!confirm('Hapus banner ini?')) return
    await fetch('/api/admin/banners', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) })
    await load()
  }

  const startEdit = (b) => {
    setEditing(b)
    setForm({ title:b.title, subtitle:b.subtitle||'', imageUrl:b.imageUrl||'', linkUrl:b.linkUrl||'', gradient:b.gradient||blank.gradient, isActive:b.isActive, order:b.order||0 })
  }

  const GRADS = [
    { label:'Biru',    val:'linear-gradient(135deg,#1e40af,#2563eb)' },
    { label:'Ungu',    val:'linear-gradient(135deg,#4c1d95,#7c3aed)' },
    { label:'Hijau',   val:'linear-gradient(135deg,#064e3b,#059669)' },
    { label:'Merah',   val:'linear-gradient(135deg,#991b1b,#dc2626)' },
    { label:'Emas',    val:'linear-gradient(135deg,#78350f,#d97706)' },
    { label:'Teal',    val:'linear-gradient(135deg,#0c4a6e,#0891b2)' },
    { label:'Pink',    val:'linear-gradient(135deg,#831843,#db2777)' },
    { label:'Slate',   val:'linear-gradient(135deg,#0f172a,#1e293b)' },
  ]

  return (
    <div style={{ padding:18 }}>
      <h2 style={{ margin:'0 0 16px',color:'white',fontSize:17,fontWeight:700 }}>Kelola Banner</h2>
      {msg && <div style={{ background:'#022c22',border:'1px solid #065f46',borderRadius:10,padding:'10px 14px',color:'#4ade80',fontSize:13,marginBottom:14 }}>✓ {msg}</div>}

      {/* Form */}
      <div style={{ background:'#1e293b',borderRadius:16,padding:18,marginBottom:18,border:'1px solid #334155' }}>
        <p style={{ margin:'0 0 14px',fontSize:12,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:0.8 }}>
          {editing ? 'Edit Banner' : 'Tambah Banner Baru'}
        </p>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          <AInput label="Judul *" val={form.title} onChange={v => setForm(f=>({...f,title:v}))} placeholder="Contoh: Promo Hari Ini!"/>
          <AInput label="Subjudul" val={form.subtitle} onChange={v => setForm(f=>({...f,subtitle:v}))} placeholder="Deskripsi singkat banner"/>
          <AInput label="URL Gambar" val={form.imageUrl} onChange={v => setForm(f=>({...f,imageUrl:v}))} placeholder="https://i.imgur.com/xxx.jpg"/>
          <AInput label="URL Tujuan (saat diklik)" val={form.linkUrl} onChange={v => setForm(f=>({...f,linkUrl:v}))} placeholder="/layanan/games atau https://..."/>
          <AInput label="Urutan (angka kecil = pertama)" val={String(form.order)} onChange={v => setForm(f=>({...f,order:parseInt(v)||0}))} type="number"/>

          {/* Gradient picker */}
          <div>
            <p style={{ margin:'0 0 8px',fontSize:12,fontWeight:600,color:'#64748b' }}>Warna Background</p>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              {GRADS.map(g => (
                <button key={g.val} onClick={() => setForm(f=>({...f,gradient:g.val}))} title={g.label}
                  style={{ width:34,height:34,borderRadius:9,background:g.val,border:`2.5px solid ${form.gradient===g.val?'white':'transparent'}`,cursor:'pointer',boxShadow:form.gradient===g.val?'0 0 0 2px #2563eb':undefined }}/>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.title && (
            <div>
              <p style={{ margin:'0 0 6px',fontSize:11,color:'#64748b' }}>Preview Banner:</p>
              <div style={{ background:form.gradient,borderRadius:14,padding:'16px 18px',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.08)' }}/>
                <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                  {form.imageUrl && <img src={form.imageUrl} alt="" style={{ width:44,height:44,borderRadius:12,objectFit:'cover',flexShrink:0 }} onError={e=>e.target.style.display='none'}/>}
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0,fontSize:14,fontWeight:800,color:'white' }}>{form.title}</p>
                    {form.subtitle && <p style={{ margin:'2px 0 0',fontSize:12,color:'rgba(255,255,255,0.75)' }}>{form.subtitle}</p>}
                  </div>
                  {form.linkUrl && <Icon name="chevron-right" size={18} color="rgba(255,255,255,0.6)"/>}
                </div>
              </div>
            </div>
          )}

          {/* Toggle active */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <span style={{ fontSize:13,color:'#94a3b8' }}>Aktifkan Banner</span>
            <button onClick={() => setForm(f=>({...f,isActive:!f.isActive}))}
              style={{ width:46,height:26,borderRadius:99,background:form.isActive?'#2563eb':'#334155',border:'none',cursor:'pointer',position:'relative',transition:'all 0.2s' }}>
              <span style={{ position:'absolute',top:3,left:form.isActive?22:3,width:20,height:20,borderRadius:'50%',background:'white',transition:'all 0.2s',display:'block' }}/>
            </button>
          </div>

          <div style={{ display:'flex',gap:8,marginTop:4 }}>
            <button onClick={save} disabled={saving||!form.title}
              style={{ flex:1,padding:'11px',background:'#2563eb',border:'none',borderRadius:11,color:'white',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:saving||!form.title?0.6:1 }}>
              <Icon name="check" size={15} color="white"/>
              {saving ? 'Menyimpan...' : editing ? 'Perbarui Banner' : 'Simpan Banner'}
            </button>
            {editing && (
              <button onClick={() => { setEditing(null); setForm(blank) }}
                style={{ padding:'11px 16px',background:'#334155',border:'none',borderRadius:11,color:'#94a3b8',fontSize:13,cursor:'pointer' }}>
                Batal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Banner list */}
      <p style={{ margin:'0 0 10px',fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:0.8 }}>Banner Tersimpan ({banners.length})</p>
      {loading ? <div className="shimmer" style={{ height:70,borderRadius:12 }}/> :
        banners.length === 0 ? <p style={{ color:'#475569',fontSize:13,textAlign:'center',padding:20 }}>Belum ada banner</p> :
        banners.map(b => (
          <div key={b._id} style={{ background:'#1e293b',borderRadius:12,padding:14,marginBottom:8,border:'1px solid #334155',display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:50,height:50,borderRadius:11,background:b.gradient||'#334155',flexShrink:0,overflow:'hidden',position:'relative' }}>
              {b.imageUrl && <img src={b.imageUrl} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'white' }}>{b.title}</p>
              {b.linkUrl && <p style={{ margin:'2px 0 0',fontSize:10,color:'#3b82f6',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{b.linkUrl}</p>}
              <div style={{ display:'flex',alignItems:'center',gap:6,marginTop:4 }}>
                <span style={{ fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:b.isActive?'#16223a':'#2a1a1a',color:b.isActive?'#60a5fa':'#ef4444' }}>
                  {b.isActive?'Aktif':'Nonaktif'}
                </span>
                <span style={{ fontSize:10,color:'#475569' }}>Urutan: {b.order||0}</span>
              </div>
            </div>
            <div style={{ display:'flex',gap:6 }}>
              <button onClick={() => startEdit(b)} style={{ width:32,height:32,borderRadius:9,background:'#334155',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name="edit" size={14} color="#60a5fa"/>
              </button>
              <button onClick={() => del(b._id)} style={{ width:32,height:32,borderRadius:9,background:'#2a1a1a',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name="trash" size={14} color="#f87171"/>
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

/* ═══════════════════════════ DEPOSIT ═══════════════════════════ */
function TabDeposit() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/deposits').then(res=>res.json())
    setDeposits(r.deposits||[])
    setLoading(false)
  }

  const action = async (id, act) => {
    const r = await fetch('/api/admin/deposits', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ id, action: act })
    }).then(res=>res.json())
    setMsg(r.message || (act==='confirm' ? 'Deposit dikonfirmasi!' : 'Deposit ditolak'))
    await load()
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <div style={{ padding:18 }}>
      <h2 style={{ margin:'0 0 16px',color:'white',fontSize:17,fontWeight:700 }}>Konfirmasi Deposit</h2>
      <p style={{ margin:'0 0 14px',fontSize:12,color:'#64748b' }}>Deposit pending — konfirmasi untuk kreditkan saldo, atau tolak jika tidak valid.</p>
      {msg && <MsgBox text={msg}/>}
      {loading ? Skeletons(3) : deposits.length === 0 ? <EmptyMsg text="Tidak ada deposit pending"/> :
        deposits.map(d => (
          <div key={d._id} style={{ background:'#1e293b',borderRadius:14,padding:14,marginBottom:10,border:'1px solid #334155' }}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:'#16213a',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name="wallet" size={16} color="#60a5fa"/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ margin:0,fontSize:12,fontWeight:700,color:'white' }}>{d.userId?.email || d.userId}</p>
                <p style={{ margin:0,fontSize:10,color:'#64748b' }}>{new Date(d.createdAt).toLocaleString('id-ID')} • {d.method}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ margin:0,fontSize:14,fontWeight:800,color:'#4ade80' }}>+Rp {Number(d.amount||0).toLocaleString('id-ID')}</p>
                <p style={{ margin:0,fontSize:10,color:'#64748b' }}>Bayar: Rp {Number((d.amount||0)+(d.fee||0)).toLocaleString('id-ID')}</p>
              </div>
            </div>
            <p style={{ margin:'0 0 10px',fontSize:9,color:'#475569',fontFamily:'monospace',wordBreak:'break-all' }}>{d.invoice}</p>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={() => action(d._id,'confirm')}
                style={{ flex:1,padding:'10px',background:'linear-gradient(135deg,#16a34a,#22c55e)',border:'none',borderRadius:10,color:'white',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                <Icon name="check" size={14} color="white"/> Konfirmasi
              </button>
              <button onClick={() => action(d._id,'reject')}
                style={{ flex:1,padding:'10px',background:'#2a1a1a',border:'1px solid #7f1d1d',borderRadius:10,color:'#f87171',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                <Icon name="x-circle" size={14} color="#f87171"/> Tolak
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

/* ═══════════════════════════ PPOB ═══════════════════════════ */
function TabPPOB() {
  const [trxs, setTrxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/ppob').then(res=>res.json())
    setTrxs(r.transactions||[])
    setLoading(false)
  }

  const action = async (id, act) => {
    const r = await fetch('/api/admin/ppob', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ id, action: act })
    }).then(res=>res.json())
    setMsg(r.message || 'Berhasil')
    await load()
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <div style={{ padding:18 }}>
      <h2 style={{ margin:'0 0 16px',color:'white',fontSize:17,fontWeight:700 }}>Status PPOB Pending</h2>
      <p style={{ margin:'0 0 14px',fontSize:12,color:'#64748b' }}>Sukses = tidak refund. Gagal = saldo dikembalikan ke user.</p>
      {msg && <MsgBox text={msg}/>}
      {loading ? Skeletons(3) : trxs.length === 0 ? <EmptyMsg text="Tidak ada PPOB pending"/> :
        trxs.map(t => (
          <div key={t._id} style={{ background:'#1e293b',borderRadius:14,padding:14,marginBottom:10,border:'1px solid #334155' }}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:'#1f1b09',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name="zap" size={16} color="#fbbf24"/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ margin:0,fontSize:12,fontWeight:700,color:'white',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{t.productName}</p>
                <p style={{ margin:'2px 0',fontSize:11,fontWeight:600,color:'#94a3b8' }}>Target: {t.target||'-'}</p>
                <p style={{ margin:0,fontSize:10,color:'#64748b' }}>{new Date(t.createdAt).toLocaleString('id-ID')}</p>
              </div>
              <div style={{ textAlign:'right',flexShrink:0 }}>
                <p style={{ margin:0,fontSize:13,fontWeight:800,color:'#fbbf24' }}>Rp {Number(t.price||0).toLocaleString('id-ID')}</p>
                <span style={{ fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:99,background:'#1f1b09',color:'#fbbf24' }}>PENDING</span>
              </div>
            </div>
            {(t.carrier) && (
              <div style={{ display:'flex',gap:6,marginBottom:8,flexWrap:'wrap' }}>
                {[['Operator',t.carrier]].map(([l,v]) => (
                  <span key={l} style={{ fontSize:10,background:'#16213a',color:'#93c5fd',padding:'3px 8px',borderRadius:7,fontWeight:700 }}>{l}: {v}</span>
                ))}
              </div>
            )}
            <p style={{ margin:'0 0 10px',fontSize:9,color:'#475569',fontFamily:'monospace',wordBreak:'break-all' }}>{t.invoice}</p>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={() => action(t._id,'success')}
                style={{ flex:1,padding:'10px',background:'linear-gradient(135deg,#16a34a,#22c55e)',border:'none',borderRadius:10,color:'white',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                <Icon name="check" size={14} color="white"/> Sukses
              </button>
              <button onClick={() => action(t._id,'refund')}
                style={{ flex:1,padding:'10px',background:'#2a1a1a',border:'1px solid #7f1d1d',borderRadius:10,color:'#f87171',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                <Icon name="x-circle" size={14} color="#f87171"/> Gagal + Refund
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

/* ═══════════════════════════ PREMIUM ═══════════════════════════ */
function TabPremium() {
  const [prods, setProds] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name:'', imgUrl:'', email:'', password:'', note:'', priceM:0, priceO:0 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/custom-prods').then(res=>res.json())
    setProds(r.products||[])
    setLoading(false)
  }

  const add = async () => {
    if (!form.name || !form.email) return
    setSaving(true)
    await fetch('/api/admin/custom-prods', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    setMsg('Produk ditambahkan!'); setForm({ name:'',imgUrl:'',email:'',password:'',note:'',priceM:0,priceO:0 })
    await load(); setSaving(false)
    setTimeout(() => setMsg(''), 2500)
  }

  const del = async (id) => {
    if (!confirm('Hapus produk ini?')) return
    await fetch('/api/admin/custom-prods', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) })
    await load()
  }

  const refreshCache = async () => {
    setRefreshing(true)
    await fetch('/api/admin/cache-refresh', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type:'prem'}) })
    setMsg('Cache premium diperbarui!'); setRefreshing(false)
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <div style={{ padding:18 }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
        <h2 style={{ margin:0,color:'white',fontSize:17,fontWeight:700 }}>Produk Premium Manual</h2>
        <button onClick={refreshCache} disabled={refreshing}
          style={{ padding:'8px 12px',background:'#334155',border:'none',borderRadius:9,color:'#94a3b8',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
          <Icon name="refresh" size={13} color="#94a3b8"/>
          {refreshing ? 'Updating...' : 'Refresh Cache'}
        </button>
      </div>
      {msg && <MsgBox text={msg}/>}

      {/* Add form */}
      <div style={{ background:'#1e293b',borderRadius:14,padding:16,marginBottom:16,border:'1px solid #334155' }}>
        <p style={{ margin:'0 0 12px',fontSize:11,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:0.8 }}>Tambah Produk Stok Manual</p>
        <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
          <AInput label="Nama Produk *" val={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Netflix Premium 1 Bulan"/>
          <AInput label="URL Gambar" val={form.imgUrl} onChange={v=>setForm(f=>({...f,imgUrl:v}))} placeholder="https://..."/>
          <AInput label="Email / Username *" val={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="email@example.com"/>
          <AInput label="Password *" val={form.password} onChange={v=>setForm(f=>({...f,password:v}))} placeholder="password123"/>
          <AInput label="Catatan / Info Tambahan" val={form.note} onChange={v=>setForm(f=>({...f,note:v}))} placeholder="Akun sharing, jangan ganti password"/>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
            <AInput label="Harga Member (Rp)" val={String(form.priceM)} onChange={v=>setForm(f=>({...f,priceM:parseInt(v)||0}))} type="number"/>
            <AInput label="Harga Official (Rp)" val={String(form.priceO)} onChange={v=>setForm(f=>({...f,priceO:parseInt(v)||0}))} type="number"/>
          </div>
          <button onClick={add} disabled={saving||!form.name||!form.email}
            style={{ padding:'11px',background:'#2563eb',border:'none',borderRadius:11,color:'white',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:saving||!form.name||!form.email?0.6:1 }}>
            <Icon name="plus" size={15} color="white"/>
            {saving ? 'Menyimpan...' : 'Tambah ke Stok'}
          </button>
        </div>
      </div>

      {/* Products */}
      <p style={{ margin:'0 0 10px',fontSize:11,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:0.8 }}>Stok Produk ({prods.length})</p>
      {loading ? Skeletons(3) : prods.length === 0 ? <EmptyMsg text="Stok kosong"/> :
        prods.map(p => (
          <div key={p._id} style={{ background:'#1e293b',borderRadius:12,padding:14,marginBottom:8,border:'1px solid #334155',display:'flex',gap:12,alignItems:'center' }}>
            {p.imgUrl
              ? <img src={p.imgUrl} alt="" style={{ width:44,height:44,borderRadius:11,objectFit:'cover',flexShrink:0 }} onError={e=>e.target.style.display='none'}/>
              : <div style={{ width:44,height:44,borderRadius:11,background:'#334155',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><Icon name="crown" size={20} color="#fbbf24"/></div>
            }
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'white' }}>{p.name}</p>
              <p style={{ margin:'2px 0',fontSize:11,color:'#64748b',fontFamily:'monospace' }}>{p.email}</p>
              <p style={{ margin:0,fontSize:12,fontWeight:700,color:'#3b82f6' }}>Rp {Number(p.priceM||0).toLocaleString('id-ID')}</p>
            </div>
            <button onClick={() => del(p._id)} style={{ width:32,height:32,borderRadius:9,background:'#2a1a1a',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Icon name="trash" size={14} color="#f87171"/>
            </button>
          </div>
        ))
      }
    </div>
  )
}

/* ═══════════════════════════ USERS ═══════════════════════════ */
function TabUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const [saldoAdd, setSaldoAdd] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [q])

  const load = async () => {
    setLoading(true)
    const r = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`).then(res=>res.json())
    setUsers(r.users||[])
    setLoading(false)
  }

  const doAction = async (id, action, val) => {
    const r = await fetch('/api/admin/users', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,action,value:val}) }).then(res=>res.json())
    setMsg(r.message||'Berhasil')
    await load()
    if (sel?._id === id) setSel(prev => ({ ...prev, ...r.user }))
    setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div style={{ padding:18 }}>
      <h2 style={{ margin:'0 0 14px',color:'white',fontSize:17,fontWeight:700 }}>Kelola User ({users.length})</h2>
      {msg && <MsgBox text={msg}/>}

      <div style={{ position:'relative',marginBottom:12 }}>
        <div style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}><Icon name="user" size={14} color="#64748b"/></div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari email atau nama..."
          style={{ width:'100%',padding:'10px 12px 10px 34px',background:'#1e293b',border:'1px solid #334155',borderRadius:11,color:'white',fontSize:13,outline:'none',boxSizing:'border-box',fontFamily:'Inter,sans-serif' }}/>
      </div>

      {loading ? Skeletons(4) :
        users.map(u => (
          <div key={u._id} onClick={() => setSel(u)}
            style={{ background:'#1e293b',borderRadius:12,padding:'12px 14px',marginBottom:8,border:'1px solid #334155',cursor:'pointer',display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:'#334155',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#60a5fa',flexShrink:0 }}>
              {u.nama?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'white' }}>{u.nama}</p>
              <p style={{ margin:'1px 0 0',fontSize:11,color:'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{u.email}</p>
            </div>
            <div style={{ textAlign:'right',flexShrink:0 }}>
              <p style={{ margin:0,fontSize:12,fontWeight:700,color:'#60a5fa' }}>Rp {(u.saldo||0).toLocaleString('id-ID')}</p>
              <span style={{ fontSize:10,fontWeight:700,color:u.isActive?'#4ade80':'#f87171' }}>{u.isActive?'Aktif':'Blokir'}</span>
            </div>
          </div>
        ))
      }

      {/* User modal */}
      {sel && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:300,display:'flex',alignItems:'flex-end',justifyContent:'center' }} onClick={() => setSel(null)}>
          <div style={{ background:'#1e293b',borderRadius:'20px 20px 0 0',width:'100%',maxWidth:480,padding:22,maxHeight:'85dvh',overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36,height:4,borderRadius:99,background:'#334155',margin:'0 auto 18px' }}/>
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:18 }}>
              <div style={{ width:48,height:48,borderRadius:14,background:'#334155',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:'#60a5fa' }}>
                {sel.nama?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ margin:0,fontSize:16,fontWeight:700,color:'white' }}>{sel.nama}</p>
                <p style={{ margin:0,fontSize:12,color:'#64748b' }}>{sel.email}</p>
              </div>
              <span style={{ marginLeft:'auto',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:99,background:sel.role==='admin'?'#1e3a8a':'#1a2744',color:sel.role==='admin'?'#93c5fd':'#64748b' }}>
                {sel.role?.toUpperCase()}
              </span>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14 }}>
              {[['Saldo',`Rp ${(sel.saldo||0).toLocaleString('id-ID')}`],['Total Deposit',sel.totalDeposit||0],['Transaksi',sel.totalTransaksi||0],['Bergabung',new Date(sel.joinedAt||sel.createdAt).toLocaleDateString('id-ID')]].map(([l,v])=>(
                <div key={l} style={{ background:'#0f172a',borderRadius:10,padding:'10px 12px' }}>
                  <p style={{ margin:0,fontSize:10,color:'#64748b' }}>{l}</p>
                  <p style={{ margin:'3px 0 0',fontSize:13,fontWeight:700,color:'#60a5fa' }}>{v}</p>
                </div>
              ))}
            </div>
            {/* Add saldo */}
            <div style={{ display:'flex',gap:8,marginBottom:10 }}>
              <input value={saldoAdd} onChange={e=>setSaldoAdd(e.target.value)} type="number" placeholder="Tambah saldo..."
                style={{ flex:1,padding:'10px 12px',background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'white',fontSize:13,outline:'none',fontFamily:'Inter,sans-serif' }}/>
              <button onClick={() => { doAction(sel._id,'add-saldo',saldoAdd); setSaldoAdd('') }}
                style={{ padding:'10px 14px',background:'#2563eb',border:'none',borderRadius:10,color:'white',fontSize:12,fontWeight:700,cursor:'pointer' }}>
                Tambah
              </button>
            </div>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={() => doAction(sel._id,'toggle-block',!sel.isActive)}
                style={{ flex:1,padding:'11px',background:sel.isActive?'#2a1a1a':'#022c22',border:`1px solid ${sel.isActive?'#7f1d1d':'#065f46'}`,borderRadius:10,color:sel.isActive?'#f87171':'#4ade80',fontSize:12,fontWeight:700,cursor:'pointer' }}>
                {sel.isActive?'Blokir Akun':'Aktifkan Akun'}
              </button>
              <button onClick={() => doAction(sel._id,'set-role',sel.role==='admin'?'member':'admin')}
                style={{ flex:1,padding:'11px',background:'#16213a',border:'1px solid #334155',borderRadius:10,color:'#60a5fa',fontSize:12,fontWeight:700,cursor:'pointer' }}>
                {sel.role==='admin'?'Jadikan Member':'Jadikan Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════ SETTINGS ═══════════════════════════ */
function TabSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [cacheRefreshing, setCacheRefreshing] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r=>r.json()).then(d => { setSettings(d.settings||{}); setLoading(false) })
  }, [])

  const save = async () => {
    setSaving(true)
    const r = await fetch('/api/admin/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(settings) }).then(res=>res.json())
    setMsg(r.message||'Pengaturan disimpan!')
    setSaving(false); setTimeout(() => setMsg(''), 2500)
  }

  const refreshCache = async (type) => {
    setCacheRefreshing(type)
    await fetch('/api/admin/cache-refresh', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type}) })
    setMsg(`Cache ${type} diperbarui!`)
    setCacheRefreshing(false); setTimeout(() => setMsg(''), 2500)
  }

  const U = (key) => (v) => setSettings(s => ({...s, [key]: v}))

  return (
    <div style={{ padding:18 }}>
      <h2 style={{ margin:'0 0 16px',color:'white',fontSize:17,fontWeight:700 }}>Pengaturan Umum</h2>
      {msg && <MsgBox text={msg}/>}

      {loading ? <div className="shimmer" style={{ height:300,borderRadius:14 }}/> :
        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
          <Section title="Identitas Aplikasi" icon="sparkle">
            <AInput label="Nama Aplikasi" val={settings.app_name||''} onChange={U('app_name')} placeholder="PremiumKita"/>
            <AInput label="Tagline" val={settings.app_tagline||''} onChange={U('app_tagline')} placeholder="Layanan Digital Terpercaya"/>
          </Section>

          <Section title="Logo & Email Branding" icon="image">
            <AInput label="URL Logo (tampil di email & UI)" val={settings.app_logo_url||''} onChange={U('app_logo_url')} placeholder="https://i.imgur.com/logo.png"/>
            {settings.app_logo_url && (
              <div style={{ background:'#0f172a',borderRadius:10,padding:12,display:'flex',alignItems:'center',gap:10 }}>
                <img src={settings.app_logo_url} alt="logo" style={{ height:40,width:'auto',maxWidth:80,borderRadius:8,objectFit:'contain' }} onError={e=>e.target.style.display='none'}/>
                <p style={{ margin:0,fontSize:11,color:'#64748b' }}>Preview logo di email</p>
              </div>
            )}
            <AInput label="Warna Header Email (hex)" val={settings.email_header_color||'#2563eb'} onChange={U('email_header_color')} placeholder="#2563eb"/>
            <div style={{ height:36,borderRadius:10,background:settings.email_header_color||'#2563eb',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ color:'white',fontSize:12,fontWeight:600 }}>Preview warna header email</span>
            </div>
          </Section>

          <Section title="Deposit & Fee" icon="dollar">
            <AInput label="Fee Admin QRIS (Rp)" val={String(settings.deposit_fee||200)} onChange={v=>setSettings(s=>({...s,deposit_fee:parseInt(v)||0}))} type="number"/>
            <AInput label="Minimal Deposit (Rp)" val={String(settings.min_deposit||10000)} onChange={v=>setSettings(s=>({...s,min_deposit:parseInt(v)||0}))} type="number"/>
            <AInput label="Maksimal Deposit (Rp)" val={String(settings.max_deposit||10000000)} onChange={v=>setSettings(s=>({...s,max_deposit:parseInt(v)||0}))} type="number"/>
          </Section>

          <Section title="Kontak CS" icon="phone">
            <AInput label="No. WhatsApp CS (628xxx)" val={settings.whatsapp_cs||''} onChange={U('whatsapp_cs')} placeholder="6281234567890"/>
          </Section>

          <Section title="Cache API" icon="refresh">
            <p style={{ margin:'0 0 10px',fontSize:12,color:'#64748b' }}>Perbarui harga produk dari server API</p>
            <div style={{ display:'flex',gap:8',flexWrap:'wrap' }}>
              {[['ppob','PPOB / Atlantic'],['prem','Akun Premium'],['nokos','Nokos'],['all','Semua Cache']].map(([t,l]) => (
                <button key={t} onClick={() => refreshCache(t)} disabled={cacheRefreshing===t}
                  style={{ flex:1,padding:'9px',background:'#334155',border:'none',borderRadius:10,color:cacheRefreshing===t?'#94a3b8':'#60a5fa',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,minWidth:90 }}>
                  <Icon name="refresh" size={12} color={cacheRefreshing===t?'#94a3b8':'#60a5fa'}/>
                  {cacheRefreshing===t ? 'Updating...' : l}
                </button>
              ))}
            </div>
          </Section>

          <button onClick={save} disabled={saving}
            style={{ width:'100%',padding:'14px',background:'linear-gradient(135deg,#1d4ed8,#2563eb)',border:'none',borderRadius:13,color:'white',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:saving?0.7:1 }}>
            <Icon name="check" size={17} color="white"/>
            {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      }
    </div>
  )
}

/* ─── Shared components ─── */
function AInput({ label, val, onChange, placeholder, type='text' }) {
  return (
    <div>
      <p style={{ margin:'0 0 5px',fontSize:11,fontWeight:600,color:'#64748b' }}>{label}</p>
      <input value={val} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{ width:'100%',padding:'10px 12px',background:'#0f172a',border:'1px solid #334155',borderRadius:9,color:'white',fontSize:13,outline:'none',boxSizing:'border-box',fontFamily:'Inter,sans-serif' }}/>
    </div>
  )
}
function Section({ title, icon, children }) {
  return (
    <div style={{ background:'#1e293b',borderRadius:14,padding:16,border:'1px solid #334155' }}>
      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14,paddingBottom:12,borderBottom:'1px solid #334155' }}>
        <Icon name={icon} size={14} color="#60a5fa"/>
        <p style={{ margin:0,fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:0.8 }}>{title}</p>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>{children}</div>
    </div>
  )
}
function MsgBox({ text }) {
  return <div style={{ background:'#022c22',border:'1px solid #065f46',borderRadius:10,padding:'10px 14px',color:'#4ade80',fontSize:13,marginBottom:12 }}>✓ {text}</div>
}
function EmptyMsg({ text }) {
  return <div style={{ textAlign:'center',padding:'28px 0',color:'#475569',fontSize:13 }}>{text}</div>
}
function Skeletons(n) {
  return [...Array(n)].map((_,i) => <div key={i} className="shimmer" style={{ height:64,borderRadius:12,marginBottom:8,background:'#1e293b' }}/>)
}
