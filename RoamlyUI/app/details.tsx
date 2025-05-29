import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
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
  const [audioUrl, setAudioUrl] = useState(null);
  const [sound, setSound] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchLandmarkResponse = async () => {
      if (!landmarkName || !userInfo || !property?.geohash) return;

      const baseUrl = "https://roamlyservice.onrender.com/landmark-response";
      const url = `${baseUrl}?landmark=${encodeURIComponent(
        landmarkName
      )}&geohash=${encodeURIComponent(
        property.geohash
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
        console.log(data);
        if (res.ok && data.text) {
          setTextContent(data.text);
          setAudioUrl(data.audio_url || null);
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
  }, [landmarkName, userInfo, property]);

  useEffect(() => {
    const playAudio = async () => {
      if (!audioUrl) return;

      setIsAudioLoading(true);

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          undefined,
          true
        );
        setSound(sound);
      } catch (err) {
        console.error("🔇 Failed to play audio:", err);
        Alert.alert(
          "Audio Error",
          "Unable to play the audio. It may not be fully ready yet."
        );
      } finally {
        setIsAudioLoading(false);
      }
    };

    playAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

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

        {isAudioLoading && (
          <ActivityIndicator
            size="large"
            color="#6200EE"
            style={{ marginTop: 20 }}
          />
        )}
        {!audioUrl && (
          <Text style={{ color: "#888", marginTop: 20 }}>
            No audio available for this landmark.
          </Text>
        )}
      </ScrollView>

      {audioUrl && (
        <TouchableOpacity style={styles.speakButton} onPress={replayAudio}>
          <Text style={styles.speakButtonText}>🔊 Replay</Text>
        </TouchableOpacity>
      )}
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
