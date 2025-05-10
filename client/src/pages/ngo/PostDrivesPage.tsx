import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Image, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL, DRIVE_TYPES, DEFAULT_DRIVE_IMAGE } from '../../config/constants';

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
  status: 'active' | 'completed' | 'cancelled';
  participantsCount: number;
}

const PostDrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: '',
    resourcesRequired: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/drives/my-drives`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDrives(response.data);
      } catch (error) {
        console.error('Error fetching drives:', error);
        toast.error('Failed to load drives');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrives();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.type) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/drives`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new drive to the list
      setDrives(prev => [response.data, ...prev]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        type: '',
        resourcesRequired: '',
        imageUrl: ''
      });
      
      toast.success('Drive posted successfully');
    } catch (error) {
      console.error('Error posting drive:', error);
      toast.error('Failed to post drive');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/drives/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the drive from the list
      setDrives(drives.filter(drive => drive._id !== id));
      setShowDeleteConfirm(null);
      
      toast.success('Drive deleted successfully');
    } catch (error) {
      console.error('Error deleting drive:', error);
      toast.error('Failed to delete drive');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      {/* Create Drive Form */}
      <div className="w-full lg:w-7/12 mb-6 lg:mb-0">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a New Drive</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Food Distribution Drive"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your drive, its purpose, and impact..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type of Drive *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select type</option>
                {DRIVE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="resourcesRequired" className="block text-sm font-medium text-gray-700 mb-1">
                Resources Required
              </label>
              <input
                type="text"
                id="resourcesRequired"
                name="resourcesRequired"
                value={formData.resourcesRequired}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Volunteers, Food packets, Medical supplies"
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <div className="flex items-center bg-gray-100 px-3 rounded-r-md border-t border-r border-b border-gray-300">
                  <Image size={20} className="text-gray-500" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Leave empty to use a default image</p>
            </div>
            
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {formLoading ? 'Posting...' : 'Post Drive'}
            </button>
          </form>
        </div>
      </div>

      {/* My Drives List */}
      <div className="w-full lg:w-5/12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Drives</h2>
          
          {drives.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No drives posted yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first drive using the form</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drives.map((drive) => (
                <div 
                  key={drive._id} 
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex">
                    <div 
                      className="w-24 h-24 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${drive.imageUrl || DEFAULT_DRIVE_IMAGE})` }}
                    />
                    <div className="p-3 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-md font-medium text-gray-800 line-clamp-1">{drive.title}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          drive.status === 'active' ? 'bg-green-100 text-green-800' :
                          drive.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(drive.date)}
                        <Clock size={12} className="ml-2 mr-1" />
                        {drive.time}
                      </div>
                      
                      <div className="mt-1 text-xs text-gray-500 flex justify-between items-center">
                        <span>
                          Participants: <span className="font-medium">{drive.participantsCount || 0}</span>
                        </span>
                        
                        <button
                          onClick={() => setShowDeleteConfirm(drive._id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delete Drive</h2>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this drive? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDrivesPage;