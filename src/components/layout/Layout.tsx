import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <Sidebar />
      <TopBar />
      <main style={{ marginLeft: '256px', paddingTop: '60px', minHeight: '100vh' }}>
        <div style={{ padding: '24px' }}>
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
