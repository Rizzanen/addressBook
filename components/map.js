import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Map({ route, navigation }) {
  const { address } = route.params;

  const [coordinates, setCoordinates] = useState({
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  useEffect(() => {
    fetch(
      `https://geocode.maps.co/search?q=${address}&api_key=65b297a62aa8d697670042rwmc299a3`
    )
      .then((response) => response.json())
      .then((data) => {
        setCoordinates({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        });
      })
      .catch((error) => Alert.alert("Error" + error));
  }, []);
  return (
    <MapView
      style={{ flex: 1, height: "80%", width: "100%" }}
      region={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: coordinates.latitudeDelta,
        longitudeDelta: coordinates.longitudeDelta,
      }}
    >
      <Marker
        coordinate={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }}
        title={address}
      />
    </MapView>
  );
}
