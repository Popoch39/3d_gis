import { getVehicles } from "@/services/vehicles/vehicles";
import { useMapStore } from "@/stores/mapStore";
import { Popup } from "mapbox-gl";
import { useEffect } from "react";
import { toast } from "sonner";

const VehiculeLayer = () => {
  const { mapInstance } = useMapStore();

  const { data, isLoading, error } = getVehicles();

  if (error) {
    toast.error(error.message)
    return;
  }

  if (data && mapInstance) {
    const vehiculeSource = mapInstance.getSource('vehicles');
    if (vehiculeSource) {
      vehiculeSource.setData(data);
    } else {
      mapInstance.addSource('vehicles', {
        type: 'geojson',
        data: data,
      });

      mapInstance.addLayer({
        id: 'vehicle-other-points',
        type: 'circle',
        source: 'vehicles',
        filter: ['all',
          ['!=', ['get', 'vehicle_type'], 'T1'],
          ['!=', ['get', 'vehicle_type'], 'T2']
        ], // Filtre corrigé pour exclure T1 et T2
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF0000', // Rouge pour les autres
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });


      mapInstance.addLayer({
        id: 'vehicle-t1-points',
        type: 'circle',
        source: 'vehicles',
        filter: ['in', 'T1', ['get', 'route_id']],
        paint: {
          'circle-radius': 6,
          'circle-color': '#0066FF', // Bleu pour T1
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });


      mapInstance.addLayer({
        id: 'vehicle-t2-points',
        type: 'circle',
        source: 'vehicles',
        filter: ['in', 'T2', ['get', 'route_id']], // Filtrer les véhicules de type T1
        paint: {
          'circle-radius': 6,
          'circle-color': '#00CC66', // Vert pour T2
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      // Ajouter une couche pour les autres véhicules (rouge par défaut)

      mapInstance.addLayer({
        id: 'vehicle-labels',
        type: 'symbol',
        source: 'vehicles',
        layout: {
          'text-field': ['get', 'vehicle_id'],
          'text-size': 12,
          'text-offset': [0, -1.5],
          'text-anchor': 'bottom'
        },
        paint: {
          'text-color': '#333',
          'text-halo-color': '#FFF',
          'text-halo-width': 1
        }
      });

      const popup = new Popup({
        closeButton: false,
        closeOnClick: false
      });

      const layers = ['vehicle-t1-points', 'vehicle-t2-points', 'vehicle-other-points'];
      layers.forEach(layer => {
        mapInstance.on('mouseenter', layer, (e) => {
          // Changer le curseur
          mapInstance.getCanvas().style.cursor = 'pointer';
          if (!e.features || e.features.length === 0) return
          const coordinates = e.features[0].geometry.coordinates.slice();
          if (!coordinates) return;
          const properties = e.features[0].properties;
          if (!properties) return;
          // Formater le contenu de la popup
          const isTram = properties.route_id.includes('T1') || properties.route_id.includes('T2');
          const popupContent = `
          ${isTram ? '<p style="color: black">Tram</p>' : '<p style="color: black">Bus</p>'}
          <div className="flex flex-col align-center"> 
            <h3 style="color: black">${properties.vehicle_id}</h3>
            <p style="color: black">Route id : ${properties.route_id}</p>
          </div>

        `;

          console.log(popupContent)

          // Positionner et afficher la popup
          popup.setLngLat(coordinates).setHTML(popupContent).addTo(mapInstance);
        });

        mapInstance.on('mouseleave', layer, () => {
          mapInstance.getCanvas().style.cursor = '';
          popup.remove();
        });
      })
    }
  }

  console.log(data);


  return null
}

export default VehiculeLayer
