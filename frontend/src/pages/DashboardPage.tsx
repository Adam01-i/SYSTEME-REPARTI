import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, Home, User } from 'lucide-react';
import BookingsList from '../components/BookingsList';

function DashboardOverview() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">3</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stays</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">12</p>
            </div>
            <Home className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Status</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">Active</p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm">
            <nav className="p-4 space-y-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Overview</span>
              </Link>
              <Link
                to="/dashboard/bookings"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/bookings')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive('/profile')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-lg shadow-sm">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="bookings" element={<BookingsList />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}