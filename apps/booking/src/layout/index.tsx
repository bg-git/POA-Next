import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export default function BookingLayout({ children }: LayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}
