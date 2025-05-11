import React, { useState, useEffect } from 'react';
import { MapPin, Package, Clock, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../config/constants';
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
  claimedAt: string;
  status: 'available' | 'claimed' | 'collected';
}

const ClaimedResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Resource['location'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaimedResources = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/resources/claimed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching claimed resources:', error);
        toast.error('Failed to load claimed resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaimedResources();
  }, []);

  const handleMarkAsCollected = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/resources/collect/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the UI
      setResources(
        resources.map((resource) =>
          resource._id === id
            ? { ...resource, status: 'collected' }
            : resource
        )
      );
      
      toast.success('Resource marked as collected');
    } catch (error) {
      console.error('Error marking resource as collected:', error);
      toast.error('Failed to mark resource as collected');
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Claimed Resources</h2>
        
        {resources.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No claimed resources yet.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Resources you claim will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div 
                key={resource._id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-md dark:bg-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">{resource.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    resource.status === 'claimed' 
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}>
                    {resource.status === 'claimed' ? 'Claimed' : 'Collected'}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <MapPin size={16} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{resource.location.address}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <User size={16} className="mr-1 flex-shrink-0" />
                  <span>{resource.donorName}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar size={16} className="mr-1 flex-shrink-0" />
                  <span>Claimed on: {formatDate(resource.claimedAt)}</span>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleShowLocation(resource.location)}
                    className="flex items-center justify-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-5 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out"
                  >
                    <MapPin size={16} className="mr-1" />
                    View Location
                  </button>
                  
                  {resource.status === 'claimed' && (
                    <button
                      onClick={() => handleMarkAsCollected(resource._id)}
                      className="flex items-center justify-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition duration-150 ease-in-out"
                    >
                      Mark as Collected
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default ClaimedResourcesPage; 