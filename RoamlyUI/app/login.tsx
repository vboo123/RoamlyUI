import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { useAuthRequest } from "expo-auth-session";
import * as AuthSession from "expo-auth-session"; // Import AuthSession explicitly
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router"; // Import the router

// Enable web browser to handle redirects
WebBrowser.maybeCompleteAuthSession();
//https://stackoverflow.com/questions/70286836/how-to-fix-google-expo-auth-session-sign-in-error-something-went-wrong-when-try
export default function Login({ navigation }) {
  const router = useRouter(); // Initialize router
  // const redirectUri = AuthSession.makeRedirectUri({});
  // const redirectUri = "https://auth.expo.io/@vboo/RoamlyUI";
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "267213343250-0pa7u4cm48b9e9thtk19d935nuks7avf.apps.googleusercontent.com",
  //   redirectUri,
  // });

  // useEffect(() => {
  //   console.log(response);
  // }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>
      <Button onPress={() => router.push("/home")} title="Login with Google" />
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
  userInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: "#555",
  },
});
