import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const klavika = localFont({
  src: [
    { path: '../public/fonts/klavika-bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/klavika-bold-italic.woff2', weight: '700', style: 'italic' },
    { path: '../public/fonts/klavika-medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/klavika-medium-italic.woff2', weight: '500', style: 'italic' },
    { path: '../public/fonts/klavika-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/klavika-regular-italic.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/klavika-light.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/klavika-light-italic.woff2', weight: '300', style: 'italic' },
  ],
  variable: '--font-klavika',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Demos — Almost Impossible Agency',
  description:
    'Live experiments, client-facing previews, and microsites hosted on agency infrastructure.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${klavika.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
