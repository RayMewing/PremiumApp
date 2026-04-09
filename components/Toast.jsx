'use client'
import { useEffect, useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])
  const show = (msg, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }
  return { toasts, toast: { success: m => show(m,'success'), error: m => show(m,'error'), info: m => show(m,'info') } }
}

export default function ToastContainer({ toasts }) {
  return (
    <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:9999, display:'flex', flexDirection:'column', gap:8, width:'90%', maxWidth:380 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  )
}
