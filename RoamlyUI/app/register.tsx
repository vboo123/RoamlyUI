import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, TextInput, Headline, Divider, Text } from "react-native-paper";
import CountryPicker from "react-native-country-picker-modal";
import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";

const interestsList = [
  "Technology",
  "Travel",
  "Cooking",
  "Fitness",
  "Music",
  "Photography",
  "Sports",
  "Gaming",
  "Art",
  "Writing",
  "Science",
  "Movies",
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(null);
  const [age, setAge] = useState("");
  const [countryCode, setCountryCode] = useState("US"); // Default country
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [language, setLanguage] = useState("English"); // Default language

  const handleInterestSelection = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests((prev) => [...prev, interest]);
    } else {
      Alert.alert("Limit Reached", "You can only select up to 3 interests.");
    }
  };

  const handleRegister = async () => {
    // Sort the selected interests alphabetically
    const sortedInterests = [...selectedInterests].sort();

    // Ensure that we have at least 3 interests, otherwise pad the array with empty strings
    while (sortedInterests.length < 3) {
      sortedInterests.push(""); // Add empty string for any missing interests
    }

    const userData = {
      name,
      email,
      country,
      interestOne: sortedInterests[0],
      interestTwo: sortedInterests[1],
      interestThree: sortedInterests[2],
      age,
      language, // Include language in user data
    };

    try {
      const response = await axios.post(
        "https://roamlyservice.onrender.com/register-user/",
        userData
      );
      Alert.alert(
        "Success",
        `User registered successfully!\nUser ID: ${response.data.user_id}`
      );
      clearForm();
      router.navigate("/login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.detail || "An error occurred"
      );
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setCountry(null);
    setAge("");
    setSelectedInterests([]);
    setLanguage("English"); // Reset language to default
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Headline style={styles.headline}>Create Your Account</Headline>
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
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />

        {/* Country Selector */}
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          withCountryNameButton
          withAlphaFilter
          onSelect={(country) => {
            setCountry(country.name);
            setCountryCode(country.cca2);
          }}
        />
        {country && (
          <Text style={styles.selectedCountryText}>
            Selected Country: {country}
          </Text>
        )}

        <TextInput
          label="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          mode="outlined"
          style={styles.input}
        />

        {/* Language Selector */}
        <TextInput
          label="Preferred Language"
          value={language}
          onChangeText={setLanguage}
          mode="outlined"
          style={styles.input}
          placeholder="Enter your preferred language"
        />

        {/* Interests Selector */}
        <Text style={styles.sectionTitle}>Select Your Interests (up to 3)</Text>
        <View style={styles.interestsContainer}>
          {interestsList.map((interest) => (
            <Button
              key={interest}
              mode={
                selectedInterests.includes(interest) ? "contained" : "outlined"
              }
              style={styles.interestButton}
              onPress={() => handleInterestSelection(interest)}
            >
              {interest}
            </Button>
          ))}
        </View>
        {selectedInterests.length > 0 && (
          <Text style={styles.selectedInterestsText}>
            Selected Interests: {selectedInterests.join(", ")}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Register
        </Button>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => router.navigate("/login")}>
            Login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    elevation: 4,
  },
  headline: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  footerText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#6200ee",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginVertical: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  interestButton: {
    marginVertical: 5,
    marginHorizontal: 2,
  },
  selectedInterestsText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  selectedCountryText: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});

export default Register;
