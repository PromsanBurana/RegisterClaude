import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import RequireAuth from './components/admin/RequireAuth';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import CustomCursor from './components/ui/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollProgress />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <Admin />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
