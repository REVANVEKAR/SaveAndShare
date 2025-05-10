import React from 'react';
import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon issue in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationModalProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ location, onClose }) => {
  const position: [number, number] = [location.lat, location.lng];
  
  const handleOpenInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Resource Location</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-grow flex flex-col">
          <div className="p-4 border-b">
            <p className="text-gray-700">{location.address}</p>
          </div>
          
          <div className="flex-grow h-96">
            <MapContainer 
              center={position} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  {location.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button 
            onClick={handleOpenInGoogleMaps}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;