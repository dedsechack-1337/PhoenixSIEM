import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <Sidebar />
      <TopBar />
      <main style={{ marginLeft: 256, paddingTop: 60, minHeight: '100vh' }}>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
