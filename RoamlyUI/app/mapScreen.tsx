import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { usePropertyStore } from "@/stores/Property_Store";

export default function MapScreen() {
  const properties = usePropertyStore((state) => state.properties);
  const { itemLatitude, itemLongitude, landmarkName } = useLocalSearchParams<{
    itemLatitude: string;
    itemLongitude: string;
    landmarkName: string;
  }>();

  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null); // State for initial region
  const navigation = useNavigation(); // Get navigation object

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // If no params provided, calculate the region to fit all properties and user location
      if (!itemLatitude && !itemLongitude) {
        // Get the bounds for the properties
        const latitudes = properties.map((property) => property.latitude);
        const longitudes = properties.map((property) => property.longitude);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLong = Math.min(...longitudes);
        const maxLong = Math.max(...longitudes);

        setRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLong + maxLong) / 2,
          latitudeDelta: Math.abs(maxLat - minLat) + 0.05,
          longitudeDelta: Math.abs(maxLong - minLong) + 0.05,
        });
      }
    };

    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={
            region || {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
          }
        >
          {/* User Location Marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />

          {/* If params are provided, display the single property marker */}
          {!itemLatitude &&
            !itemLongitude &&
            properties.map((property, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: property.latitude,
                  longitude: property.longitude,
                }}
              >
                <Callout onPress={() => router.push("/home")}>
                  <TouchableWithoutFeedback>
                    <View style={{ padding: 10, width: 150 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {property.landmarkName}
                      </Text>
                      <Text>Click Here to View Details</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </Callout>
              </Marker>
            ))}
        </MapView>
      ) : (
        <View style={styles.container}>
          <Text>Fetching Location...</Text>
        </View>
      )}

      {/* Back Button */}
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});
