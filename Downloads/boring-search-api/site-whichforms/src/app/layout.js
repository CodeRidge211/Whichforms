import './globals.css';

export const metadata = {
  title: 'WhichForms — The paperwork you need, explained.',
  description: 'Stop searching for forms. Get plain English explanations, deadlines, and official download links for IRS, USCIS, and state forms.',
  openGraph: {
    type: 'website',
    url: 'https://whichforms.com/',
    title: 'WhichForms — The paperwork you need, explained.',
    description: 'Plain English explanations, deadlines, and official download links for IRS, USCIS, and state forms.',
  },
  twitter: {
    card: 'summary',
    title: 'WhichForms — Government Forms Explained',
    description: 'Stop searching for forms. Get plain English explanations and official download links for IRS, USCIS, and state forms.',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap' rel='stylesheet' />
        <link rel='canonical' href='https://whichforms.com/' />
      </head>
      <body style={{ margin: 0, fontFamily: 'Outfit, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}