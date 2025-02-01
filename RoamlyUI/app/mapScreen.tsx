import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { usePropertyStore } from "@/stores/Property_Store";

export default function MapScreen() {
  console.log("enter mapScreen component");
  const properties = usePropertyStore((state) => state.properties);
  const { itemLatitude, itemLongitude } = useLocalSearchParams<{
    itemLatitude: string;
    itemLongitude: string;
  }>();
  console.log(itemLatitude);
  console.log(itemLongitude);

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
          {itemLatitude && itemLongitude && (
            <Marker
              coordinate={{
                latitude: Number(itemLatitude),
                longitude: Number(itemLongitude),
              }}
              title="Selected Property"
              description="This is your selected property."
            />
          )}

          {/* If no params, display all property markers */}
          {!itemLatitude &&
            !itemLongitude &&
            properties.map((property, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: property.latitude,
                  longitude: property.longitude,
                }}
                title={property.name}
                description={property.description}
              />
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
