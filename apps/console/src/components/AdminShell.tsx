import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { isRoot } from '@/auth/permissions';

const navItems = [
  { to: '/', label: '概览' },
  { to: '/content/posts', label: '博客管理' },
  { to: '/guestbook', label: '留言板' },
  { to: '/comments', label: '博客评论' },
  { to: '/users', label: '用户' },
];

export function AdminShell() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">wuh.site Console</div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div>
            <strong>{user?.login}</strong>
            <span className={`role ${isRoot(user) ? 'root' : 'reader'}`}>{isRoot(user) ? 'Root' : 'Read'}</span>
          </div>
          <button onClick={() => void logout()}>退出</button>
        </header>
        {!isRoot(user) && <div className="readonly-banner">当前账号仅拥有 Read 权限，所有写操作已禁用。</div>}
        <Outlet />
      </main>
    </div>
  );
}
