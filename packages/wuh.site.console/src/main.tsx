import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@/auth/AuthProvider';
import { AppRoutes } from '@/routes/AppRoutes';
import '@/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
);
