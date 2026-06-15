import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RegistrarSW } from '@/components/RegistrarSW';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Bitácora de Verano · Safari',
  description:
    'Registro observacional socioemocional para el curso de verano con ' +
    'tema safari. Enfoque no patologizante, confidencial y 100% en tu dispositivo.',
  manifest: '/manifest.webmanifest',
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
