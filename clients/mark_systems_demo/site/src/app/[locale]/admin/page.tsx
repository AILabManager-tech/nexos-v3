import type { Metadata } from 'next';
import { Shield, Database, Bot, Webhook, DollarSign, Activity } from 'lucide-react';
import AdminStatsPanel from '@/components/admin/AdminStatsPanel';

export const metadata: Metadata = {
  title: 'Admin | Mark Systems',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
          Admin
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-3 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[var(--color-primary)]" aria-hidden />
          Dashboard administrateur
        </h1>
        <p className="text-base text-[var(--color-text-muted)] max-w-3xl leading-relaxed">
          Metrics consolides : runs, couts, agents, webhooks, backend status.
        </p>
      </header>

      <AdminStatsPanel />
    </div>
  );
}
