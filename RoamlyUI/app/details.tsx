import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Text } from "react-native-paper";
import AppBar from "../components/AppBar";
import { usePropertyStore } from "@/stores/Property_Store";
import { useUserStore } from "@/stores/user_store";
import { useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";

export default function Details({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { landmarkName } = useLocalSearchParams();
  const property = usePropertyStore((state) => state.properties[landmarkName]);
  const userInfo = useUserStore((state) => state.userInfo);
  const scrollRef = useRef(null);
  const [textContent, setTextContent] = useState("");
  const words = textContent.split(" ");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (property && property.responses) {
      const responsesRecord = Object.entries(property.responses).reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {}
      );

      const trimmedLandmarkName = landmarkName.replace(" ", "");
      const trimmedCountryName = userInfo.country.replace(" ", "");
      let ageRange =
        Number(userInfo.age) < 25
          ? "young"
          : Number(userInfo.age) < 60
            ? "medium"
            : "old";
      const constructedKey = `${trimmedLandmarkName}_${userInfo.interestOne}_${userInfo.interestTwo}_${userInfo.interestThree}_${trimmedCountryName}_${userInfo.language}_${ageRange}_small`;
      const response = responsesRecord[constructedKey];
      setTextContent(response || "Error getting responses");
    }
  }, [property]);

  const speakText = () => {
    Speech.speak(textContent, {
      language: userInfo.language || "en",
      pitch: 1,
      rate: 0.9,
    });
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <AppBar title="Details" navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
          <Image source={{ uri: property?.imageUri }} style={styles.image} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.description}>{textContent}</Text>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity style={styles.speakButton} onPress={speakText}>
        <Text style={styles.speakButtonText}>🔊 Listen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f9",
  },
  scrollViewContent: {
    padding: 20,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "90%",
    height: 250,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  textContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "90%",
  },
  description: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  speakButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 30,
  },
  speakButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
