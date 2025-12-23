'use client';

import Link from 'next/link';
// A placeholder for pixel art icons
const NavIcon = ({ label }: { label: string }) => (
  <div className="w-10 h-10 bg-background border-2 border-gray-700 rounded-md flex items-center justify-center">
    <p className="font-vt323 text-xs">{label.substring(0, 3)}</p>
  </div>
);

const Footer = () => {
  const navItems = [
    { href: '/hub', label: 'Hub' },
    { href: '/community', label: 'Community' },
    { href: '/profile', label: 'Profile' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <footer className="w-full bg-surface p-2 flex justify-around items-center border-t-4 border-background">
      {navItems.map((item) => (
        <Link href={item.href} key={item.label}>
          <div className="flex flex-col items-center space-y-1 text-text hover:text-primary transition-colors duration-200">
            <NavIcon label={item.label} />
            <span className="font-press-start text-[10px]">{item.label}</span>
          </div>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
