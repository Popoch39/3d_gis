"use client";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';
import { useMapStore } from "@/stores/mapStore";
import { useEffect, useRef, useState } from "react";
import { getVehicles } from '@/services/vehicles/vehicles';
import { toast } from 'sonner';
import VehiculeLayer from './layers/VehiculeLayer';

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { mapInstance, setMapInstance, resetMapInstance } = useMapStore();

  useEffect(() => {
    if (!mapContainer.current || mapInstance) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    const newMapInstance = new Map({
      container: mapContainer.current,
      style: 'mapbox://styles/hellodvc/cm8xinlnd000o01s63k2gcchp',
      center: [5.0415, 47.3220],
      zoom: 13,
      pitch: 0,
      bearing: 0,
      antialias: true,
      renderWorldCopies: false,
      preserveDrawingBuffer: false,
    });


    newMapInstance.on('load', () => {
      setLoaded(true);
      newMapInstance.setConfig("basemap", { lightPreset: 'dawn' });
    });
    setMapInstance(newMapInstance);

    return () => {
      resetMapInstance();
      newMapInstance.remove();
    };
  }, []);

  return (
    <div className="map-wrapper" style={{ width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <VehiculeLayer />
      {!loaded && <div className="loading">Chargement de la carte...</div>}
    </div>
  )
};

export default MapComponent; 
