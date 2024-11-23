import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AppBar from "../../components/AppBar";

const properties = [
  {
    id: "1",
    title: "Luxury Villa",
    description: "A stunning villa with ocean views and modern amenities.",
    price: "$1,200,000",
  },
  {
    id: "2",
    title: "Cozy Cottage",
    description:
      "A charming cottage in the countryside, perfect for a weekend getaway.",
    price: "$350,000",
  },
  {
    id: "3",
    title: "Urban Apartment",
    description: "A sleek apartment located in the heart of the city.",
    price: "$850,000",
  },
];

export default function HomeScreen({ navigation }) {
  const renderProperty = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          {item.description}
        </Text>
        <Text variant="bodyLarge" style={styles.price}>
          {item.price}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => console.log(`Viewing ${item.title}`)}
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <AppBar title="Home" navigation={navigation} />
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
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
  price: {
    color: "#007BFF",
    fontWeight: "bold",
    marginBottom: 10,
  },
});
