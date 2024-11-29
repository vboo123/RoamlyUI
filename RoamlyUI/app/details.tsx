import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";

export default function Details() {
  const { item } = useLocalSearchParams();
  const parsedItem = item ? JSON.parse(item) : null; // Parse the serialized object

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const textContent = parsedItem?.mediumresponseindiacarsshopping || "";
  const words = textContent.split(" ");

  useEffect(() => {
    if (words.length === 0) return;

    const interval = setInterval(() => {
      setHighlightedIndex((prevIndex) =>
        prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, 500); // Adjust interval for reading speed (e.g., 500ms per word)

    return () => clearInterval(interval);
  }, [words]);

  useEffect(() => {
    if (words.length > 0) {
      Speech.speak(textContent, {
        onStart: () => setHighlightedIndex(0),
        onDone: () => setHighlightedIndex(-1),
      });
    }
  }, [textContent]);

  if (!parsedItem) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.text}>
          {words.map((word, index) => (
            <Text
              key={index}
              style={[
                styles.word,
                index === highlightedIndex && styles.highlightedWord,
              ]}
            >
              {word + " "}
            </Text>
          ))}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
  },
  word: {
    color: "#000",
  },
  highlightedWord: {
    backgroundColor: "yellow",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
