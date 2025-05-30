import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  return (
    <div className="bg-background theme-transition-slow flex min-h-screen flex-col">
      <main className="theme-transition-slow flex-1">{children}</main>
    </div>
  );
};

export default SimpleLayout;
