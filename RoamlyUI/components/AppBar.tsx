import React from "react";
import { Appbar, Menu } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const AppBar = ({ title }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const router = useRouter(); // Initialize router

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={router.back} color="white" />{" "}
      {/* Back button */}
      <Appbar.Content title={title} titleStyle={styles.title} />
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
            router.push("/profile"); // Navigate to Profile page
          }}
          title="Profile"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push("/settings"); // Navigate to Settings page
          }}
          title="Settings"
        />
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#6200EE", // Use your preferred theme color
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AppBar;
