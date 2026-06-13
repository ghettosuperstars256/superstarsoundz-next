'use client';

// ============================================================
// SSZ Dashboard UI Component Library
// Consistent, polished components for all admin pages
// ============================================================

import { ReactNode, CSSProperties, ButtonHTMLAttributes, InputHTMLAttributes, DetailedHTMLProps } from 'react';

// ─── Theme Tokens (inline for component self-containment) ───
const T = {
  bg: '#08080a',
  card: '#121216',
  cardHover: '#18181e',
  tertiary: '#1a1a20',
  border: '#1e1e26',
  borderLight: '#2a2a36',
  accent: '#D4A843',
  accentHover: '#E8C05A',
  accentDim: 'rgba(212,168,67,0.08)',
  accentGlow: 'rgba(212,168,67,0.2)',
  text: '#f0f0f2',
  textSecondary: '#9090a0',
  textMuted: '#5a5a6a',
  textFaint: '#3a3a48',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#a855f7',
  radiusSm: '6px',
  radiusMd: '10px',
  radiusLg: '16px',
} as const;

// ============================================================
// CARD
// ============================================================
interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  padding?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', style, hover = false, padding = '1.25rem', onClick }: CardProps) {
  return (
    <div
      className={`dsz-card ${className}`}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg,
        padding,
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.background = T.cardHover;
        e.currentTarget.style.borderColor = T.borderLight;
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.background = T.card;
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = 'none';
      } : undefined}
    >
      {children}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, sub, color = T.accent, icon, change, changeType = 'neutral' }: StatCardProps) {
  const changeColor = changeType === 'up' ? T.success : changeType === 'down' ? T.danger : T.textMuted;
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: T.radiusLg,
      padding: '1.25rem',
      transition: 'all 0.2s ease',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = T.cardHover;
      e.currentTarget.style.borderColor = T.borderLight;
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = T.card;
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Subtle top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${color}, transparent)`,
        opacity: 0.5,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        {icon && (
          <div style={{
            width: '40px', height: '40px', borderRadius: T.radiusMd,
            background: `${color}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon} />
            </svg>
          </div>
        )}
        {change && (
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: changeColor }}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '•'} {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1.1, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8125rem', color: T.textSecondary }}>{label}</div>
      {sub && <div style={{ fontSize: '0.6875rem', color: T.textMuted, marginTop: '0.125rem' }}>{sub}</div>}
    </div>
  );
}

// ============================================================
// BUTTON
// ============================================================
interface DButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, disabled, style, ...props }: DButtonProps) {
  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.75rem', minHeight: '32px' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '40px' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '0.9375rem', minHeight: '48px' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
      color: '#000', border: 'none', fontWeight: 600,
    },
    secondary: {
      background: T.tertiary, color: T.text, border: `1px solid ${T.border}`,
    },
    ghost: {
      background: 'transparent', color: T.textSecondary, border: `1px solid ${T.border}`,
    },
    danger: {
      background: 'rgba(239,68,68,0.1)', color: T.danger, border: '1px solid rgba(239,68,68,0.2)',
    },
  };

  const s = sizes[size];
  const v = variants[variant];

  return (
    <button
      disabled={disabled || loading}
      style={{
        ...s,
        ...v,
        borderRadius: T.radiusMd,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: '0.5rem',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') (e.target as HTMLElement).style.filter = 'brightness(1.1)';
          else (e.target as HTMLElement).style.background = T.borderLight;
        }
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.filter = '';
        if (variant !== 'primary') (e.target as HTMLElement).style.background = v.background;
      }}
      {...props}
    >
      {loading ? (
        <span style={{
          width: '14px', height: '14px', border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'dsz-spin 0.6s linear infinite',
          display: 'inline-block',
        }} />
      ) : icon}
      {children}
    </button>
  );
}

// ============================================================
// BADGE / PILL
// ============================================================
interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'soft';
  size?: 'sm' | 'md';
}

export function Badge({ children, color = T.accent, variant = 'soft', size = 'sm' }: BadgeProps) {
  const bg = variant === 'solid' ? color : variant === 'outline' ? 'transparent' : `${color}15`;
  const border = variant === 'outline' ? `1px solid ${color}` : '1px solid transparent';
  const textColor = variant === 'solid' ? (color === T.warning ? '#000' : '#fff') : color;
  const pad = size === 'sm' ? '0.125rem 0.5rem' : '0.25rem 0.75rem';
  const fs = size === 'sm' ? '0.6875rem' : '0.75rem';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
      padding: pad, borderRadius: '999px',
      background: bg, border, color: textColor,
      fontSize: fs, fontWeight: 600, lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

// ============================================================
// INPUT
// ============================================================
interface DInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: DInputProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '0.8125rem', fontWeight: 600,
          color: T.textSecondary, marginBottom: '0.375rem',
        }}>{label}</label>
      )}
      <input
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          background: T.tertiary,
          border: `1px solid ${error ? T.danger : T.border}`,
          borderRadius: T.radiusMd,
          color: T.text,
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={(e) => !error && (e.target.style.borderColor = T.accent)}
        onBlur={(e) => !error && (e.target.style.borderColor = T.border)}
        {...props}
      />
      {error && <div style={{ fontSize: '0.75rem', color: T.danger, marginTop: '0.25rem' }}>{error}</div>}
    </div>
  );
}

// ============================================================
// TABLE
// ============================================================
interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'No data found' }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div style={{
        padding: '3rem', textAlign: 'center', color: T.textMuted,
        fontSize: '0.875rem',
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: T.radiusMd, border: `1px solid ${T.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr style={{ background: T.tertiary }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600,
                color: T.textSecondary, borderBottom: `1px solid ${T.border}`,
                whiteSpace: 'nowrap', width: col.width,
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              style={{
                borderBottom: `1px solid ${T.border}`,
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.cardHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '0.75rem 1rem', color: T.text }}>
                  {col.render ? col.render(item, i) : (item as any)[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem',
    }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: T.text, marginBottom: '0.25rem' }}>{title}</h2>
        {subtitle && <p style={{ color: T.textMuted, fontSize: '0.8125rem' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ============================================================
// MESSAGE BANNER
// ============================================================
interface MessageBannerProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onDismiss?: () => void;
}

export function MessageBanner({ type, message, onDismiss }: MessageBannerProps) {
  const colors = {
    success: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', text: T.success, icon: '✓' },
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: T.danger, icon: '✕' },
    info: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', text: T.info, icon: 'ℹ' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: T.warning, icon: '⚠' },
  };
  const c = colors[type];

  return (
    <div style={{
      padding: '0.75rem 1rem', borderRadius: T.radiusMd,
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, fontSize: '0.875rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '1.5rem', animation: 'dsz-fadeIn 0.2s ease-out',
    }}>
      <span><strong>{c.icon}</strong> {message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: 'none', border: 'none', color: c.text, cursor: 'pointer',
          fontSize: '0.75rem', opacity: 0.7, padding: '0.25rem',
        }}>✕</button>
      )}
    </div>
  );
}

// ============================================================
// TABS
// ============================================================
interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div style={{
      display: 'flex', gap: '0.25rem', marginBottom: '1.5rem',
      borderBottom: `1px solid ${T.border}`, paddingBottom: '0',
      overflowX: 'auto',
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '0.625rem 1rem', fontSize: '0.8125rem', fontWeight: 600,
              color: isActive ? T.accent : T.textMuted,
              background: isActive ? T.accentDim : 'transparent',
              border: 'none',
              borderBottom: isActive ? `2px solid ${T.accent}` : '2px solid transparent',
              borderRadius: `${T.radiusMd} ${T.radiusMd} 0 0`,
              cursor: 'pointer', transition: 'all 0.15s',
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center', padding: '3rem 1.5rem', color: T.textMuted,
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.text, marginBottom: '0.5rem' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{description}</p>}
      {action}
    </div>
  );
}

// ============================================================
// SKELETON LOADER
// ============================================================
interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = '100%', height = '16px', borderRadius = T.radiusSm, style }: SkeletonProps) {
  return (
    <div style={{
      width, height, borderRadius,
      background: `linear-gradient(90deg, ${T.tertiary} 25%, ${T.border} 50%, ${T.tertiary} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'dsz-shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: T.radiusLg, overflow: 'hidden',
    }}>
      <Skeleton height="160px" borderRadius="0" />
      <div style={{ padding: '1rem' }}>
        <Skeleton height="14px" width="40%" style={{ marginBottom: '0.5rem' }} />
        <Skeleton height="16px" width="80%" style={{ marginBottom: '0.75rem' }} />
        <Skeleton height="12px" width="60%" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ borderRadius: T.radiusMd, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
      <div style={{ background: T.tertiary, display: 'flex', gap: '1rem', padding: '0.75rem 1rem' }}>
        {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} height="14px" width={`${100 / cols}%`} />)}
      </div>
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1rem', borderTop: `1px solid ${T.border}` }}>
          {Array.from({ length: cols }).map((_, ci) => <Skeleton key={ci} height="12px" width={`${100 / cols}%`} />)}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, width = '500px' }: ModalProps) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      animation: 'dsz-fadeIn 0.15s ease-out',
    }} onClick={onClose}>
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg, padding: '1.5rem',
        width: '100%', maxWidth: width, maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        animation: 'dsz-slideUp 0.2s ease-out',
      }} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '1.25rem',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: T.text }}>{title}</h3>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: T.textMuted,
              cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem',
            }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS BAR / GAUGE
// ============================================================
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, color = T.accent, height = '8px', showLabel = false }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.75rem', color: T.textSecondary }}>
          <span>Progress</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div style={{
        width: '100%', height, background: T.tertiary,
        borderRadius: '999px', overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color})`,
          borderRadius: '999px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

// ============================================================
// SPARKLINE (mini chart)
// ============================================================
interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = T.accent, width = 60, height = 20 }: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

// ============================================================
// CIRCULAR PROGRESS / GAUGE
// ============================================================
interface CircularGaugeProps {
  value: number;
  label?: string;
  size?: number;
  color?: string;
}

export function CircularGauge({ value, label, size = 80, color }: CircularGaugeProps) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  const gaugeColor = color || (value >= 80 ? T.success : value >= 50 ? T.warning : T.danger);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.border} strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={gaugeColor} strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.35em" fill={T.text} fontSize="14" fontWeight="800">{value}</text>
      {label && <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill={T.textMuted} fontSize="7">{label}</text>}
    </svg>
  );
}

// ============================================================
// CSS KEYFRAMES (inject once)
// ============================================================
export function DashboardStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes dsz-spin { to { transform: rotate(360deg); } }
      @keyframes dsz-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      @keyframes dsz-fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes dsz-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes dsz-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

      /* Scrollbar styling */
      .dsz-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .dsz-scroll::-webkit-scrollbar-track { background: transparent; }
      .dsz-scroll::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 3px; }
      .dsz-scroll::-webkit-scrollbar-thumb:hover { background: #3a3a48; }

      /* Focus visible ring */
      .dsz-focus:focus-visible { outline: 2px solid #D4A843; outline-offset: 2px; }

      /* Text truncation */
      .dsz-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dsz-line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    ` }} />
  );
}
