import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <div className="flex space-x-4">
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-blue-700' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  to="/topics" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/topics') 
                      ? 'bg-blue-700' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Topics
                </Link>
                <Link 
                  to="/progress" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/progress') 
                      ? 'bg-blue-700' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Progress
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.name}!</span>
              <button 
                onClick={logout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;