import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Plus, NotebookPen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notes.seo' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
  };
}

export default function NotesPage() {
  const t = useTranslations('notes');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-3">
            {t('seo.h1')}
          </h1>
          <p className="text-base text-[var(--color-text-muted)] max-w-2xl">
            {t('seo.description')}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" aria-hidden />
          {t('index.newNote')}
        </Button>
      </header>

      <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mx-auto mb-6">
          <NotebookPen className="w-8 h-8 text-[var(--color-text-muted)]" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">
          {t('index.empty')}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
          {t('editor.placeholder')}
        </p>
        <Button>
          <Plus className="w-4 h-4" aria-hidden />
          {t('index.createFirst')}
        </Button>
      </div>
    </div>
  );
}
