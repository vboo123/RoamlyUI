import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Headline, Divider } from "react-native-paper";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  // State for user inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Google Sign-In setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "267213343250-3q926vgjgv1dsf7arf97v86gajklrm8l.apps.googleusercontent.com",
    iosClientId: "<YOUR_IOS_CLIENT_ID>",
    androidClientId: "<YOUR_ANDROID_CLIENT_ID>",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const user = await userInfoResponse.json();
      Alert.alert("Login Successful", `Welcome, ${user.name}`);
      router.push("/home");
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert("Error", "Could not retrieve user information.");
    }
  };

  // Handle manual login
  const handleLogin = async () => {
    if (!name || !email) {
      Alert.alert("Input Error", "Please enter both name and email.");
      return;
    }

    try {
      const url = `http://192.168.1.78:8000/login/?name=${encodeURIComponent(
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
        router.push("/home");
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
          mode="contained"
          onPress={() => promptAsync()}
          disabled={!request}
          style={styles.googleButton}
          contentStyle={styles.buttonContent}
        >
          Sign in with Google
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
  googleButton: {
    marginTop: 10,
    backgroundColor: "#db4437",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 10,
    alignSelf: "center",
  },
});
