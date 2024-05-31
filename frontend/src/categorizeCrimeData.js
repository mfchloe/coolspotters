// src/categorizeCrimeData.js
import neighborhoods from './neighborhoods';

const isPointInBounds = (point, bounds) => {
  const [sw, ne] = bounds;
  return (
    point.lat >= sw.lat &&
    point.lat <= ne.lat &&
    point.lng >= sw.lng &&
    point.lng <= ne.lng
  );
};

const categorizeCrimeData = (crimeData) => {
  const categorizedData = neighborhoods.map((neighborhood) => ({
    name: neighborhood.name,
    bounds: neighborhood.bounds,
    crimes: crimeData.filter((crime) =>
      isPointInBounds(crime, neighborhood.bounds)
    ),
  }));

  return categorizedData;
};

export default categorizeCrimeData;
