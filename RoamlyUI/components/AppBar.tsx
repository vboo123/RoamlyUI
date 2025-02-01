import React from "react";
import { Appbar, Menu, Badge } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const AppBar = ({ title }) => {
  console.log("App bar is rendered");
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(3); // Example notification count
  const router = useRouter(); // Initialize router

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header statusBarHeight="5" style={styles.header}>
      {/* Back Button */}
      <Appbar.BackAction onPress={router.back} color="white" />

      {/* Title */}
      <Appbar.Content title={title} titleStyle={styles.title} />

      {/* Search Icon */}
      <Appbar.Action
        icon="magnify"
        color="white"
        onPress={() => router.push("/search")} // Navigate to a search page
      />

      {/* Notifications Icon with Badge */}
      <View>
        <Appbar.Action
          icon="map"
          color="white"
          onPress={() => router.push("/mapScreen")} // Navigate to notifications page
        />
      </View>

      {/* User Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="account-circle"
            onPress={toggleMenu}
            color="white"
          />
        }
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push("/profile");
          }}
          title="Profile"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push("/bookings");
          }}
          title="My Bookings"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push("/settings");
          }}
          title="Settings"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            Alert.alert("Logged out");
          }}
          title="Logout"
        />
      </Menu>
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
  badge: {
    position: "absolute",
    top: 5,
    right: 10,
    backgroundColor: "red",
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AppBar;
