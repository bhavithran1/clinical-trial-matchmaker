import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

// Uses OpenStreetMap nominatim for geocoding (free, no key) and renders a simple SVG world map overlay
// For a real deployment, you'd use Leaflet.js — this is a lightweight fallback visualization

const US_STATES = {
  'Alabama': [32.8, -86.8], 'Alaska': [64.2, -153.4], 'Arizona': [34.3, -111.1],
  'Arkansas': [34.8, -92.2], 'California': [36.8, -119.4], 'Colorado': [39.1, -105.4],
  'Connecticut': [41.6, -72.7], 'Delaware': [39, -75.5], 'Florida': [27.8, -81.7],
  'Georgia': [32.2, -83.4], 'Hawaii': [19.9, -155.6], 'Idaho': [44.1, -114.5],
  'Illinois': [40, -89.2], 'Indiana': [39.9, -86.3], 'Iowa': [42.1, -93.5],
  'Kansas': [38.5, -98.4], 'Kentucky': [37.7, -84.9], 'Louisiana': [31.2, -91.8],
  'Maine': [45.4, -69.2], 'Maryland': [39, -76.7], 'Massachusetts': [42.4, -71.4],
  'Michigan': [43.3, -84.5], 'Minnesota': [46, -94.3], 'Mississippi': [32.7, -89.7],
  'Missouri': [38.5, -92.5], 'Montana': [47, -110], 'Nebraska': [41.5, -99.9],
  'Nevada': [39.3, -116.6], 'New Hampshire': [43.7, -71.6], 'New Jersey': [40.1, -74.5],
  'New Mexico': [34.5, -106], 'New York': [42.9, -75.5], 'North Carolina': [35.6, -79.8],
  'North Dakota': [47.5, -100.5], 'Ohio': [40.4, -82.8], 'Oklahoma': [35.6, -97.5],
  'Oregon': [43.9, -120.6], 'Pennsylvania': [40.6, -77.2], 'Rhode Island': [41.7, -71.5],
  'South Carolina': [33.9, -80.9], 'South Dakota': [44.4, -100.3], 'Tennessee': [35.9, -86.7],
  'Texas': [31.5, -99.3], 'Utah': [39.3, -111.1], 'Vermont': [44.1, -72.7],
  'Virginia': [37.8, -78.2], 'Washington': [47.4, -120.5], 'West Virginia': [38.5, -80.5],
  'Wisconsin': [44.3, -89.8], 'Wyoming': [43, -107.6],
};

const COUNTRY_CENTERS = {
  'United States': [37.1, -95.7],
  'Canada': [56.1, -106.3],
  'United Kingdom': [55.4, -3.4],
  'Germany': [51.2, 10.5],
  'France': [46.2, 2.2],
  'Australia': [-25.3, 133.8],
  'Japan': [36.2, 138.3],
  'China': [35.9, 104.2],
  'Israel': [31.5, 34.8],
  'Netherlands': [52.1, 5.3],
  'Spain': [40.5, -3.7],
  'Italy': [41.9, 12.6],
};

function geoToXY(lat, lon, width, height) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

export default function TrialMap({ trials }) {
  const [hovered, setHovered] = useState(null);

  // Collect all locations with coordinates
  const locations = [];
  trials.forEach(trial => {
    const locs = trial.protocolSection?.contactsLocationsModule?.locations || [];
    const nctId = trial.protocolSection?.identificationModule?.nctId;
    const title = trial.protocolSection?.identificationModule?.briefTitle;

    locs.forEach(loc => {
      let coords = null;
      if (loc.state && US_STATES[loc.state]) {
        coords = US_STATES[loc.state];
      } else if (loc.country && COUNTRY_CENTERS[loc.country]) {
        coords = COUNTRY_CENTERS[loc.country];
      }
      if (coords) {
        locations.push({
          lat: coords[0], lon: coords[1],
          label: [loc.city, loc.state, loc.country].filter(Boolean).join(', '),
          facility: loc.facility,
          nctId, title,
          status: loc.status,
        });
      }
    });
  });

  const W = 800, H = 400;

  // Group nearby pins
  const groups = {};
  locations.forEach(loc => {
    const [x, y] = geoToXY(loc.lat, loc.lon, W, H);
    const key = `${Math.round(x/20)}_${Math.round(y/20)}`;
    if (!groups[key]) groups[key] = { x, y, locs: [] };
    groups[key].locs.push(loc);
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-teal-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Trial Locations</h3>
        <span className="text-xs text-gray-400 ml-1">({locations.length} sites mapped)</span>
      </div>

      {locations.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          No mappable locations found in current results.
        </div>
      ) : (
        <div className="relative overflow-hidden" style={{ background: 'var(--map-bg, #f8fafc)' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ maxHeight: 320 }}
          >
            {/* Simple continent outlines as rectangles (proxy) */}
            <rect x="50" y="60" width="160" height="180" rx="8" fill="#e2e8f0" className="dark:fill-gray-700" opacity="0.6" />
            <text x="130" y="155" textAnchor="middle" fontSize="8" fill="#94a3b8">North America</text>
            <rect x="220" y="80" width="80" height="120" rx="6" fill="#e2e8f0" className="dark:fill-gray-700" opacity="0.6" />
            <text x="260" y="145" textAnchor="middle" fontSize="8" fill="#94a3b8">South America</text>
            <rect x="320" y="60" width="110" height="100" rx="6" fill="#e2e8f0" className="dark:fill-gray-700" opacity="0.6" />
            <text x="375" y="115" textAnchor="middle" fontSize="8" fill="#94a3b8">Europe</text>
            <rect x="360" y="80" width="60" height="100" rx="6" fill="#e2e8f0" className="dark:fill-gray-700" opacity="0.6" />
            <text x="395" y="175" textAnchor="middle" fontSize="7" fill="#94a3b8">Africa</text>
            <rect x="430" y="60" width="130" height="100" rx="6" fill="#e2e8f0" className="dark:fill-gray-700" opacity="0.6" />
            <text x="495" y="115" textAnchor="middle" fontSize="8" fill="#94a3b8">Asia</text>
            <rect x="560" y="200" width="80" height="70" rx="6" fill="#e2e8f0" className="dark:fill-gray-700" opacity="0.6" />
            <text x="600" y="240" textAnchor="middle" fontSize="7" fill="#94a3b8">Australia</text>

            {/* Location pins */}
            {Object.entries(groups).map(([key, group]) => {
              const count = group.locs.length;
              const isHovered = hovered === key;
              return (
                <g key={key}
                   onMouseEnter={() => setHovered(key)}
                   onMouseLeave={() => setHovered(null)}
                   style={{ cursor: 'pointer' }}>
                  <circle
                    cx={group.x} cy={group.y}
                    r={count > 3 ? 8 : count > 1 ? 6 : 5}
                    fill={isHovered ? '#0d9488' : '#14b8a6'}
                    stroke="white" strokeWidth="1.5"
                    opacity={0.9}
                  />
                  {count > 1 && (
                    <text x={group.x} y={group.y + 4} textAnchor="middle"
                          fontSize="6" fill="white" fontWeight="bold">{count}</text>
                  )}
                  {isHovered && (
                    <foreignObject x={group.x + 8} y={group.y - 30} width="140" height="60">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-1.5 shadow-lg text-xs">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{group.locs[0].label}</p>
                        <p className="text-gray-400 truncate">{group.locs[0].facility}</p>
                        {count > 1 && <p className="text-teal-600 font-medium">+{count-1} more sites</p>}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-400">
        Approximate locations based on state/country data. Hover pins for details.
      </div>
    </div>
  );
}
