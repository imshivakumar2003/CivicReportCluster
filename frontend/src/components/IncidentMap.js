import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const IncidentMap = ({ complaints = [] }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [viewMode, setViewMode] = useState('markers');

    // 1. Initialize Map
    useEffect(() => {
        if (!mapInstance.current && mapRef.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([20.5937, 78.9629], 5);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
        }

        // 2. Fix the "Grey Map" issue using ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            if (mapInstance.current) {
                mapInstance.current.invalidateSize();
            }
        });

        if (mapRef.current) {
            resizeObserver.observe(mapRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    // 3. Update Markers when complaints or viewMode change
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        // Clear old layers
        map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker || layer instanceof L.Marker || layer._latlngs) {
                map.removeLayer(layer);
            }
        });

        const points = [];
        complaints.forEach((c) => {
            if (c.location?.lat && c.location?.lng) {
                const lat = parseFloat(c.location.lat);
                const lng = parseFloat(c.location.lng);
                points.push([lat, lng]);

                L.circleMarker([lat, lng], {
                    radius: 10,
                    fillColor: c.status === 'Pending' ? '#ef4444' : '#10b981',
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 0.8
                })
                    .addTo(map)
                    .bindPopup(`
                    <div style="padding:10px; min-width:150px;">
                        <h4 style="margin:0 0 5px 0;">${c.title}</h4>
                        <p style="font-size:12px; color:#666;">Status: ${c.status}</p>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                           target="_blank" 
                           style="display:block; background:#000; color:#fff; text-align:center; padding:8px; border-radius:5px; text-decoration:none; margin-top:10px; font-size:11px;">
                           Get Directions
                        </a>
                    </div>
                `);
            }
        });

        if (points.length > 0) {
            map.fitBounds(points, { padding: [40, 40] });
        }
    }, [complaints, viewMode]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '75vh', borderRadius: '24px', overflow: 'hidden', border: '1px solid #ddd' }}>
            {/* Header Overlay */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ background: 'white', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'auto', fontWeight: 'bold', fontSize: '12px' }}>
                    LIVE INCIDENT FEED ({complaints.length})
                </div>
            </div>

            {/* THE MAP - Style height 100% is critical */}
            <div ref={mapRef} style={{ height: '100%', width: '100%', background: '#f0f0f0' }} />
        </div>
    );
};

export default IncidentMap;