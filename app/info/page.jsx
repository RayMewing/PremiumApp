'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon } from '@/components/Icons'

const CATS = [
  { key:'all',   label:'Semua'  },
  { key:'promo', label:'Promo'  },
  { key:'harga', label:'Harga'  },
  { key:'event', label:'Event'  },
  { key:'info',  label:'Info'   },
]
const CAT_C  = { info:'#2563eb', promo:'#db2777', event:'#7c3aed', harga:'#059669' }
const CAT_BG = { info:'#eff6ff', promo:'#fce7f3', event:'#f3e8ff', harga:'#d1fae5' }
const CAT_ICON = { info:'info', promo:'sparkle', event:'calendar', harga:'tag' }

export default function InfoPage() {
  const router = useRouter()
  const [cat, setCat] = useState('all')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/info?category=${cat}`).then(r=>r.json()).then(d => {
      if (!d.success) router.push('/login')
      else setData(d.data||[])
      setLoading(false)
    })
  }, [cat])

  const fmt = d => new Date(d).toLocaleDateString('id-ID',{ day:'numeric', month:'short', year:'numeric' })

  return (
    <div style={{ background:'#f0f4ff',minHeight:'100dvh' }} className="page-content">
      <div style={{ background:'linear-gradient(150deg,#0f2d6b,#1e40af,#2563eb)',padding:'48px 0 0' }}>
        <div style={{ padding:'0 20px 0',display:'flex',alignItems:'center',gap:10,marginBottom:20 }}>
          <Icon name="bell" size={22} color="white" strokeWidth={2}/>
          <h1 style={{ margin:0,fontSize:20,fontWeight:800,color:'white' }}>Pusat Info & Notif</h1>
        </div>
        <div style={{ display:'flex',padding:'0 16px',gap:6,overflowX:'auto' }}>
          {CATS.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{ padding:'10px 16px',borderRadius:'12px 12px 0 0',border:'none',cursor:'pointer',whiteSpace:'nowrap',fontWeight:700,fontSize:12,fontFamily:'Inter,sans-serif',
                background:cat===c.key?'#f0f4ff':'rgba(255,255,255,0.12)',
                color:cat===c.key?'#2563eb':'rgba(255,255,255,0.8)' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px' }}>
        {loading ? (
          [...Array(3)].map((_,i)=><div key={i} className="shimmer" style={{ height:130,borderRadius:18,marginBottom:12 }}/>)
        ) : data.length === 0 ? (
          <div style={{ background:'white',borderRadius:20,padding:40,textAlign:'center',border:'1.5px solid #e8edf5' }}>
            <div style={{ width:56,height:56,borderRadius:18,background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
              <Icon name="bell" size={26} color="#cbd5e1"/>
            </div>
            <p style={{ margin:0,fontWeight:700,color:'#374151',fontSize:15 }}>Belum ada info</p>
            <p style={{ margin:'4px 0 0',color:'#94a3b8',fontSize:13 }}>Cek lagi nanti</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {data.map((item,i) => (
              <button key={i} onClick={() => setSelected(item)}
                style={{ background:'white',borderRadius:18,border:'1.5px solid #e8edf5',cursor:'pointer',textAlign:'left',overflow:'hidden',width:'100%',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:0 }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width:'100%',height:150,objectFit:'cover',display:'block' }}/>}
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:7 }}>
                    <div style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:99,background:CAT_BG[item.category]||'#eff6ff' }}>
                      <Icon name={CAT_ICON[item.category]||'info'} size={11} color={CAT_C[item.category]||'#2563eb'}/>
                      <span style={{ fontSize:10,fontWeight:700,color:CAT_C[item.category]||'#2563eb' }}>{item.category?.toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize:11,color:'#94a3b8' }}>{fmt(item.createdAt)}</span>
                  </div>
                  <p style={{ margin:'0 0 4px',fontSize:14,fontWeight:700,color:'#0f172a' }}>{item.title}</p>
                  <p style={{ margin:'0 0 10px',fontSize:12,color:'#64748b',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{item.content}</p>
                  <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <div style={{ width:22,height:22,borderRadius:99,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <Icon name="user" size={11} color="#2563eb"/>
                    </div>
                    <span style={{ fontSize:11,fontWeight:600,color:'#64748b' }}>{item.author||'Admin'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-sheet" style={{ maxHeight:'88dvh' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36,height:4,borderRadius:99,background:'#e2e8f0',margin:'0 auto 18px' }}/>
            {selected.imageUrl && <img src={selected.imageUrl} alt="" style={{ width:'100%',height:180,objectFit:'cover',borderRadius:14,marginBottom:16 }}/>}
            <div style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:99,background:CAT_BG[selected.category]||'#eff6ff',marginBottom:10 }}>
              <Icon name={CAT_ICON[selected.category]||'info'} size={11} color={CAT_C[selected.category]||'#2563eb'}/>
              <span style={{ fontSize:10,fontWeight:700,color:CAT_C[selected.category]||'#2563eb' }}>{selected.category?.toUpperCase()}</span>
            </div>
            <h2 style={{ margin:'0 0 12px',fontSize:18,fontWeight:800,color:'#0f172a' }}>{selected.title}</h2>
            <p style={{ margin:'0 0 16px',fontSize:14,color:'#374151',lineHeight:1.7 }}>{selected.content}</p>
            <p style={{ margin:'0 0 20px',fontSize:12,color:'#94a3b8' }}>{new Date(selected.createdAt).toLocaleString('id-ID')} • {selected.author||'Admin'}</p>
            <button className="btn-outline" onClick={() => setSelected(null)}>Tutup</button>
          </div>
        </div>
      )}
      <BottomNav/>
    </div>
  )
}
