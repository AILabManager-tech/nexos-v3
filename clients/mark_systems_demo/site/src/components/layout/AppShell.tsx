import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { CommandPaletteProvider } from './CommandPalette';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <CommandPaletteProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 pb-16 md:pb-0">{children}</div>
          <Footer />
        </div>
        <MobileNav />
      </div>
    </CommandPaletteProvider>
  );
}
