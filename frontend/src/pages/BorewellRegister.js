import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BorewellRegister = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    wellType: '',
    depthType: '',
    wallType: '',
    supplySystem: '',
    exactDepth: '',
    motorOperated: false,
    authoritiesAware: false,
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    latitude,
    longitude,
    wellType,
    depthType,
    wallType,
    supplySystem,
    exactDepth,
    motorOperated,
    authoritiesAware,
    description
  } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          setGettingLocation(false);
          toast.success('Location obtained successfully!');
        },
        (error) => {
          setGettingLocation(false);
          console.error('Error getting location:', error);
          toast.error('Failed to get current location. Please enter manually.');
        }
      );
    } else {
      setGettingLocation(false);
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!latitude || !longitude || !wellType) {
      toast.error('Please provide latitude, longitude, and well type');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/borewell/register', formData);
      
      if (res.data.success) {
        toast.success('Borewell registered successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register borewell');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

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
                to="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Dashboard
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Register New Borewell</h1>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Location Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={latitude}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 28.6139"
                  />
                </div>
                
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={longitude}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 77.2090"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Getting Location...
                    </>
                  ) : (
                    '📍 Get Current Location'
                  )}
                </button>
              </div>
            </div>

            {/* Well Details Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Well Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wellType" className="block text-sm font-medium text-gray-700">
                    Well Type *
                  </label>
                  <select
                    id="wellType"
                    name="wellType"
                    value={wellType}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Well Type</option>
                    <option value="dug-well">Dug Well</option>
                    <option value="drilled-well">Drilled Well</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="exactDepth" className="block text-sm font-medium text-gray-700">
                    Exact Depth (feet)
                  </label>
                  <input
                    type="number"
                    id="exactDepth"
                    name="exactDepth"
                    value={exactDepth}
                    onChange={onChange}
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>

              {wellType === 'dug-well' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="depthType" className="block text-sm font-medium text-gray-700">
                      Depth Type
                    </label>
                    <input
                      type="text"
                      id="depthType"
                      name="depthType"
                      value={depthType}
                      onChange={onChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Shallow, Deep"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="wallType" className="block text-sm font-medium text-gray-700">
                      Wall Type
                    </label>
                    <input
                      type="text"
                      id="wallType"
                      name="wallType"
                      value={wallType}
                      onChange={onChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Concrete, Stone"
                    />
                  </div>
                </div>
              )}

              {wellType === 'drilled-well' && (
                <div className="mt-4">
                  <label htmlFor="supplySystem" className="block text-sm font-medium text-gray-700">
                    Supply System
                  </label>
                  <input
                    type="text"
                    id="supplySystem"
                    name="supplySystem"
                    value={supplySystem}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Electric pump, Hand pump"
                  />
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="motorOperated"
                    name="motorOperated"
                    type="checkbox"
                    checked={motorOperated}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="motorOperated" className="ml-2 block text-sm text-gray-900">
                    Motor Operated
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="authoritiesAware"
                    name="authoritiesAware"
                    type="checkbox"
                    checked={authoritiesAware}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="authoritiesAware" className="ml-2 block text-sm text-gray-900">
                    Authorities Aware
                  </label>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional details about the borewell..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to="/dashboard"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                    Registering...
                  </>
                ) : (
                  'Register Borewell'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BorewellRegister;
