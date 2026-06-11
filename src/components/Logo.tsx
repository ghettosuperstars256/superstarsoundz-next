import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  height?: number;
  className?: string;
}

export default function Logo({ variant = 'dark', height = 32, className }: LogoProps) {
  const color = variant === 'light' ? '#f0f0f2' : '#D4A843';
  const bgColor = variant === 'light' ? '#D4A843' : '#0e0e14';

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
      <svg width={height} height={height} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="10" fill={bgColor} stroke={color} strokeWidth="2" />
        <path d="M13 28V16l7 12 7-12v12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontWeight: 800, fontSize: `${height * 0.55}px`, letterSpacing: '-0.03em', color }}>
        Superstar Soundz
      </span>
    </div>
  );
}
