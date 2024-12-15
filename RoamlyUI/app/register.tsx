import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />

      <TextInput
        placeholder="Interest One"
        value={interestOne}
        onChangeText={setInterestOne}
        style={styles.input}
      />

      <TextInput
        placeholder="Interest Two"
        value={interestTwo}
        onChangeText={setInterestTwo}
        style={styles.input}
      />

      <TextInput
        placeholder="Interest Three"
        value={interestThree}
        onChangeText={setInterestThree}
        style={styles.input}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Register;
