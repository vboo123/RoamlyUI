import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
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
        "http://192.168.1.78:8000/register-user/",
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
    <ScrollView>
      <Text>Register</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        placeholder="Interest One"
        value={interestOne}
        onChangeText={setInterestOne}
      />

      <TextInput
        placeholder="Interest Two"
        value={interestTwo}
        onChangeText={setInterestTwo}
      />

      <TextInput
        placeholder="Interest Three"
        value={interestThree}
        onChangeText={setInterestThree}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Button title="Register" onPress={handleRegister} />
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   input: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//   },
// });

export default Register;
