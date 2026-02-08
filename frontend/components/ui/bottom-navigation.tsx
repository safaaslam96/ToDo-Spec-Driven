"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavigationProps {
  items: NavItem[];
}

export function BottomNavigation({ items }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav md:hidden">
      <div className="max-w-screen-xl mx-auto h-full px-4">
        <div className="flex items-center justify-around h-full">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center touch-target transition-colors duration-200 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="w-6 h-6 mb-1">{item.icon}</div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
