import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issue in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map centering
const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) map.flyTo(coords, 14, { duration: 1.5 });
    }, [coords, map]);
    return null;
};

const HotspotsMap = ({ complaints = [], activeLocation }) => {
    // Default center (Bangalore)
    const defaultCenter = [12.9716, 77.5946];

    return (
        <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Added 'Array.isArray' check to prevent crashes */}
                {Array.isArray(complaints) && complaints.map((c) => {
                    // Check if coordinates exist and are in [lat, lng] format
                    if (!c.location?.coordinates || c.location.coordinates.length < 2) return null;

                    return (
                        <Marker key={c._id} position={c.location.coordinates}>
                            <Popup>
                                <div className="p-2 min-w-[150px]">
                                    <h4 className="font-black text-slate-900 text-sm uppercase leading-tight mb-1">{c.title}</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500 bg-slate-50 p-2 rounded-lg">
                                        {c.location.address}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {activeLocation && <RecenterMap coords={activeLocation} />}
            </MapContainer>
        </div>
    );
};

export default HotspotsMap;