import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, TextInput, Headline, Divider } from "react-native-paper";
import { Alert } from "react-native";

export default function Login() {
  const router = useRouter();

  // State for user inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Function to call FastAPI login endpoint
  const handleLogin = async () => {
    if (!name || !email) {
      Alert.alert("Input Error", "Please enter both name and email.");
      return;
    }

    try {
      // Construct the URL with query parameters
      const url = `http://192.168.1.68:8000/login/?name=${encodeURIComponent(
        name
      )}&email=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        await router.push("/home");
      } else {
        Alert.alert("Login Failed", data.detail);
      }
    } catch (error) {
      console.error(error);
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

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/register")}
          style={styles.registerButton}
        >
          Don't have an account? Register
        </Button>
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
  registerButton: {
    marginTop: 10,
    alignSelf: "center",
  },
});
