import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050d1a]">
      <Sidebar />
      <TopBar />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
