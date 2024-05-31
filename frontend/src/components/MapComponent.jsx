import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import categorizeCrimeData from '../categorizeCrimeData';
import neighborhoods from '../neighborhoods';
import 'leaflet.heat';

// Fix for the default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const HeatmapLayer = ({ points }) => {
  const map = useMap(); // Use useMap here

  useEffect(() => {
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

const MapComponent = () => {
  const [categorizedData, setCategorizedData] = useState([]);

  useEffect(() => {
    fetch('/api/crimeData')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched crime data:', data); // Debugging log
        const categorized = categorizeCrimeData(data);
        console.log('Categorized crime data:', categorized); // Debugging log
        setCategorizedData(categorized);
      })
      .catch(error => console.error('Error loading crime data:', error));
  }, []);

  // Combine all crimes for the heatmap
  const heatmapPoints = categorizedData.flatMap(neighborhood =>
    neighborhood.crimes.map(crime => [crime.lat, crime.lng, crime.weight])
  );

  return (
    <MapContainer center={[1.3521, 103.8198]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatmapLayer points={heatmapPoints} />
    </MapContainer>
  );
};

export default MapComponent;
