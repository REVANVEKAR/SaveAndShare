export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DEFAULT_AVATAR = 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=150';

export const DEFAULT_DRIVE_IMAGE = 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600';

export const DRIVE_TYPES = [
  { value: 'food', label: 'Food Distribution' },
  { value: 'clothing', label: 'Clothing Drive' },
  { value: 'medical', label: 'Medical Camp' },
  { value: 'education', label: 'Educational Event' },
  { value: 'volunteer', label: 'Volunteer Drive' },
  { value: 'other', label: 'Other' }
];