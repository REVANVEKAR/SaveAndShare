import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Bell, LogOut, Check, Edit2, X, Menu, ChevronDown, 
  Home, Package, Archive, Calendar, Settings, AlertCircle,
  Building2, Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

const NGOLayout: React.FC = () => {
  const { userData, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [governmentId, setGovernmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/ngo/login');
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

  const handleVerifyNGO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!governmentId) {
      toast.error('Government ID is required');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/ngo/verify`,
        { governmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Verification request submitted');
      setShowVerifyModal(false);
      setGovernmentId('');
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { path: '/ngo/claim', label: 'Claim Resources', icon: Package },
    { path: '/ngo/claimed', label: 'Claimed Resources', icon: Archive },
    { path: '/ngo/post', label: 'Post Drives', icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">CommAid</span>
            </div>
            <ThemeToggle />
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-300'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex flex-col px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowVerifyModal(true)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm mb-4 transition-all duration-200 ${
                userData?.isVerified
                  ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/70'
                  : 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/70'
              }`}
            >
              <Check size={18} className="mr-2" />
              {userData?.isVerified ? 'Verified NGO' : 'Verify NGO'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 font-medium truncate">
                    {userData?.name}
                  </span>
                </div>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1"
                  >
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">CommAid</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`
                        }
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </nav>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowVerifyModal(true);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm mb-2 ${
                      userData?.isVerified
                        ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                        : 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    <Check size={18} className="mr-2" />
                    {userData?.isVerified ? 'Verified NGO' : 'Verify NGO'}
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                  >
                    <Settings size={16} className="mr-2" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="dark:text-gray-100"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md m-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setEditMode(false);
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization Name
                  </label>
                  <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 font-medium">
                    {userData?.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 font-medium">
                    {userData?.email}
                  </div>
                </div>
              </div>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Edit2 size={16} className="mr-2" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors duration-200"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="h-5 w-5" />
                          </motion.div>
                        </div>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify NGO Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md m-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">NGO Verification</h2>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {userData?.isVerified ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Your NGO is Verified
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You have full access to all platform features
                  </p>
                </div>
              ) : userData?.verificationStatus === 'pending' ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                    <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Verification in Progress
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We're reviewing your submitted information
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerifyNGO} className="space-y-6">
                  <div>
                    <label
                      htmlFor="governmentId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Government Registration ID
                    </label>
                    <input
                      id="governmentId"
                      type="text"
                      value={governmentId}
                      onChange={(e) => setGovernmentId(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your NGO registration ID"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/50 rounded-xl p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Verification Information
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Your NGO will be verified against government records</li>
                            <li>Verification helps build trust with donors</li>
                            <li>You'll get access to all platform features</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-5 w-5" />
                        </motion.div>
                      </div>
                    ) : (
                      'Submit for Verification'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NGOLayout;