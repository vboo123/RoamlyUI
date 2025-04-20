import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Headline, Divider } from "react-native-paper";
import * as Location from "expo-location";
import { usePropertyStore } from "@/stores/property_store";
import { useUserStore } from "@/stores/user_store";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const userLat = usePropertyStore((state) => state.userLat);
  const userLong = usePropertyStore((state) => state.userLong);
  const addProperty = usePropertyStore((state) => state.addProperty);
  const userInfo = useUserStore((state) => state.userInfo);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to fetch properties near you."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      await usePropertyStore.setState({
        userLat: location.coords.latitude,
        userLong: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to get user location.");
    }
  };

  const fetchProperties = async () => {
    // Ensure location is available before fetching properties
    if (!userLat || !userLong) {
      console.log("Waiting for location...");
      return;
    }

    let apiURI = userInfo
      ? `http://192.168.1.68:8000/get-properties/?lat=${userLat}&long=${userLong}&interestOne=${userInfo.interestOne}&interestTwo=${userInfo.interestTwo}&interestThree=${userInfo.interestThree}&userAge=${userInfo.age}&userCountry=${userInfo.country}&userLanguage=${userInfo.language}`
      : `http://192.168.1.68:8000/get-properties/?lat=${userLat}&long=${userLong}&interestOne=Drawing&interestTwo=Running&interestThree=Acting&userAge=21&userCountry=UnitedStatesofAmerica&userLanguage=English`;

    try {
      console.log("Fetching properties...");
      const response = await fetch(apiURI, { method: "GET" });

      if (!response.ok) {
        throw new Error("Failed to fetch properties.");
      }

      const data = await response.json();

      if (data && data.properties) {
        Object.values(data.properties).forEach((item) =>
          addProperty(item.landmarkName, item)
        );
        router.push("/home");
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      Alert.alert("Error", "Failed to fetch properties. Retrying...");
      setTimeout(fetchProperties, 3000); // Retry after 3 seconds
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [userLat, userLong]);

  const handleLogin = async () => {
    if (!name || !email) {
      Alert.alert("Input Error", "Please enter both name and email.");
      return;
    }
    setLoading(true);
    try {
      const url = `http://192.168.1.68:8000/login/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        useUserStore.setState({
          userInfo: {
            user_id: data[0],
            name: data[1],
            interestOne: data[2],
            interestTwo: data[3],
            interestThree: data[4],
            age: data[5],
            country:
              data[6] === "United States" ? "UnitedStatesofAmerica" : data[6],
            language: data[7],
          },
        });
        await getUserLocation();
      } else {
        setLoading(false);
        Alert.alert("", data.detail);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error",
        "Unable to connect to the server. Please check your network and try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Headline style={styles.headline}>Welcome to Roamly</Headline>
        <Divider style={styles.divider} />
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>
        )}
        <View style={styles.registerContainer}>
          <Text>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/register")}>
              Register here
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  headline: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#6200ee",
  },
  divider: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6200ee",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  link: {
    color: "#6200ee",
    fontWeight: "bold",
  },
});
