import * as Location from 'expo-location';
import React, { useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

type Coords = { latitude: number; longitude: number };

export default function GeocoderScreen() {
  const [addressInput, setAddressInput] = useState("fX Sudirman, Jakarta");
  const [coords, setCoords]             = useState<Coords | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [loading, setLoading]           = useState(false);

  
  const a11y = {
    screenHeader: "Geocoder screen – convert addresses to coordinates and back",
    input: {
      label: "Address input field",
      hint:  "Type a place or street address, then tap Geocode",
    },
    geocodeBtn: "Geocode button – converts the typed address into coordinates",
    reverseBtn: "Reverse geocode button – converts current coordinates back into a readable address",
    coordsDisplay: (lat: number, lng: number) =>
      `Result: latitude ${lat.toFixed(4)}, longitude ${lng.toFixed(4)}`,
    addressDisplay: (addr: string) => `Resolved address: ${addr}`,
  };

  
  const handleGeocode = async () => {
    if (!addressInput.trim()) {
      Alert.alert("Empty input", "Please type an address first.");
      return;
    }
    setLoading(true);
    try {
      const results = await Location.geocodeAsync(addressInput);
      if (results.length === 0) {
        Alert.alert("Not found", "No coordinates found for that address.");
        return;
      }
      const { latitude, longitude } = results[0];
      setCoords({ latitude, longitude });
      setResolvedAddress(""); // clear old reverse result
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Geocoding failed. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleReverseGeocode = async () => {
    if (!coords) {
      Alert.alert("No coordinates", "Geocode an address first.");
      return;
    }
    setLoading(true);
    try {
      const results = await Location.reverseGeocodeAsync(coords);
      if (results.length === 0) {
        Alert.alert("Not found", "Could not resolve those coordinates.");
        return;
      }
      const r = results[0];
      const parts = [r.streetNumber, r.street, r.district, r.city, r.region, r.country]
        .filter(Boolean);
      setResolvedAddress(parts.join(", "));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Reverse geocoding failed. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Title ── */}
      <Text
        style={styles.title}
        accessible
        accessibilityRole="header"
        accessibilityLabel={a11y.screenHeader}
      >
        📍 GeoCoder
      </Text>

      {/* ── Address input ── */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={addressInput}
        onChangeText={setAddressInput}
        placeholder="e.g. Monas, Jakarta"
        accessible
        accessibilityLabel={a11y.input.label}
        accessibilityHint={a11y.input.hint}
      />

      {/* ── Geocode button ── */}
      <Pressable
        style={[styles.btn, styles.btnPrimary]}
        onPress={handleGeocode}
        disabled={loading}
        accessible
        accessibilityLabel={a11y.geocodeBtn}
        accessibilityRole="button"
      >
        <Text style={styles.btnText}>
          {loading ? "Working…" : "Geocode Address →"}
        </Text>
      </Pressable>

      {/* ── Coordinates result ── */}
      {coords && (
        <View
          style={styles.resultBox}
          accessible
          accessibilityLabel={a11y.coordsDisplay(coords.latitude, coords.longitude)}
        >
          <Text style={styles.resultLabel}>Coordinates</Text>
          <Text style={styles.resultValue}>
            {coords.latitude.toFixed(6)},  {coords.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      {/* ── Reverse geocode button ── */}
      <Pressable
        style={[styles.btn, styles.btnSecondary, !coords && styles.btnDisabled]}
        onPress={handleReverseGeocode}
        disabled={!coords || loading}
        accessible
        accessibilityLabel={a11y.reverseBtn}
        accessibilityRole="button"
      >
        <Text style={[styles.btnText, !coords && styles.btnTextDisabled]}>
          ← Reverse Geocode
        </Text>
      </Pressable>

      {/* ── Resolved address result ── */}
      {!!resolvedAddress && (
        <View
          style={styles.resultBox}
          accessible
          accessibilityLabel={a11y.addressDisplay(resolvedAddress)}
        >
          <Text style={styles.resultLabel}>Resolved Address</Text>
          <Text style={styles.resultValue}>{resolvedAddress}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 50 : 80,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1a1a2e",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  btn: {
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: "#457b9d",
  },
  btnSecondary: {
    backgroundColor: "#e63946",
  },
  btnDisabled: {
    backgroundColor: "#ccc",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  btnTextDisabled: {
    color: "#888",
  },
  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#457b9d",
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    color: "#1a1a2e",
    fontWeight: "500",
  },
});
