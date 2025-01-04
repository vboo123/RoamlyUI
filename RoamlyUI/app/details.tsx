import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text as NativeText,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import AppBar from "../components/AppBar";

const textContent =
  "The Hollywood Sign, perched atop Mount Lee in the Hollywood Hills of Los Angeles, is an iconic symbol of the entertainment industry. Originally erected in 1923 as Hollywoodland to advertise a real estate development, the sign has since become synonymous with the glitz and glamour of Hollywood. Standing 45 feet tall and stretching 350 feet wide, it offers sweeping views of the city and serves as a cultural landmark, drawing visitors from around the world. Over the decades, the sign has been restored and preserved, cementing its status as a beacon of ambition and creativity.";

export default function Details({ navigation }) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const words = textContent.split(" ");
  const scrollRef = useRef(null);

  // Fetch available voices and select a pleasant one
  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((voices) => {
      const pleasantVoice = voices.find(
        (voice) =>
          voice.language.startsWith("en") && voice.quality === "Enhanced"
      );
      setSelectedVoice(pleasantVoice?.identifier || null);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prevIndex) =>
        prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, 500);

    return () => clearInterval(interval);
  }, [words]);

  useEffect(() => {
    Speech.speak(textContent, {
      onStart: () => setHighlightedIndex(0),
      onDone: () => setHighlightedIndex(-1),
      pitch: 1.2,
      rate: 0.9,
      voice: selectedVoice,
    });

    return () => Speech.stop();
  }, [textContent, selectedVoice]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: Math.floor(highlightedIndex / 3) * 50, // Scroll by rows
        animated: true,
      });
    }
  }, [highlightedIndex]);

  const handleWordPress = (index) => {
    setHighlightedIndex(index);
    Speech.stop();
    const newText = words.slice(index).join(" ");
    Speech.speak(newText, {
      pitch: 1.2,
      rate: 0.9,
      voice: selectedVoice,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <AppBar title="Details" navigation={navigation} />
        <View style={styles.wordsContainer}>
          {words.map((word, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handleWordPress(index)}
            >
              <NativeText
                style={[
                  styles.word,
                  index === highlightedIndex && styles.highlightedWord,
                ]}
              >
                {word + " "}
              </NativeText>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f9", // Light background
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  word: {
    fontSize: 20,
    marginHorizontal: 8,
    marginVertical: 6,
    color: "#333",
    textAlign: "center",
  },
  highlightedWord: {
    backgroundColor: "#FFD700", // Golden yellow
    color: "#333",
    fontWeight: "600",
    borderRadius: 5,
    paddingHorizontal: 4,
    textShadowColor: "rgba(0, 0, 0, 0.25)", // Add shadow effect
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
