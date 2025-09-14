import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                BHUJAL
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                  <Link
                    to="/dashboard"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">BHUJAL</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your comprehensive borewell management system. Register, track, and manage 
            borewells with ease. Connect with water sources and manage your water resources effectively.
          </p>
          
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-200"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-3xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">Location Tracking</h3>
            <p className="text-gray-600">
              Track and map all your borewells with precise GPS coordinates and location data.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-3xl mb-4">💧</div>
            <h3 className="text-xl font-semibold mb-2">Water Management</h3>
            <p className="text-gray-600">
              Monitor water levels, pump operations, and maintain detailed records of your water sources.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Community Network</h3>
            <p className="text-gray-600">
              Connect with other borewell owners in your area and share valuable insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
