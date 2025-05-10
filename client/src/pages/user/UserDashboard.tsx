import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, MapPin, History, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL, DEFAULT_DRIVE_IMAGE } from '../../config/constants';

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
}

interface Registration {
  _id: string;
  driveId: string;
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
      const response = await axios.post(
        `${API_URL}/drives/register/${driveId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new registration to the list
      setRegistrations([...registrations, response.data]);
      
      toast.success('Successfully registered for the drive');
      setSelectedDrive(null);
    } catch (error) {
      console.error('Error registering for drive:', error);
      toast.error('Failed to register for drive');
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

  const isRegistered = (driveId: string) => {
    return registrations.some(reg => reg.driveId === driveId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowHistoryPanel(true)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          <History size={16} className="mr-2" />
          My History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No upcoming drives available</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for new opportunities</p>
          </div>
        ) : (
          drives.map((drive) => (
            <div 
              key={drive._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedDrive(drive)}
            >
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${drive.imageUrl || DEFAULT_DRIVE_IMAGE})` }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800">{drive.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    drive.type === 'food' ? 'bg-green-100 text-green-800' :
                    drive.type === 'clothing' ? 'bg-purple-100 text-purple-800' :
                    drive.type === 'medical' ? 'bg-red-100 text-red-800' :
                    drive.type === 'education' ? 'bg-yellow-100 text-yellow-800' :
                    drive.type === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {drive.type.charAt(0).toUpperCase() + drive.type.slice(1)}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-1 flex-shrink-0" />
                  {formatDate(drive.date)}
                </div>
                
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1 flex-shrink-0" />
                  {drive.time}
                </div>
                
                {drive.location && (
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{drive.location.address}</span>
                  </div>
                )}
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{drive.description}</p>
                
                <div className="mt-3 font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  <span>View details</span>
                  <ExternalLink size={16} className="ml-1" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Drive Details Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div 
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedDrive.imageUrl || DEFAULT_DRIVE_IMAGE})` }}
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setSelectedDrive(null)}
                  className="bg-white rounded-full p-1 shadow-md text-gray-700 hover:text-gray-900"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedDrive.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedDrive.type === 'food' ? 'bg-green-100 text-green-800' :
                  selectedDrive.type === 'clothing' ? 'bg-purple-100 text-purple-800' :
                  selectedDrive.type === 'medical' ? 'bg-red-100 text-red-800' :
                  selectedDrive.type === 'education' ? 'bg-yellow-100 text-yellow-800' :
                  selectedDrive.type === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedDrive.type.charAt(0).toUpperCase() + selectedDrive.type.slice(1)}
                </span>
                
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedDrive.ngoName}
                </span>
              </div>
              
              <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 flex-shrink-0 text-gray-400" />
                  <span>Date: {formatDate(selectedDrive.date)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 flex-shrink-0 text-gray-400" />
                  <span>Time: {selectedDrive.time}</span>
                </div>
                
                {selectedDrive.location && (
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 flex-shrink-0 text-gray-400 mt-1" />
                    <span>Location: {selectedDrive.location.address}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{selectedDrive.description}</p>
              </div>
              
              {selectedDrive.resourcesRequired && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Resources Required</h3>
                  <p className="text-gray-600">{selectedDrive.resourcesRequired}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t">
              {isRegistered(selectedDrive._id) ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center text-green-800">
                  You're already registered for this drive
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(selectedDrive._id)}
                  disabled={registerLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {registerLoading ? 'Registering...' : 'Register for this Drive'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Panel Slide-in */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-40 transition-transform duration-300 transform ${
          showHistoryPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">My Participation History</h2>
          <button
            onClick={() => setShowHistoryPanel(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {registrations.length === 0 ? (
            <div className="text-center py-16">
              <History size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No participation history</p>
              <p className="text-gray-400 text-sm mt-1">
                Register for drives to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div 
                  key={registration._id}
                  className="border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-md font-medium text-gray-800">
                      {registration.drive.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      registration.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                      registration.status === 'attended' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(registration.drive.date)}
                    <Clock size={12} className="ml-2 mr-1" />
                    {registration.drive.time}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span>Registered on: {formatDate(registration.registrationDate)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {registration.drive.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;