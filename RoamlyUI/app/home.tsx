import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AppBar from "../components/AppBar";
import { useRouter } from "expo-router"; // Import the router
import GrifithObsv from "../assets/images/grifith-obsv.jpeg";
import { usePropertyStore } from "@/stores/Property_Store";

export default function Home({ navigation }) {
  const router = useRouter();
  const properties = usePropertyStore((state) => state.properties);
  const [error, setError] = useState(null);

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
            })
          }
        >
          View Details
        </Button>
        <Button
          mode="contained"
          onPress={() =>
            router.push({
              pathname: "/mapScreen",
              params: {
                itemLatitude: item.latitude,
                itemLongitude: item.longitude,
                landmarkName: item.landmarkName,
              },
            })
          }
        >
          View Map
        </Button>
      </Card.Actions>
    </Card>
  );

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
      <AppBar title="Home" navigation={navigation} />
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
