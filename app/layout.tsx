import type { Metadata } from 'next'
import { Dancing_Script, Great_Vibes, Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import StyledComponentsRegistry from '@/lib/registry'

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
})

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
  metadataBase: new URL('https://azproduction.github.io/az-certified'),
  title: 'A.Z. Certified Exam',
  description: 'Cosplay Photography Excellence Certification - Test your knowledge and earn your professional certification. Globally recognized qualification for photography excellence.',
  keywords: ['cosplay photography', 'certification', 'professional exam', 'photography certification', 'A.Z. certified'],
  authors: [{ name: 'A.Z. Production' }],
  openGraph: {
    title: 'A.Z. Certified Exam',
    description: 'Cosplay Photography Excellence Certification - Test your knowledge and earn your professional certification.',
    type: 'website',
    locale: 'en_US',
    siteName: 'A.Z. Certified',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'A.Z. Certified Exam - Cosplay Photography Excellence Certification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A.Z. Certified Exam',
    description: 'Cosplay Photography Excellence Certification - Test your knowledge and earn your professional certification.',
    images: ['/og-image.jpg'],
    creator: '@azproductioncos',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${greatVibes.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
