import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RegistrarSW } from '@/components/RegistrarSW';
import { Providers } from '@/components/Providers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitacora-de-verano.app';
const DESCRIPCION =
  'Registro observacional socioemocional para el curso de verano con tema ' +
  'safari. Enfoque no patologizante, confidencial y 100% en tu dispositivo.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Bitácora de Verano',
  title: {
    default: 'Bitácora de Verano · Safari',
    template: '%s · Bitácora de Verano',
  },
  description: DESCRIPCION,
  keywords: [
    'curso de verano',
    'registro socioemocional',
    'observación infantil',
    'bitácora',
    'semáforo emocional',
    'psicología educativa',
  ],
  authors: [{ name: 'Br. Edy Medina' }],
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: false },
  // Herramienta privada con datos de menores: NO debe indexarse por buscadores
  // ni por crawlers de IA. La privacidad pesa más que la visibilidad.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Bitácora de Verano',
    title: 'Bitácora de Verano · Safari 🐾',
    description: DESCRIPCION,
    images: [{ url: '/icons/icon-512.png', width: 512, height: 512 }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bitácora',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f7728',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
        <RegistrarSW />
      </body>
    </html>
  );
}
