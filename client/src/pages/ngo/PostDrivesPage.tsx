import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Image, X, Upload } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      
      let imageUrl = formData.imageUrl;
      
      // If there's a new image, upload it first
      if (selectedImage) {
        const formDataImage = new FormData();
        formDataImage.append('image', selectedImage);
        
        const uploadResponse = await axios.post(
          `${API_URL}/upload`,
          formDataImage,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        imageUrl = uploadResponse.data.imageUrl;
      }
      
      // Create the drive with the uploaded image URL
      const response = await axios.post(
        `${API_URL}/drives`,
        { ...formData, imageUrl },
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
      setSelectedImage(null);
      setImagePreview('');
      
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-7/12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Post a New Drive</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Food Distribution Drive"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your drive, its purpose, and impact..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type of Drive *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="resourcesRequired" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resources Required
                </label>
                <input
                  type="text"
                  id="resourcesRequired"
                  name="resourcesRequired"
                  value={formData.resourcesRequired}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Volunteers, Food packets, Medical supplies"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Drive Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                          >
                            <span>Upload an image</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={formLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? 'Posting...' : 'Post Drive'}
              </button>
            </form>
          </div>
        </div>

        {/* Drives List Section */}
        <div className="w-full lg:w-5/12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">My Drives</h2>
            
            {drives.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No drives posted yet</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Create your first drive using the form</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drives.map((drive) => (
                  <div 
                    key={drive._id} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md dark:bg-gray-700"
                  >
                    <div className="flex">
                      <div 
                        className="w-24 h-24 bg-cover bg-center flex-shrink-0"
                        style={{ 
                          backgroundImage: `url(${drive.imageUrl || DEFAULT_DRIVE_IMAGE})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div className="p-3 flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-md font-medium text-gray-800 dark:text-white line-clamp-1">{drive.title}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            drive.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            drive.status === 'completed' ? 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(drive.date)}
                          <Clock size={12} className="ml-2 mr-1" />
                          {drive.time}
                        </div>
                        
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => setShowDeleteConfirm(drive._id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm flex items-center"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Drive</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Are you sure you want to delete this drive? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md"
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