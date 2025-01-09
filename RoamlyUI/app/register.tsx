import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  TextInput,
  Headline,
  Divider,
  Text,
  Chip,
} from "react-native-paper";
import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [age, setAge] = useState("");

  const interestsList = [
    "Travel",
    "Food",
    "Technology",
    "Sports",
    "Fitness",
    "Art",
    "Music",
    "Reading",
    "Gaming",
    "Photography",
  ];

  const handleSelectInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      // Remove interest if it's already selected
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 3) {
      // Add interest if less than 3 are selected
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      Alert.alert("Limit Reached", "You can select up to 3 interests only.");
    }
  };

  const handleRegister = async () => {
    const userData = {
      name,
      email,
      country,
      interests: selectedInterests,
      age,
    };

    try {
      const response = await axios.post(
        "http://192.168.1.68:8000/register-user/",
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
    setCountry("");
    setSelectedInterests([]);
    setAge("");
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

        <TextInput
          label="Country"
          value={country}
          onChangeText={setCountry}
          mode="outlined"
          style={styles.input}
        />

        <Text style={styles.subheading}>Select up to 3 Interests</Text>
        <View style={styles.chipContainer}>
          {interestsList.map((interest) => (
            <Chip
              key={interest}
              style={[
                styles.chip,
                selectedInterests.includes(interest) && styles.chipSelected,
              ]}
              textStyle={[
                styles.chipText,
                selectedInterests.includes(interest) && styles.chipTextSelected,
              ]}
              onPress={() => handleSelectInterest(interest)}
            >
              {interest}
            </Chip>
          ))}
        </View>

        <TextInput
          label="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          mode="outlined"
          style={styles.input}
        />

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
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 5,
    backgroundColor: "#e0e0e0",
  },
  chipSelected: {
    backgroundColor: "#6200ee",
  },
  chipText: {
    color: "#000",
  },
  chipTextSelected: {
    color: "#fff",
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
});

export default Register;
