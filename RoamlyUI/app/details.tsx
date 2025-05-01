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
import { usePropertyStore } from "@/stores/property_store";
import { useUserStore } from "@/stores/user_store";
import { useLocalSearchParams } from "expo-router";
import GrifithObsv from "../assets/images/grifith-obsv.jpeg";
import { Audio } from "expo-av";

export default function Details({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { landmarkName } = useLocalSearchParams();
  const property = usePropertyStore((state) => state.properties[landmarkName]);
  const userInfo = useUserStore((state) => state.userInfo);
  const scrollRef = useRef(null);
  const [textContent, setTextContent] = useState("");
  const [sound, setSound] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchLandmarkResponse = async () => {
      if (!landmarkName || !userInfo) return;

      const baseUrl = "http://192.168.1.78:8000/landmark-response";
      const url = `${baseUrl}?landmark=${encodeURIComponent(
        landmarkName
      )}&userCountry=${encodeURIComponent(
        userInfo.country
      )}&interestOne=${encodeURIComponent(
        userInfo.interestOne
      )}&interestTwo=${encodeURIComponent(
        userInfo.interestTwo
      )}&interestThree=${encodeURIComponent(userInfo.interestThree)}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok && data.response) {
          setTextContent(data.response);
        } else {
          console.warn("⚠️ Unexpected response:", data);
          setTextContent("Sorry, we couldn't load a description.");
        }
      } catch (error) {
        console.error("❌ Error fetching landmark response:", error.message);
        setTextContent("Failed to load landmark details.");
      }
    };

    fetchLandmarkResponse();
  }, [landmarkName, userInfo]);

  useEffect(() => {
    const speakFromApi = async () => {
      if (!textContent) return;

      console.log("sending text content");

      try {
        const response = await fetch(
          `http://192.168.1.78:8002/generate-audio?text=${encodeURIComponent(
            textContent
          )}`
        );
        const { sound } = await Audio.Sound.createAsync({ uri: response.url });
        setSound(sound);
        await sound.playAsync();
      } catch (err) {
        console.error("TTS audio failed:", err);
      }
    };

    speakFromApi();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [textContent]);

  const replayAudio = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Details" navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
          <Image source={GrifithObsv} style={styles.image} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.description}>{textContent}</Text>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity style={styles.speakButton} onPress={replayAudio}>
        <Text style={styles.speakButtonText}>🔊 Replay</Text>
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
