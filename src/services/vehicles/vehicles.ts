import { useQuery } from "@tanstack/react-query";
import { VehicleCollection } from "./vehiclesTypes";

const fetchVehicles = async (): Promise<VehicleCollection> => {
  const res = await fetch("http://localhost:8000/gtfsrt.geojson", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  });
  if (!res.ok) throw new Error("start the docker container you fool");
  return res.json();
}

export const getVehicles = () => {
  return useQuery<VehicleCollection>({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
    refetchInterval: 1000,
  });
}
