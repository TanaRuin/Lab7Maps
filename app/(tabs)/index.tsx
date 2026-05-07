import React from "react";
import { StyleSheet } from "react-native";
import MapView, {
  Circle,
  Marker,
  Polygon,
  Polyline,
  PROVIDER_DEFAULT,
} from "react-native-maps";


const HOME       = { latitude: -6.2272, longitude: 106.7970 }; // Senayan City area
const UNIVERSITY = { latitude: -6.2247, longitude: 106.8039 }; // fX Sudirman


const ROUTE_TO_UNI = [
  { latitude: -6.2272, longitude: 106.7970 }, // Home – Senayan City
  { latitude: -6.2254, longitude: 106.7991 }, // Past Plaza Senayan
  { latitude: -6.2247, longitude: 106.8039 }, // Arrive at fX Sudirman
];

const WEEKLY_SPOTS = [
  { latitude: -6.2272, longitude: 106.7970 }, // Home – Senayan City
  { latitude: -6.2254, longitude: 106.7991 }, // Plaza Senayan
  { latitude: -6.2446, longitude: 106.8006 }, // Blok M Square
  { latitude: -6.1878, longitude: 106.8236 }, // Sarinah
  { latitude: -6.2247, longitude: 106.8039 }, // University – fX Sudirman
];

export default function App() {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      initialRegion={{
        latitude: -6.2200,
        longitude: 106.8050,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
      }}
    >
      {/* ── Home marker ── */}
      <Marker
        coordinate={HOME}
        title="My Home"
        description="Senayan City area"
        pinColor="blue"
      />

      {/* ── University marker ── */}
      <Marker
        coordinate={UNIVERSITY}
        title="My University"
        description="fX Sudirman"
        pinColor="green"
      />

      {/* ── Weekly location markers ── */}
      <Marker
        coordinate={{ latitude: -6.2254, longitude: 106.7991 }}
        title="Plaza Senayan"
        description="Weekly visit"
      />
      <Marker
        coordinate={{ latitude: -6.2446, longitude: 106.8006 }}
        title="Blok M Square"
        description="Weekly visit"
      />
      <Marker
        coordinate={{ latitude: -6.1878, longitude: 106.8236 }}
        title="Sarinah"
        description="Weekly visit"
      />

      {/* ── Polyline: route from home to university ── */}
      <Polyline
        coordinates={ROUTE_TO_UNI}
        strokeColor="#e63946"
        strokeWidth={4}
      />

      {/* ── Polygon: area covering all my weekly spots ── */}
      <Polygon
        coordinates={WEEKLY_SPOTS}
        strokeColor="#457b9d"
        fillColor="rgba(69,123,157,0.25)"
        strokeWidth={3}
      />

      {/* ── Circle around home ── */}
      <Circle
        center={HOME}
        radius={300}
        strokeColor="#e63946"
        fillColor="rgba(230,57,70,0.15)"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
