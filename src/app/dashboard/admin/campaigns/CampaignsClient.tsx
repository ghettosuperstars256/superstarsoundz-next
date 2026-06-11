'use client';

import { useState, useCallback } from 'react';
import { Campaign, CampaignSettings } from '@/lib/types';

interface CampaignsClientProps {
  campaigns: Campaign[];
  handleCreate: (formData: FormData) => Promise<void>;
  handleUpdate: (formData: FormData) => Promise<void>;
  handleDelete: (formData: FormData) => Promise<void>;
  handleRun: (formData: FormData) => Promise<void>;
  handleToggleActive: (formData: FormData) => Promise<void>;
}

const CAMPAIGN_TYPES: { value: Campaign['type']; label: string; color: string }[] = [
  { value: 'amazon', label: 'Amazon', color: '#FF9900' },
  { value: 'ebay', label: 'eBay', color: '#E53238' },
  { value: 'aliexpress', label: 'AliExpress', color: '#FF4747' },
  { value: 'rss', label: 'RSS Feed', color: '#F59E0B' },
  { value: 'youtube', label: 'YouTube', color: '#FF0000' },
  { value: 'custom', label: 'Custom', color: '#A855F7' },
];

const SCHEDULE_OPTIONS: { value: Campaign['schedule']; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'manual', label: 'Manual' },
];

function getTypeColor(type: Campaign['type']): string {
  return CAMPAIGN_TYPES.find(t => t.value === type)?.color || '#A855F7';
}

function getTypeLabel(type: Campaign['type']): string {
  return CAMPAIGN_TYPES.find(t => t.value === type)?.label || type;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

// SVG path snippets
const ICONS = {
  play: 'M5 3l14 9-14 9V3z',
  pause: 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
  plus: 'M12 4v16m8-8H4',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  settings: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  chevronDown: 'M6 9l6 6 6-6',
  x: 'M6 6l12 12M6 18L18 6',
  box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  trending: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
};

function Icon({ path, size = 16, color = 'currentColor' }: { path: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

function CampaignForm({ campaign, onSubmit, onCancel }: CampaignFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const isEditing = !!campaign;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {isEditing ? 'Update your campaign settings' : 'Configure a new scraping campaign'}
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <Icon path={ICONS.x} size={16} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 0,
          padding: '0 1.75rem',
          borderBottom: '1px solid var(--border)',
        }}>
          {(['basic', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.875rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'basic' ? '📋 Basic Info' : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          action={async (formData: FormData) => {
            await onSubmit(formData);
            onCancel();
          }}
          style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}
        >
          {campaign && <input type="hidden" name="id" value={campaign.id} />}

          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Name & Type Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Campaign Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={campaign?.name || ''}
                    placeholder="e.g., Best Selling Headphones"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                      transition: 'border-color 0.15s',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Source Type *
                  </label>
                  <select
                    name="type"
                    defaultValue={campaign?.type || 'amazon'}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                    }}
                  >
                    {CAMPAIGN_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Keywords (comma-separated) *
                </label>
                <textarea
                  name="keywords"
                  required
                  rows={2}
                  defaultValue={campaign?.keywords.join(', ') || ''}
                  placeholder="e.g., bluetooth headphones, noise cancelling, wireless earbuds"
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Category & Affiliate Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Category
                  </label>
                  <input
                    name="category"
                    type="text"
                    defaultValue={campaign?.category || ''}
                    placeholder="e.g., Electronics"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Affiliate Code
                  </label>
                  <input
                    name="affiliateCode"
                    type="text"
                    defaultValue={campaign?.affiliateCode || ''}
                    placeholder="e.g., your-tag-20"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Max Results & Schedule Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Max Results per Keyword
                  </label>
                  <input
                    name="maxResults"
                    type="number"
                    min={1}
                    max={500}
                    defaultValue={campaign?.maxResults || 20}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Schedule
                  </label>
                  <select
                    name="schedule"
                    defaultValue={campaign?.schedule || 'daily'}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                    }}
                  >
                    {SCHEDULE_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Price Range */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Price Range
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Min Price ($)</label>
                    <input
                      name="minPrice"
                      type="number"
                      min={0}
                      step={0.01}
                      defaultValue={campaign?.settings?.minPrice ?? 0}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Max Price ($)</label>
                    <input
                      name="maxPrice"
                      type="number"
                      min={0}
                      step={0.01}
                      defaultValue={campaign?.settings?.maxPrice ?? 10000}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Minimum Rating
                </label>
                <input
                  name="minRating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  defaultValue={campaign?.settings?.minRating ?? 0}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none',
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  Minimum star rating (0-5). Set to 0 to disable.
                </p>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  Automation
                </label>

                {[
                  { name: 'autoPublish', label: 'Auto-Publish', desc: 'Automatically publish approved products', default: campaign?.settings?.autoPublish ?? false },
                  { name: 'autoAffiliate', label: 'Auto-Affiliate', desc: 'Inject affiliate links on scrape', default: campaign?.settings?.autoAffiliate ?? true },
                  { name: 'deduplicate', label: 'Deduplicate', desc: 'Skip previously scraped products', default: campaign?.settings?.deduplicate ?? true },
                  { name: 'imageRequired', label: 'Image Required', desc: 'Skip products without images', default: campaign?.settings?.imageRequired ?? true },
                ].map(toggle => (
                  <label
                    key={toggle.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toggle.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{toggle.desc}</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="checkbox"
                        name={toggle.name}
                        defaultChecked={toggle.default}
                        style={{
                          width: '44px',
                          height: '24px',
                          appearance: 'none',
                          borderRadius: '12px',
                          background: toggle.default ? 'var(--accent)' : 'var(--border-light)',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.2s',
                        }}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
          }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn-ghost"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '0.875rem' }}
            >
              {isEditing ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Campaign Card Component
function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onRun,
  onToggleActive,
}: {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (formData: FormData) => void;
  onRun: (formData: FormData) => void;
  onToggleActive: (formData: FormData) => void;
}) {
  const typeColor = getTypeColor(campaign.type);
  const typeLabel = getTypeLabel(campaign.type);

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        transition: 'all var(--transition-base)',
        position: 'relative',
      }}
    >
      {/* Top gradient accent */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, ${typeColor}, transparent)`,
      }} />

      {/* Header */}
      <div style={{ padding: '1.25rem 1.25rem 0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '0.25rem',
            }}>
              {campaign.name}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge" style={{
                fontSize: '0.625rem',
                background: `${typeColor}15`,
                color: typeColor,
                borderColor: `${typeColor}30`,
              }}>
                {typeLabel}
              </span>
              <span className={`badge ${campaign.isActive ? 'badge-success' : ''}`} style={{ fontSize: '0.625rem' }}>
                {campaign.isActive ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'var(--success)',
                      display: 'inline-block',
                      animation: 'pulse-dot 2s infinite',
                    }} />
                    Active
                  </span>
                ) : 'Paused'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: 'var(--border)',
        margin: '0 1.25rem',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        {[
          { label: 'Scraped', value: campaign.totalScraped, color: 'var(--accent)' },
          { label: 'Published', value: campaign.totalPublished, color: 'var(--success)' },
          { label: 'Keywords', value: campaign.keywords.length, color: 'var(--info)' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '0.625rem',
            background: 'var(--bg-tertiary)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div style={{ padding: '0.875rem 1.25rem' }}>
        {/* Keywords */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Keywords</div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {campaign.keywords.slice(0, 4).map((kw, i) => (
              <span key={i} style={{
                fontSize: '0.6875rem',
                padding: '0.125rem 0.5rem',
                borderRadius: '100px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}>
                {kw}
              </span>
            ))}
            {campaign.keywords.length > 4 && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', padding: '0.125rem 0' }}>
                +{campaign.keywords.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Schedule & Last Run */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Schedule</div>
            <div style={{ fontSize: '0.812rem', fontWeight: 600, textTransform: 'capitalize' }}>{campaign.schedule}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Last Run</div>
            <div style={{ fontSize: '0.812rem', fontWeight: 600 }} title={campaign.lastRun || ''}>
              {timeAgo(campaign.lastRun)}
            </div>
          </div>
        </div>

        {/* Category & Max Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Category</div>
            <div style={{ fontSize: '0.812rem', fontWeight: 600 }}>{campaign.category || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Max Results</div>
            <div style={{ fontSize: '0.812rem', fontWeight: 600 }}>{campaign.maxResults}</div>
          </div>
        </div>

        {/* Settings indicators */}
        <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {campaign.settings?.autoPublish && (
            <span className="badge badge-success" style={{ fontSize: '0.5625rem' }}>Auto-Publish</span>
          )}
          {campaign.settings?.autoAffiliate && (
            <span className="badge badge-info" style={{ fontSize: '0.5625rem' }}>Auto-Affiliate</span>
          )}
          {campaign.settings?.deduplicate && (
            <span className="badge badge-purple" style={{ fontSize: '0.5625rem' }}>Dedup</span>
          )}
          {campaign.settings?.imageRequired && (
            <span className="badge" style={{ fontSize: '0.5625rem' }}>Img Required</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderTop: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
      }}>
        {/* Run Now */}
        <form action={onRun}>
          <input type="hidden" name="id" value={campaign.id} />
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '0.75rem',
              gap: '0.25rem',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Run Now"
          >
            <Icon path={ICONS.play} size={13} color="#000" />
            Run
          </button>
        </form>

        {/* Pause/Resume */}
        <form action={onToggleActive}>
          <input type="hidden" name="id" value={campaign.id} />
          <button
            type="submit"
            className="btn-ghost"
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '0.75rem',
              gap: '0.25rem',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
            }}
            title={campaign.isActive ? 'Pause' : 'Resume'}
          >
            <Icon path={campaign.isActive ? ICONS.pause : ICONS.play} size={13} color="var(--text-secondary)" />
            {campaign.isActive ? 'Pause' : 'Start'}
          </button>
        </form>

        {/* Edit */}
        <button
          type="button"
          className="btn-ghost"
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '0.75rem',
            gap: '0.25rem',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
          }}
          title="Edit"
          onClick={() => onEdit(campaign)}
        >
          <Icon path={ICONS.edit} size={13} color="var(--text-secondary)" />
          Edit
        </button>

        {/* Delete */}
        <form action={onDelete}>
          <input type="hidden" name="id" value={campaign.id} />
          <button
            type="submit"
            className="btn-ghost"
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '0.75rem',
              gap: '0.25rem',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
            }}
            title="Delete"
            onClick={(e) => {
              if (!confirm(`Delete "${campaign.name}"? This cannot be undone.`)) {
                e.preventDefault();
              }
            }}
          >
            <Icon path={ICONS.trash} size={13} color="var(--danger)" />
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CampaignsClient({
  campaigns,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleRun,
  handleToggleActive,
}: CampaignsClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formKey, setFormKey] = useState(0);

  const activeCampaigns = campaigns.filter(c => c.isActive);
  const pausedCampaigns = campaigns.filter(c => !c.isActive);
  const totalScraped = campaigns.reduce((sum, c) => sum + c.totalScraped, 0);
  const totalPublished = campaigns.reduce((sum, c) => sum + c.totalPublished, 0);

  const filteredCampaigns = campaigns.filter(c => {
    if (filterType && c.type !== filterType) return false;
    if (filterStatus === 'active' && !c.isActive) return false;
    if (filterStatus === 'paused' && c.isActive) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const handleEdit = useCallback((campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormKey(prev => prev + 1);
    setShowModal(true);
  }, []);

  const handleNewCampaign = useCallback(() => {
    setEditingCampaign(undefined);
    setFormKey(prev => prev + 1);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingCampaign(undefined);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
            Campaigns
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your scraping campaigns and automation.</p>
        </div>
        <button
          onClick={handleNewCampaign}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', gap: '0.5rem' }}
        >
          <Icon path={ICONS.plus} size={18} color="#000" />
          Create Campaign
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Campaigns', value: campaigns.length, color: '#D4A843', icon: ICONS.box },
          { label: 'Active', value: activeCampaigns.length, color: '#22c55e', icon: ICONS.play },
          { label: 'Total Scraped', value: totalScraped, color: '#3b82f6', icon: ICONS.trending },
          { label: 'Total Published', value: totalPublished, color: '#a855f7', icon: ICONS.eye },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '1.25rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '70px',
              height: '70px',
              background: `radial-gradient(circle at top right, ${stat.color}12, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: `${stat.color}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              <Icon path={stat.icon} size={18} color={stat.color} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Icon path={ICONS.search} size={16} color="var(--text-muted)" />
          </div>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem 0.625rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        >
          <option value="">All Types</option>
          {CAMPAIGN_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          marginLeft: 'auto',
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.5rem 0.75rem',
              background: viewMode === 'grid' ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s',
            }}
            title="Grid View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={viewMode === 'grid' ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.5rem 0.75rem',
              background: viewMode === 'list' ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s',
            }}
            title="List View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={viewMode === 'list' ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Campaigns Grid/List */}
      {filteredCampaigns.length === 0 ? (
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Icon path={ICONS.box} size={28} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {campaigns.length === 0 ? 'No campaigns yet' : 'No matching campaigns'}
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {campaigns.length === 0
              ? 'Create your first campaign to start scraping products automatically.'
              : 'Try adjusting your filters or search query.'}
          </p>
          {campaigns.length === 0 && (
            <button
              onClick={handleNewCampaign}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
            >
              <Icon path={ICONS.plus} size={16} color="#000" />
              Create Your First Campaign
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredCampaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRun={handleRun}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        /* List View - Table */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Campaign', 'Type', 'Status', 'Scraped', 'Published', 'Schedule', 'Last Run', 'Actions'].map(header => (
                    <th key={header} style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-tertiary)',
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, idx) => {
                  const typeColor = getTypeColor(campaign.type);
                  return (
                    <tr
                      key={campaign.id}
                      style={{
                        borderBottom: idx < filteredCampaigns.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Name */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{campaign.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                          {campaign.keywords.slice(0, 3).join(', ')}{campaign.keywords.length > 3 ? '...' : ''}
                        </div>
                      </td>
                      {/* Type */}
                      <td style={{ padding: '1rem' }}>
                        <span className="badge" style={{
                          fontSize: '0.6875rem',
                          background: `${typeColor}12`,
                          color: typeColor,
                          borderColor: `${typeColor}25`,
                        }}>
                          {getTypeLabel(campaign.type)}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${campaign.isActive ? 'badge-success' : ''}`} style={{ fontSize: '0.6875rem' }}>
                          {campaign.isActive ? 'Active' : 'Paused'}
                        </span>
                      </td>
                      {/* Scraped */}
                      <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--accent)' }}>
                        {campaign.totalScraped}
                      </td>
                      {/* Published */}
                      <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>
                        {campaign.totalPublished}
                      </td>
                      {/* Schedule */}
                      <td style={{ padding: '1rem', fontSize: '0.8125rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                        {campaign.schedule}
                      </td>
                      {/* Last Run */}
                      <td style={{ padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {timeAgo(campaign.lastRun)}
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <form action={handleRun}>
                            <input type="hidden" name="id" value={campaign.id} />
                            <button type="submit" className="btn-ghost" style={{ padding: '0.375rem 0.5rem', fontSize: '0.687rem' }} title="Run Now">
                              <Icon path={ICONS.play} size={14} color="var(--success)" />
                            </button>
                          </form>
                          <form action={handleToggleActive}>
                            <input type="hidden" name="id" value={campaign.id} />
                            <button type="submit" className="btn-ghost" style={{ padding: '0.375rem 0.5rem', fontSize: '0.687rem' }} title={campaign.isActive ? 'Pause' : 'Resume'}>
                              <Icon path={campaign.isActive ? ICONS.pause : ICONS.play} size={14} color="var(--text-secondary)" />
                            </button>
                          </form>
                          <button
                            type="button"
                            className="btn-ghost"
                            style={{ padding: '0.375rem 0.5rem', fontSize: '0.687rem' }}
                            title="Edit"
                            onClick={() => handleEdit(campaign)}
                          >
                            <Icon path={ICONS.edit} size={14} color="var(--text-secondary)" />
                          </button>
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={campaign.id} />
                            <button
                              type="submit"
                              className="btn-ghost"
                              style={{ padding: '0.375rem 0.5rem', fontSize: '0.687rem', color: 'var(--danger)' }}
                              title="Delete"
                              onClick={(e) => {
                                if (!confirm(`Delete "${campaign.name}"?`)) e.preventDefault();
                              }}
                            >
                              <Icon path={ICONS.trash} size={14} color="var(--danger)" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results count */}
      {filteredCampaigns.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {filteredCampaigns.length} of {campaigns.length} campaigns
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CampaignForm
          key={formKey}
          campaign={editingCampaign}
          onSubmit={editingCampaign ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}
