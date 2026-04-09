const CARRIER_MAP = {
  // Telkomsel
  '0811': 'Telkomsel', '0812': 'Telkomsel', '0813': 'Telkomsel',
  '0821': 'Telkomsel', '0822': 'Telkomsel', '0823': 'Telkomsel',
  '0851': 'Telkomsel', '0852': 'Telkomsel', '0853': 'Telkomsel',
  // Indosat (IM3 Ooredoo)
  '0814': 'Indosat', '0815': 'Indosat', '0816': 'Indosat',
  '0855': 'Indosat', '0856': 'Indosat', '0857': 'Indosat', '0858': 'Indosat',
  // XL Axiata
  '0817': 'XL', '0818': 'XL', '0819': 'XL',
  '0859': 'XL', '0877': 'XL', '0878': 'XL', '0876': 'XL',
  // Axis (XL)
  '0831': 'Axis', '0832': 'Axis', '0833': 'Axis', '0838': 'Axis',
  // Smartfren
  '0881': 'Smartfren', '0882': 'Smartfren', '0883': 'Smartfren',
  '0884': 'Smartfren', '0885': 'Smartfren', '0886': 'Smartfren',
  '0887': 'Smartfren', '0888': 'Smartfren', '0889': 'Smartfren',
  // Three (3)
  '0895': 'Three', '0896': 'Three', '0897': 'Three', '0898': 'Three', '0899': 'Three',
}

const CARRIER_COLORS = {
  'Telkomsel': { bg: '#FF0000', text: '#fff', logo: 'T' },
  'Indosat': { bg: '#FFCC00', text: '#000', logo: 'I' },
  'XL': { bg: '#0066AE', text: '#fff', logo: 'XL' },
  'Axis': { bg: '#6200EA', text: '#fff', logo: 'AX' },
  'Smartfren': { bg: '#E31E24', text: '#fff', logo: 'SF' },
  'Three': { bg: '#F58220', text: '#fff', logo: '3' },
}

export function detectCarrier(phone) {
  if (!phone) return null
  const clean = phone.replace(/\D/g, '')
  let normalized = clean
  if (clean.startsWith('62')) normalized = '0' + clean.slice(2)
  if (clean.startsWith('+62')) normalized = '0' + clean.slice(3)
  const prefix = normalized.slice(0, 4)
  const name = CARRIER_MAP[prefix] || null
  if (!name) return null
  return { name, ...CARRIER_COLORS[name], prefix }
}

export function normalizePhone(phone) {
  const clean = phone.replace(/\D/g, '')
  if (clean.startsWith('62')) return '0' + clean.slice(2)
  if (clean.startsWith('0')) return clean
  return '0' + clean
}

// PPOB product code mapping per carrier
export const PPOB_CODES = {
  pulsa: {
    Telkomsel: 'TSEL',
    Indosat: 'ISAT',
    XL: 'XL',
    Axis: 'AXIS',
    Smartfren: 'SF',
    Three: 'THREE',
  },
  data: {
    Telkomsel: 'TSELDATA',
    Indosat: 'ISATDATA',
    XL: 'XLDATA',
    Axis: 'AXISDATA',
    Smartfren: 'SFDATA',
    Three: 'THREEDATA',
  }
}
