'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/hub', label: 'Hub' },
  { href: '/community', label: 'Community' },
  { href: '/profile', label: 'Profile' },
];

const BottomNavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface border-t-2 border-primary shadow-lg">
      <div className="flex justify-around max-w-xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex-1 text-center py-3 font-press-start text-sm transition-colors duration-200 ${isActive ? 'bg-primary text-white' : 'text-text hover:bg-primary/50'}`}>
                {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
