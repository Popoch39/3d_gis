import { Map, Marker } from "mapbox-gl";
import { create } from "zustand";

interface MapState {
  mapInstance: Map | null;
  isMapInitialized: boolean;
  setMapInstance: (map: Map) => void;
  resetMapInstance: () => void;
  flyTo: (center: [number, number], zoom?: number, pitch?: number, bearing?: number) => void;
  addMarker: (lngLat: [number, number], options?: mapboxgl.MarkerOptions) => mapboxgl.Marker | null;
}

export const useMapStore = create<MapState>((set, get) => ({
  mapInstance: null,
  isMapInitialized: false,

  setMapInstance: (map: Map) => set({ mapInstance: map, isMapInitialized: true }),

  resetMapInstance: () => set({
    mapInstance: null,
    isMapInitialized: false
  }),

  flyTo: (center, zoom = 14, pitch = 60, bearing = 0) => {
    const { mapInstance } = get();
    if (mapInstance) {
      mapInstance.flyTo({
        center,
        zoom,
        pitch,
        bearing,
        essential: true,
        duration: 2000
      });
    }
  },

  addMarker: (lngLat, options = {}) => {
    const { mapInstance } = get();
    if (!mapInstance) return null;

    const marker = new Marker(options)
      .setLngLat(lngLat)
      .addTo(mapInstance);

    return marker;
  }
}));
