import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />

            <Routes>
              {/* Pages publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomListPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Pages utilisateur protégées */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/booking/:roomId" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />

              {/* Pages admin protégées avec rôle */}
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/rooms" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminRooms />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/bookings" 
                element={
                  <ProtectedRoute>
                    <AdminBookings />
                  </ProtectedRoute>
                } 
              />
            </Routes>

            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
