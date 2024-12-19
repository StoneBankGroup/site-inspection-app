export const metadata = {
  title: 'Site Inspection App',
  description: 'Building site inspection and plan annotation tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}