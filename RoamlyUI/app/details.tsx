import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text as NativeText,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";

const textContent =
  "The Hollywood Sign, perched atop Mount Lee in the Hollywood Hills of Los Angeles, is an iconic symbol of the entertainment industry. Originally erected in 1923 as Hollywoodland to advertise a real estate development, the sign has since become synonymous with the glitz and glamour of Hollywood. Standing 45 feet tall and stretching 350 feet wide, it offers sweeping views of the city and serves as a cultural landmark, drawing visitors from around the world. Over the decades, the sign has been restored and preserved, cementing its status as a beacon of ambition and creativity.";

export default function LyricsScreen() {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const words = textContent.split(" ");
  const scrollRef = useRef(null);

  // Fetch available voices and select a pleasant one
  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((voices) => {
      const pleasantVoice = voices.find(
        (voice) =>
          voice.language.startsWith("en") && voice.quality === "Enhanced" // High-quality voices
      );
      setSelectedVoice(pleasantVoice?.identifier || null);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prevIndex) =>
        prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, 500); // Adjust interval for reading speed

    return () => clearInterval(interval);
  }, [words]);

  useEffect(() => {
    Speech.speak(textContent, {
      onStart: () => setHighlightedIndex(0),
      onDone: () => setHighlightedIndex(-1),
      pitch: 1.2, // Adjust for tone (1 is default, higher is higher-pitched)
      rate: 0.9, // Adjust for slower or faster speech
      voice: selectedVoice, // Use the selected voice
      onWord: (event) => {
        // Event callback to track word progress
        const currentWordIndex = words.indexOf(event?.word);
        if (currentWordIndex !== -1) {
          setHighlightedIndex(currentWordIndex);
        }
      },
    });

    return () => Speech.stop();
  }, [textContent, selectedVoice]);

  useEffect(() => {
    // Scroll to the highlighted word
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: highlightedIndex * 40, // Adjust based on word height
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
    backgroundColor: "#fff",
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
    fontSize: 18,
    margin: 5,
    color: "#000",
  },
  highlightedWord: {
    backgroundColor: "yellow",
    color: "#000",
    fontWeight: "bold",
  },
});
