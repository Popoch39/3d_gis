export interface VehicleCollection {
  type: "FeatureCollection";
  features: vehicleFeature[];
}

export interface vehicleFeature {
  type: "Feature";
  geometry: VehicleGeometry;
  properties: VehicleProperties;
}

export interface VehicleGeometry {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface VehicleProperties {
  id: string;
  vehicle_id: string;
  route_id: string;
  trip_id: string;
  timestamp: number;
}
