'use client'; // Context providers are client components

import { VT323, Press_Start_2P } from 'next/font/google'
import './globals.css'
import { UserProvider } from './context/UserContext';

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323'
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start-2p'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Gymmo: The RPG Fitness Game</title>
        <meta name="description" content="Transform your fitness journey into a pixelated RPG adventure." />
      </head>
      <body className={`${vt323.variable} ${pressStart2P.variable} font-sans`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
