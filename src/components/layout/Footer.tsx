import Link from 'next/link';
import { Scale, Code2, Share2, ExternalLink } from 'lucide-react';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-background/50 backdrop-blur-sm">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Scale size={16} className="text-white" strokeWidth={1.8} />
              </div>
              <span className="font-bold text-foreground">{APP_NAME}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              A comprehensive legal research platform for CA students and tax professionals.
              Built for India&apos;s Income Tax ecosystem.
            </p>
            <p className="text-xs text-muted-foreground/60">
              For educational purposes only. Not legal advice.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    <link.icon size={13} strokeWidth={2} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              Official Resources
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Income Tax India', href: 'https://www.incometax.gov.in' },
                { label: 'CBDT Circulars',   href: 'https://www.incometax.gov.in/iec/foportal/help/rules--regulations' },
                { label: 'IndianKanoon',     href: 'https://indiankanoon.org' },
                { label: 'ICAI',             href: 'https://www.icai.org' },
              ].map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    <ExternalLink size={12} strokeWidth={2} />
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            © {year} {APP_NAME}. Built for CA students.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Code2 size={15} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Share2 size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
