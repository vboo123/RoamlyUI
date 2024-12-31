import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, Button } from "react-native-paper";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function Home({ navigation }) {
  const router = useRouter();
  const [lyrics, setLyrics] = useState([
    "Welcome to your journey!",
    "Discover landmarks around you.",
    "Engage with your interests.",
    "Explore new adventures.",
  ]);
  const [loading, setLoading] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const renderLyric = ({ item, index }) => {
    const inputRange = [(index - 1) * 50, index * 50, (index + 1) * 50];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[styles.lyricContainer, { transform: [{ scale }], opacity }]}
      >
        <Text style={styles.lyric}>{item}</Text>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={lyrics}
        renderItem={renderLyric}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push("/details")}
      >
        Explore More
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 20,
  },
  listContent: {
    paddingVertical: 50,
  },
  lyricContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  lyric: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
  },
});
