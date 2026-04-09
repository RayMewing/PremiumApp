const ATL_BASE = process.env.API_ATLANTIC_BASE || 'https://atlantich2h.com'
const ATL_KEY = process.env.API_ATLANTIC_KEY || ''
const PREMKU_BASE = process.env.API_PREMKU_BASE || 'https://premku.com/api'
const PREMKU_KEY = process.env.API_PREMKU_KEY || ''
const RO_BASE = process.env.API_RUMAHOTP_BASE || 'https://www.rumahotp.io/api/v2'
const RO_KEY = process.env.API_RUMAHOTP_KEY || ''

async function apiPost(url, data, headers = {}) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...headers },
      body: new URLSearchParams(data).toString(),
    })
    return await res.json()
  } catch (e) {
    return { success: false, message: e.message }
  }
}

async function apiPostJSON(url, data, headers = {}) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
    })
    return await res.json()
  } catch (e) {
    return { success: false, message: e.message }
  }
}

async function apiGet(url, params = {}, headers = {}) {
  try {
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`${url}${qs ? '?' + qs : ''}`, {
      headers: { Accept: 'application/json', ...headers },
    })
    return await res.json()
  } catch (e) {
    return { success: false, message: e.message }
  }
}

// === ATLANTIC H2H (PPOB) ===
export const atlantic = {
  // Cek saldo
  checkSaldo: () => apiPost(`${ATL_BASE}/api/saldo`, { api_key: ATL_KEY }),

  // Cek harga produk
  getProducts: (type) => apiPost(`${ATL_BASE}/api/pricelist`, { api_key: ATL_KEY, type }),

  // Order PPOB
  order: (code, target, ref) => apiPost(`${ATL_BASE}/api/order`, {
    api_key: ATL_KEY,
    code,
    target,
    ref,
  }),

  // Cek status order
  checkOrder: (ref) => apiPost(`${ATL_BASE}/api/checkorder`, { api_key: ATL_KEY, ref }),

  // Create QRIS deposit
  createQRIS: (amount, ref) => apiPost(`${ATL_BASE}/api/mutasi/create`, {
    api_key: ATL_KEY,
    amount,
    ref,
    type: 'qris',
  }),

  // Cek status deposit
  checkDeposit: (ref) => apiPost(`${ATL_BASE}/api/mutasi/check`, { api_key: ATL_KEY, ref }),
}

// === PREMKU (Premium Accounts) ===
export const premku = {
  getProducts: () => apiPostJSON(`${PREMKU_BASE}/product`, { api_key: PREMKU_KEY }),
  
  order: (code, qty) => apiPostJSON(`${PREMKU_BASE}/order`, {
    api_key: PREMKU_KEY,
    product_code: code,
    qty,
  }),

  checkStatus: (invoice) => apiPostJSON(`${PREMKU_BASE}/status`, {
    api_key: PREMKU_KEY,
    invoice,
  }),
}

// === RUMAHOTP (Virtual Numbers) ===
export const rumahotp = {
  getCountries: () => apiGet(`${RO_BASE}/country`, {}, { 'x-apikey': RO_KEY }),
  getServices: () => apiGet(`${RO_BASE}/service`, {}, { 'x-apikey': RO_KEY }),
  getNumber: (country, service) => apiGet(`${RO_BASE}/number`, { country, service }, { 'x-apikey': RO_KEY }),
  getOTP: (id) => apiGet(`${RO_BASE}/otp/${id}`, {}, { 'x-apikey': RO_KEY }),
  cancelNumber: (id) => apiGet(`${RO_BASE}/cancel/${id}`, {}, { 'x-apikey': RO_KEY }),
}
