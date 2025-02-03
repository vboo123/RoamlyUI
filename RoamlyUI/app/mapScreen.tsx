import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { usePropertyStore } from "@/stores/Property_Store";

export default function MapScreen() {
  const properties = usePropertyStore((state) => state.properties);
  const userLat = usePropertyStore((state) => state.userLat);
  const userLong = usePropertyStore((state) => state.userLong);
  const { itemLatitude, itemLongitude } = useLocalSearchParams<{
    itemLatitude: string;
    itemLongitude: string;
    landmarkName: string;
  }>();

  const [region, setRegion] = useState(null); // State for initial region
  const navigation = useNavigation(); // Get navigation object

  return (
    <View style={styles.container}>
      {userLat && userLong ? (
        <MapView
          style={styles.map}
          initialRegion={
            region || {
              latitude: userLat,
              longitude: userLong,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
          }
        >
          <Marker
            coordinate={{ latitude: userLat, longitude: userLong }}
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
                <Callout onPress={() => router.navigate("/home")}>
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
