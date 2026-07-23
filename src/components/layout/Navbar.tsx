'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const themes = [
    { value: 'light',  icon: Sun,     label: 'Light' },
    { value: 'dark',   icon: Moon,    label: 'Dark'  },
    { value: 'system', icon: Monitor, label: 'System'},
  ] as const;

  const current = themes.find((t) => t.value === theme) ?? themes[1];
  const CurrentIcon = current.icon;

  const cycle = () => {
    const idx = themes.findIndex((t) => t.value === theme);
    setTheme(themes[(idx + 1) % themes.length].value);
  };

  return (
    <button
      onClick={cycle}
      aria-label={`Switch theme (current: ${current.label})`}
      className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-200"
    >
      <CurrentIcon size={16} />
    </button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 inset-x-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
            : 'bg-background/60 backdrop-blur-md border-b border-white/5'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/8'
                    )}
                  >
                    <link.icon size={14} strokeWidth={2} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
      </div>

      {/* Mobile menu panel */}
      <div
        className={cn(
          'fixed top-16 inset-x-0 z-40 md:hidden transition-all duration-300 origin-top',
          mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
        )}
      >
        <div className="bg-background/95 backdrop-blur-xl border-b border-white/10 px-4 py-4 shadow-xl shadow-black/20">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/8'
                    )}
                  >
                    <link.icon size={16} strokeWidth={2} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
