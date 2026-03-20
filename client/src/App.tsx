import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { MainDashboard } from '@/pages/MainDashboard';
import { CallsLibraryPage } from '@/pages/CallsLibraryPage';
import { UploadPage } from '@/pages/UploadPage';
import { CallDetail } from '@/pages/CallDetail';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<MainDashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/calls" element={<CallsLibraryPage />} />
              <Route path="/calls/:id" element={<CallDetail />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
