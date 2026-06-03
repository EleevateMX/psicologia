import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RegistrarSW } from '@/components/RegistrarSW';

export const metadata: Metadata = {
  title: 'Bitácora de Verano',
  description:
    'Registro observacional socioemocional para el curso de verano. ' +
    'Enfoque no patologizante y confidencial.',
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
  themeColor: '#296c69',
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
        {children}
        <RegistrarSW />
      </body>
    </html>
  );
}
