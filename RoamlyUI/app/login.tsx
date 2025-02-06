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
import * as Location from "expo-location"; // Import location module
import { usePropertyStore } from "@/stores/Property_Store";
import { useUserStore } from "@/stores/user_store";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userLat = usePropertyStore((state) => state.userLat);
  const userLong = usePropertyStore((state) => state.userLong);
  const addProperty = usePropertyStore((state) => state.addProperty);
  const userInfo = useUserStore((state) => state.userInfo);

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

  const getUserLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to fetch properties near you."
        );
        return;
      }

      // Get the current location of the user
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set the user location in the store
      usePropertyStore.setState({ userLat: latitude, userLong: longitude });
    } catch (err) {
      Alert.alert("Error", "Failed to get user location.");
    }
  };

  const fetchProperties = async () => {
    let apiURI = "";
    if (userInfo) {
      // ToDO: need to handle cases if less than 2 interests provided
      // need better handling because the defualt is '' -> need better error handling / checking here
      apiURI = `http://192.168.1.78:8000/get-properties/?lat=${userLat}&long=${userLong}&interestOne=${userInfo.interestOne}&interestTwo=${userInfo.interestTwo}&interestThree=${userInfo.interestThree}&userAge=${userInfo.age}&userCountry=${userInfo.country}&userLanguage=${userInfo.language}`;
    } else {
      // default route if userInfo is not valid
      // ToDO: figure out what to do here
      apiURI = `http://192.168.1.78:8000/get-properties/?lat=${userLat}&long=${userLong}&interestOne=Drawing&interestTwo=Running&interestThree=Acting&userAge=21&userCountry=UnitedStatesofAmerica&userLanguage=English`;
    }

    try {
      const response = await fetch(apiURI);
      if (!response.ok) {
        throw new Error("Failed to fetch properties.");
      }
      const data = await response.json();

      // Extract properties from the response
      if (data && data.properties) {
        const propertiesArray = Object.values(data.properties);
        propertiesArray.forEach((item) => {
          addProperty(item.landmarkName, item);
        });
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

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
      router.navigate("/home");
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

      if (data) {
        if (data[6] == "United States") {
          useUserStore.setState({
            userInfo: {
              user_id: data[0],
              name: data[1],
              interestOne: data[2],
              interestTwo: data[3],
              interestThree: data[4],
              age: data[5],
              country: "UnitedStatesofAmerica",
              language: data[7],
            },
          });
        } else {
          useUserStore.setState({
            userInfo: {
              user_id: data[0],
              name: data[1],
              interestOne: data[2],
              interestTwo: data[3],
              interestThree: data[4],
              age: data[5],
              country: data[6],
              language: data[7],
            },
          });
        }
      }

      if (response.ok) {
        // do all API calls and populate the store here
        await getUserLocation();
        await fetchProperties();
        if (!loading) await router.push("/home");
      } else {
        Alert.alert("", data.detail);
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
