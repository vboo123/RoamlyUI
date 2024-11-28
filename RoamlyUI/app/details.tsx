import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

export default function Details() {
  const { item } = useLocalSearchParams();

  const parsedItem = item ? JSON.parse(item) : null; // Parse the serialized object

  console.log(parsedItem);

  if (!parsedItem) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{parsedItem.mediumresponseindiacarsshopping}</Text>
    </View>
  );
}
