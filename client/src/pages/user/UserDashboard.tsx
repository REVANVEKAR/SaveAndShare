import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, ChevronUp, ChevronDown, X, Loader2, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL, DEFAULT_DRIVE_IMAGE } from '../../config/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Drive {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  resourcesRequired: string;
  imageUrl: string;
  ngoId: string;
  ngoName: string;
  location?: {
    address: string;
  };
  status: 'active' | 'completed' | 'cancelled';
}

interface Registration {
  _id: string;
  drive: Drive;
  status: 'registered' | 'attended' | 'cancelled';
  registrationDate: string;
}

const UserDashboard: React.FC = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<Drive | null>(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch upcoming drives
        const drivesResponse = await axios.get(`${API_URL}/drives/upcoming`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch user registrations
        const registrationsResponse = await axios.get(`${API_URL}/drives/my-registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDrives(drivesResponse.data);
        setRegistrations(registrationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load drives');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRegister = async (driveId: string) => {
    try {
      setRegisterLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/drives/register/${driveId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh registrations
      const registrationsResponse = await axios.get(`${API_URL}/drives/my-registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(registrationsResponse.data);
      
      toast.success('Successfully registered for the drive');
      setSelectedDrive(null);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register for the drive');
    } finally {
      setRegisterLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upcoming Drives</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : drives.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming drives available</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drives.map((drive) => (
                  <div 
                    key={drive._id} 
                    className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer border border-gray-200 dark:border-gray-600"
                    onClick={() => setSelectedDrive(drive)}
                  >
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${drive.imageUrl || DEFAULT_DRIVE_IMAGE})` }}
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">{drive.title}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          drive.type === 'food' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          drive.type === 'clothing' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                          drive.type === 'medical' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                          drive.type === 'education' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          drive.type === 'volunteer' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                        }`}>
                          {drive.type.charAt(0).toUpperCase() + drive.type.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={16} className="mr-1 flex-shrink-0" />
                        {formatDate(drive.date)}
                      </div>
                      
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={16} className="mr-1 flex-shrink-0" />
                        {drive.time}
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {drive.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Registration History */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Registration History</h2>
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showHistoryPanel ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {(showHistoryPanel || window.innerWidth >= 1024) && (
              registrations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No registrations yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Register for a drive to see your history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div 
                      key={registration._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-md dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white">
                          {registration.drive.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          registration.status === 'registered' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          registration.status === 'attended' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(registration.drive.date)}
                        <Clock size={12} className="ml-2 mr-1" />
                        {registration.drive.time}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>Registered on: {formatDate(registration.registrationDate)}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {registration.drive.description}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Drive Details Modal */}
      <AnimatePresence>
        {selectedDrive && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col m-4"
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${selectedDrive.imageUrl || DEFAULT_DRIVE_IMAGE})` }}
              >
                <div className="absolute top-0 right-0 p-4">
                  <button
                    onClick={() => setSelectedDrive(null)}
                    className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{selectedDrive.title}</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedDrive.type === 'food' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    selectedDrive.type === 'clothing' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                    selectedDrive.type === 'medical' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                    selectedDrive.type === 'education' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    selectedDrive.type === 'volunteer' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                    'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                  }`}>
                    {selectedDrive.type.charAt(0).toUpperCase() + selectedDrive.type.slice(1)}
                  </span>
                  
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {selectedDrive.ngoName}
                  </span>
                </div>
                
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar size={16} className="mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                    <span>Date: {formatDate(selectedDrive.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                    <span>Time: {selectedDrive.time}</span>
                  </div>
                  
                  {selectedDrive.location && (
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <MapPin size={16} className="mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500 mt-1" />
                      <span>Location: {selectedDrive.location.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedDrive.description}</p>
                </div>
                
                {selectedDrive.resourcesRequired && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Resources Required</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedDrive.resourcesRequired}</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRegister(selectedDrive._id)}
                    disabled={registerLoading}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {registerLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Registering...
                      </div>
                    ) : (
                      'Register for Drive'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;