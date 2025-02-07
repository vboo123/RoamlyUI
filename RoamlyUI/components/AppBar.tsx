import React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet, View, Alert } from "react-native";
import { useRouter, useSegments } from "expo-router"; // Import useSegments
import { usePropertyStore } from "@/stores/Property_Store";

const AppBar = ({ title }) => {
  console.log("App bar is rendered");
  const router = useRouter(); // Initialize router
  const segments = useSegments(); // Get the current route segments

  const handleLogout = async () => {
    try {
      // Clear all session data from PropertyStore
      usePropertyStore.setState({
        userLat: null,
        userLong: null,
        properties: {},
      });
      console.log("User logged out");

      // Redirect to login page
      router.navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error("Error during logout", error);
      Alert.alert("Error", "An error occurred while logging out");
    }
  };

  return (
    <Appbar.Header statusBarHeight="5" style={styles.header}>
      {/* Conditionally render back button only on details page */}
      {segments.includes("details") && (
        <Appbar.BackAction color="white" onPress={() => router.back()} />
      )}

      {/* Title */}
      <Appbar.Content title={title} titleStyle={styles.title} />

      {/* Search Icon */}
      <Appbar.Action
        icon="magnify"
        color="white"
        onPress={() => router.push("/search")} // Navigate to a search page
      />

      {/* Map Icon */}
      <View>
        <Appbar.Action
          icon="map"
          color="white"
          onPress={() => router.push("/mapScreen")} // Navigate to map page
        />
      </View>

      {/* Logout Icon */}
      <View>
        <Appbar.Action icon="logout" color="white" onPress={handleLogout} />
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#6200EE", // Primary theme color
    elevation: 4, // Shadow for elevation
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AppBar;
