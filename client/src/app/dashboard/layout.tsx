// src/app/dashboard/layout.tsx
import { NavigationProvider } from '@/contexts/NavigationContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </NavigationProvider>
  );
}
