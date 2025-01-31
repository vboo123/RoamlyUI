import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

export default function MapScreen() {
  const { itemLatitude, itemLongitude } = useLocalSearchParams<{
    itemLatitude: string;
    itemLongitude: string;
  }>();
  console.log(itemLatitude);
  console.log(itemLongitude);
  const [userLocation, setUserLocation] = useState(null);
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
    };

    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
          <Marker
            coordinate={{
              latitude: Number(itemLatitude),
              longitude: Number(itemLongitude),
            }}
            title="Griffith Observatory"
            description="A great place to visit!"
          />
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
