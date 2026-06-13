'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ToastProvider';

interface ClientDeleteButtonProps {
  type: 'post' | 'page' | 'product';
  id: string;
  label: string;
}

export function ClientDeleteButton({ type, id, label }: ClientDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { addToast } = useToast();

  const handleClick = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
  }, [confirming]);

  const handleConfirm = useCallback(async () => {
    setDeleting(true);
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
      if (data.success) {
        addToast('success', `${type.charAt(0).toUpperCase() + type.slice(1)} "${label}" deleted`);
        window.location.reload();
      } else {
        addToast('error', `Failed to delete: ${data.error || 'Unknown error'}`);
        setDeleting(false);
        setConfirming(false);
      }
    } catch {
      addToast('error', 'Network error. Please try again.');
      setDeleting(false);
      setConfirming(false);
    }
  }, [type, id, label, addToast]);

  const cancel = useCallback(() => {
    setConfirming(false);
  }, []);

  if (confirming) {
    return (
      <div style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.625rem', color: '#ef4444', fontWeight: 600 }}>Sure?</span>
        <button
          onClick={handleConfirm}
          disabled={deleting}
          style={{
            fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#ef4444',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '4px', cursor: deleting ? 'wait' : 'pointer',
            fontWeight: 600, opacity: deleting ? 0.5 : 1,
          }}
        >
          {deleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={cancel}
          disabled={deleting}
          style={{
            fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#9090a0',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '4px', cursor: 'pointer', fontWeight: 600,
          }}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="btn-ghost"
      style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#ef4444', cursor: 'pointer' }}
    >
      Delete
    </button>
  );
}
