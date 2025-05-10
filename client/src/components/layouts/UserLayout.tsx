import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User, LogOut, Edit2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserLayout: React.FC = () => {
  const { userData, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/user/login');
    toast.success('Logged out successfully');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('New password is required');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({ password, newPassword });
      toast.success('Password updated successfully');
      setEditMode(false);
      setPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header / Navigation Bar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">CommAid</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <User size={20} className="mr-1" />
              <span className="hidden md:inline">{userData?.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-600"
            >
              <LogOut size={20} />
              <span className="hidden md:inline ml-1">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Name
                </label>
                <p className="text-gray-900 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                  {userData?.name}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <p className="text-gray-900 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                  {userData?.email}
                </p>
              </div>
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Edit2 size={16} className="mr-2" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-medium mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="newPassword"
                    className="block text-gray-700 text-sm font-medium mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLayout;