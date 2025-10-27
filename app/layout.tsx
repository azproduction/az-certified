import type { Metadata } from 'next'
import { Dancing_Script, Great_Vibes } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import StyledComponentsRegistry from '@/lib/registry'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
})

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-dancing-script',
})

export const metadata: Metadata = {
  title: 'AZ Certified',
  description: 'Test your knowledge and earn your certificate',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${dancingScript.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
