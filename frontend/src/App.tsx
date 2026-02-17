// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoomListPage from './pages/room/RoomListPage';
import RoomDetailPage from './pages/room/RoomDetailPage';
import BookingPage from './pages/booking/BookingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

// ✅ Wrapper pour les routes protégées
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// ✅ Wrapper pour les routes admin uniquement
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomListPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/booking/:roomId" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Routes protégées */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Routes admin */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/rooms"
                element={
                  <AdminRoute>
                    <AdminRooms />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />

              {/* Redirection par défaut si route inconnue */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
