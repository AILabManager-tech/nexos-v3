import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mark Systems',
  description: 'The web lab where every experiment becomes a micro-product.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
