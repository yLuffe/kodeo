import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import './globals.css';

const base = process.env.NEXT_PUBLIC_KODEO_BASE_PATH ?? '';

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#102c54' };

export const metadata: Metadata = {
  title: 'Kodeo — Seu próximo passo começa aqui',
  manifest: `${base}/manifest.webmanifest`,
  icons: { icon: `${base}/kodeo.svg`, apple: `${base}/kodeo-180.png` },
  appleWebApp: { capable: true, title: 'Kodeo', statusBarStyle: 'default' },
  description: 'Sua jornada de aprendizado em programação e cibersegurança.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><AppRouterCacheProvider>{children}</AppRouterCacheProvider></body></html>;
}
