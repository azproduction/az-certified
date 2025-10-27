import type { Metadata } from 'next'
import { Dancing_Script, Great_Vibes, Playfair_Display } from 'next/font/google'
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

const playfairDisplay = Playfair_Display({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'A.Z. Certified Exam',
  description: 'Cosplay Photography Excellence Certification',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
