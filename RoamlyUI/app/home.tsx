import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AppBar from "../components/AppBar";
import * as Location from "expo-location"; // Import location module
import { useRouter } from "expo-router"; // Import the router
import GrifithObsv from "../assets/images/grifith-obsv.jpeg";

export default function Home({ navigation }) {
  const router = useRouter(); // Initialize router
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // State to store the user's location

  // Fetch the user's location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to fetch properties near you."
          );
          return;
        }

        // Get the current location of the user
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords); // Store the user's location
      } catch (err) {
        setError("Failed to get user location.");
        Alert.alert("Error", "Failed to get user location.");
      }
    };

    getUserLocation();
  }, []);

  // Fetch properties only after getting the user's location
  useEffect(() => {
    if (userLocation) {
      console.log(userLocation);
      const fetchProperties = async () => {
        try {
          const { latitude, longitude } = userLocation;
          console.log(latitude);
          console.log(longitude);

          // Modify the API URL to include the user's location as query parameters
          const response = await fetch(
            `http://192.168.1.78:8000/get-properties/?lat=${latitude}&long=${longitude}&interestOne=Drawing&interestTwo=Running&interestThree=Acting&userAge=21&userCountry=UnitedStatesofAmerica&userLanguage=English`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch properties.");
          }

          const data = await response.json();

          // Extract properties from the response
          if (data && data.properties) {
            setProperties(data.properties);
          } else {
            throw new Error("Invalid response format.");
          }
        } catch (err) {
          setError(err.message);
          Alert.alert("Error", err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProperties();
    }
  }, [userLocation]); // Only trigger the fetch after the user's location is available

  const renderProperty = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {item.landmarkName}
        </Text>
      </Card.Content>
      <Card.Cover source={GrifithObsv} />
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() =>
            router.push({
              pathname: "/details",
              params: {
                item: JSON.stringify(item), // Serialize the object
              },
            })
          }
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={{ color: "red" }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="Welcome" navigation={navigation} />
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.property_id} // Use the unique property_id as the key
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  listContent: {
    paddingVertical: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  title: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 5,
    color: "#666",
  },
  geohash: {
    color: "#007BFF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 100,
  },
});
