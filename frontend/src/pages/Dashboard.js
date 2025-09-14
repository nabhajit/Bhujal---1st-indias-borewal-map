import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const [borewells, setBorewells] = useState([]);
  const [allBorewells, setAllBorewells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-borewells');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorewells();
    fetchAllBorewells();
  }, []);

  const fetchBorewells = async () => {
    try {
      const res = await api.get('/borewell/my-borewells');
      setBorewells(res.data.data.borewells);
    } catch (error) {
      console.error('Error fetching borewells:', error);
      toast.error('Failed to fetch your borewells');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBorewells = async () => {
    try {
      const res = await api.get('/borewell/all');
      setAllBorewells(res.data.data);
    } catch (error) {
      console.error('Error fetching all borewells:', error);
      toast.error('Failed to fetch borewell data');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const deleteBorewell = async (id) => {
    if (window.confirm('Are you sure you want to delete this borewell?')) {
      try {
        await api.delete(`/borewell/${id}`);
        setBorewells(borewells.filter(borewell => borewell._id !== id));
        toast.success('Borewell deleted successfully');
      } catch (error) {
        console.error('Error deleting borewell:', error);
        toast.error('Failed to delete borewell');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Link
                to="/borewell/register"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Register Borewell
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold">{user?.name}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold">{user?.phoneNumber}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">My Borewells</p>
              <p className="text-lg font-semibold">{borewells.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('my-borewells')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'my-borewells'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Borewells ({borewells.length})
              </button>
              <button
                onClick={() => setActiveTab('all-borewells')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'all-borewells'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Borewells ({allBorewells.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my-borewells' && (
              <div>
                {borewells.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't registered any borewells yet.</p>
                    <Link
                      to="/borewell/register"
                      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Register Your First Borewell
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {borewells.map((borewell) => (
                      <div key={borewell._id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {borewell.wellType.replace('-', ' ').toUpperCase()}
                          </h3>
                          <button
                            onClick={() => deleteBorewell(borewell._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Location:</strong> {borewell.latitude}, {borewell.longitude}</p>
                          <p><strong>Depth:</strong> {borewell.exactDepth || 'Not specified'} ft</p>
                          <p><strong>Motor:</strong> {borewell.motorOperated ? 'Yes' : 'No'}</p>
                          <p><strong>Authorities Aware:</strong> {borewell.authoritiesAware ? 'Yes' : 'No'}</p>
                          {borewell.description && (
                            <p><strong>Description:</strong> {borewell.description}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Registered: {new Date(borewell.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'all-borewells' && (
              <div>
                {allBorewells.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No borewells registered in the system yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allBorewells.map((borewell, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {borewell.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Email:</strong> {borewell.email}</p>
                          <p><strong>Phone:</strong> {borewell.phone}</p>
                          <p><strong>Address:</strong> {borewell.address}</p>
                          <p><strong>Location:</strong> {borewell.latitude}, {borewell.longitude}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
