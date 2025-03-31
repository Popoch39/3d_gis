"use client";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';
import { useMapStore } from "@/stores/mapStore";
import { useEffect, useRef, useState } from "react";

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
      newMapInstance.addSource('cadastre-parcelles', {
        type: 'raster',
        tiles: [
          'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
        ],
        tileSize: 256,
        attribution: 'IGN-F/Geoportail',
        minzoom: 0,
        maxzoom: 21
      });

      // Ajouter la couche cadastrale
      newMapInstance.addLayer({
        id: 'cadastre-layer',
        type: 'raster',
        source: 'cadastre-parcelles',
        paint: {
          'raster-opacity': 1
        },
        minzoom: 0,
        maxzoom: 21
      });

      const addLayerControl = () => {
        const controlContainer = document.createElement('div');
        controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

        const button = document.createElement('button');
        button.className = 'mapboxgl-ctrl-icon';
        button.type = 'button';
        button.style.padding = '5px';
        button.textContent = 'Cadastre';
        button.title = 'Afficher/Masquer le cadastre';

        let visible = true;
        button.onclick = () => {
          visible = !visible;
          newMapInstance.setLayoutProperty(
            'cadastre-layer',
            'visibility',
            visible ? 'visible' : 'none'
          );
          button.style.backgroundColor = visible ? '#ddd' : '#fff';
        };

        controlContainer.appendChild(button);

        // Ajouter le contrôle à la carte
        newMapInstance.addControl({
          onAdd: () => controlContainer,
          onRemove: () => { }
        }, 'top-right');
      };

      // Ajouter le contrôle une fois que la carte est chargée
      addLayerControl();
    }
    );

    setLoaded(true);
    setMapInstance(newMapInstance);

    return () => {
      resetMapInstance();
      newMapInstance.remove();
    };
  }, []);

  return (
    <div className="map-wrapper" style={{ width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {!loaded && <div className="loading">Chargement de la carte...</div>}
    </div>
  )
};

export default MapComponent; 
