import './globals.css'

export const metadata = {
  title: 'PremiumKita — Layanan Digital Terpercaya',
  description: 'Platform jual beli layanan digital: pulsa, data, e-money, akun premium dan lainnya.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  )
}
