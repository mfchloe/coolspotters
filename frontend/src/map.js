// src/map.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const center = [1.3521, 103.8198]; // Singapore's coordinates

const Map = () => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/optimized-route')
      .then(response => setRoute(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {route.length > 0 && (
        <Polyline positions={route.map(hotspot => [hotspot.lat, hotspot.lng])} color="blue" />
      )}
      {route.map((hotspot, index) => (
        <Marker key={index} position={[hotspot.lat, hotspot.lng]}>
          <Popup>
            Crime Hotspot
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;


