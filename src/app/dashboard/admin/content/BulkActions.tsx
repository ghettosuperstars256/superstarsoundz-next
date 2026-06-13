'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ToastProvider';

interface BulkActionsProps {
  type: 'post' | 'page' | 'product';
  items: { id: string; title: string }[];
}

export function BulkActions({ type, items }: BulkActionsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const toggleAll = useCallback(() => {
    setSelected(prev => prev.size === items.length ? new Set() : new Set(items.map(i => i.id)));
  }, [items]);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const bulkDelete = useCallback(async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} item(s)? This cannot be undone.`)) return;
    setDeleting(true);
    let deleted = 0;
    let failed = 0;
    for (const id of selected) {
      try {
        let res: Response;
        if (type === 'page') {
          res = await fetch('/api/content/pages', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
        } else {
          res = await fetch(`/api/content?type=${type}&id=${id}`, { method: 'DELETE' });
        }
        const data = await res.json();
        if (data.success) deleted++;
        else failed++;
      } catch { failed++; }
    }
    if (deleted > 0) addToast('success', `Deleted ${deleted} item(s)`);
    if (failed > 0) addToast('error', `Failed to delete ${failed} item(s)`);
    setDeleting(false);
    setSelected(new Set());
    if (deleted > 0) window.location.reload();
  }, [selected, type, addToast]);

  return { selected, toggleAll, toggle, bulkDelete, deleting };
}

export function SelectAllCheckbox({ selected, total, onToggle }: { selected: number; total: number; onToggle: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', color: '#9090a0' }}>
      <input
        type="checkbox"
        checked={selected === total && total > 0}
        ref={el => { if (el) el.indeterminate = selected > 0 && selected < total; }}
        onChange={onToggle}
        style={{ accentColor: '#D4A843', width: '14px', height: '14px' }}
      />
      {selected > 0 ? `${selected} selected` : 'All'}
    </label>
  );
}

export function BulkDeleteButton({ count, onDelete, loading }: { count: number; onDelete: () => void; loading: boolean }) {
  if (count === 0) return null;
  return (
    <button onClick={onDelete} disabled={loading} style={{
      fontSize: '0.75rem', padding: '0.375rem 0.75rem', color: '#ef4444',
      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: '6px', cursor: loading ? 'wait' : 'pointer', fontWeight: 600,
    }}>
      {loading ? 'Deleting...' : `🗑️ Delete (${count})`}
    </button>
  );
}
