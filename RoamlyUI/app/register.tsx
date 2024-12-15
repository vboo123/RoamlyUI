import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, TextInput, Headline, Divider, Text } from "react-native-paper";
import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [interestOne, setInterestOne] = useState("");
  const [interestTwo, setInterestTwo] = useState("");
  const [interestThree, setInterestThree] = useState("");
  const [age, setAge] = useState("");

  const handleRegister = async () => {
    const userData = {
      name,
      email,
      country,
      interestOne,
      interestTwo,
      interestThree,
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
    setInterestOne("");
    setInterestTwo("");
    setInterestThree("");
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

        <TextInput
          label="Interest One"
          value={interestOne}
          onChangeText={setInterestOne}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Interest Two"
          value={interestTwo}
          onChangeText={setInterestTwo}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Interest Three"
          value={interestThree}
          onChangeText={setInterestThree}
          mode="outlined"
          style={styles.input}
        />

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
