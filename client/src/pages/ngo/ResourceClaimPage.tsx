import React, { useState, useEffect } from 'react';
import { MapPin, Package, Clock, Calendar, User, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL, DEFAULT_DRIVE_IMAGE } from '../../config/constants';
import LocationModal from '../../components/common/LocationModal';

interface Resource {
  _id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contactInfo: string;
  donorName: string;
  createdAt: string;
  status: 'available' | 'claimed' | 'collected';
}

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
  status: 'active' | 'completed' | 'cancelled';
}

const ResourceClaimPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Resource['location'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch resources
        const resourcesResponse = await axios.get(`${API_URL}/resources`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch upcoming drives
        const drivesResponse = await axios.get(`${API_URL}/drives/upcoming`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setResources(resourcesResponse.data);
        setDrives(drivesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load resources and drives');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleClaim = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/resources/claim/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the UI
      setResources(
        resources.map((resource) =>
          resource._id === id
            ? { ...resource, status: 'claimed' }
            : resource
        )
      );
      
      toast.success('Resource claimed successfully');
    } catch (error) {
      console.error('Error claiming resource:', error);
      toast.error('Failed to claim resource');
    }
  };

  const handleShowLocation = (location: Resource['location']) => {
    setSelectedLocation(location);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-6">
      {/* Resources Section (70%) */}
      <div className="w-full md:w-8/12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Resources</h2>
          
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No resources available at the moment.</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for new donations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div 
                  key={resource._id} 
                  className="border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-800">{resource.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {resource.status === 'available' ? 'Available' : resource.status === 'claimed' ? 'Claimed' : 'Collected'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{resource.location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User size={16} className="mr-1 flex-shrink-0" />
                    <span>{resource.donorName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar size={16} className="mr-1 flex-shrink-0" />
                    <span>{formatDate(resource.createdAt)}</span>
                  </div>
                  
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleShowLocation(resource.location)}
                      className="flex items-center justify-center px-3 py-1.5 border border-gray-300 text-sm leading-5 rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out"
                    >
                      <MapPin size={16} className="mr-1" />
                      View Location
                    </button>
                    
                    {resource.status === 'available' && (
                      <button
                        onClick={() => handleClaim(resource._id)}
                        className="flex items-center justify-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition duration-150 ease-in-out"
                      >
                        Claim Resource
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Drives Section (30%) */}
      <div className="w-full md:w-4/12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Drives</h2>
          
          {drives.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No upcoming drives</p>
              <p className="text-gray-400 text-sm mt-1">Create a new drive from the Post Drives page</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drives.map((drive) => (
                <div 
                  key={drive._id} 
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div 
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${drive.imageUrl || DEFAULT_DRIVE_IMAGE})` }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-md font-medium text-gray-800">{drive.title}</h3>
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
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(drive.date)}
                      <Clock size={14} className="ml-2 mr-1" />
                      {drive.time}
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{drive.description}</p>
                    
                    <div className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-500 flex items-center cursor-pointer">
                      <span>View details</span>
                      <ExternalLink size={12} className="ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default ResourceClaimPage;