'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from './Icons'

const NAV = [
  { key:'dashboard', href:'/dashboard',  label:'Beranda', icon:'home'    },
  { key:'riwayat',   href:'/riwayat',    label:'Riwayat', icon:'history' },
  { key:'deposit',   href:'/deposit',    label:'Deposit', icon:'wallet'  },
  { key:'info',      href:'/info',       label:'Info',    icon:'bell'    },
  { key:'profil',    href:'/profil',     label:'Profil',  icon:'user'    },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav style={{ position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,height:68,background:'rgba(255,255,255,0.97)',backdropFilter:'blur(20px)',borderTop:'1px solid #e2e8f0',zIndex:100,display:'flex' }}>
      {NAV.map((item) => {
        const active = pathname === item.href || (item.key === 'deposit' && pathname.startsWith('/deposit'))
        const isDeposit = item.key === 'deposit'
        return (
          <button key={item.key} onClick={() => router.push(item.href)}
            style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',padding:'8px 0',position:'relative' }}>
            {isDeposit ? (
              <div style={{ width:50,height:50,background:active?'linear-gradient(135deg,#1d4ed8,#2563eb)':'linear-gradient(135deg,#3b82f6,#2563eb)',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',marginTop:-22,boxShadow:'0 4px 18px rgba(37,99,235,0.45)',border:'3px solid white' }}>
                <Icon name="wallet" size={20} color="white" strokeWidth={2}/>
              </div>
            ) : (
              <Icon name={item.icon} size={22} color={active?'#2563eb':'#94a3b8'} strokeWidth={active?2.2:1.7}/>
            )}
            <span style={{ fontSize:10,fontWeight:isDeposit?700:active?700:500,color:isDeposit?(active?'#2563eb':'#94a3b8'):active?'#2563eb':'#94a3b8',fontFamily:'Inter,sans-serif' }}>
              {item.label}
            </span>
            {active && !isDeposit && (
              <span style={{ position:'absolute',bottom:0,width:20,height:3,background:'#2563eb',borderRadius:'3px 3px 0 0' }}/>
            )}
          </button>
        )
      })}
    </nav>
  )
}
