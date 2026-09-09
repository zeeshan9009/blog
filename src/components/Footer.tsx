import React from 'react';

const footerLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Company', href: '#company' },
  { label: 'Developers', href: '#developers' },
  { label: 'Resources', href: '#resources' },
  { label: 'Legal', href: '#legal' }
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 py-6 sm:py-8 font-sans">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Copyright */}
        <div className="text-xs text-neutral-500 font-normal">
          © 2026 VeriPass. All rights reserved.
        </div>

        {/* Right: Footer Navigation Links */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-neutral-600">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-neutral-950 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};
