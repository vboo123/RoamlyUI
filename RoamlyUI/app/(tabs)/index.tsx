import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AppBar from "../../components/AppBar";

export default function HomeScreen({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "http://192.168.1.68:8000/get-properties/"
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
  }, []);

  const renderProperty = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {item.name}
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          {item.city}, {item.country}
        </Text>
        <Text variant="bodyLarge" style={styles.geohash}>
          Geohash: {item.geohash_code}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => console.log(`Viewing ${item.name}`)}
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
});
