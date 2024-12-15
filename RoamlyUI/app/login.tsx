import React, { useState } from "react";
import { View, Button, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

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
      const url = `http://192.168.1.68:8000/login/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

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
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => router.push("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
});
