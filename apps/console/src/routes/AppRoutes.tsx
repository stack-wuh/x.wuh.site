import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RequireAuth } from '@/auth/RequireAuth';
import { AdminShell } from '@/components/AdminShell';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { PostsPage } from '@/pages/content/PostsPage';
import { GuestbookPage } from '@/pages/guestbook/GuestbookPage';
import { CommentsPage } from '@/pages/comments/CommentsPage';
import { UsersPage } from '@/pages/users/UsersPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/content/posts', element: <PostsPage /> },
          { path: '/guestbook', element: <GuestbookPage /> },
          { path: '/comments', element: <CommentsPage /> },
          { path: '/users', element: <UsersPage /> },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
