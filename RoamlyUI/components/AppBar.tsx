import React from "react";
import { Appbar, Menu } from "react-native-paper";
import { StyleSheet } from "react-native";

const AppBar = ({ title, navigation }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header style={styles.header}>
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
            navigation.navigate("Profile");
          }}
          title="Profile"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate("Settings");
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
