import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  TextInput,
  Headline,
  Divider,
  Text,
  Checkbox,
} from "react-native-paper";
import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";

const interestOptions = [
  "Sports",
  "Music",
  "Travel",
  "Reading",
  "Technology",
  "Cooking",
  "Fitness",
  "Gaming",
  "Art",
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [age, setAge] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      Alert.alert("Limit Reached", "You can select up to 3 interests.");
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

        <TouchableOpacity
          style={styles.interestSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.interestSelectorText}>
            {selectedInterests.length > 0
              ? selectedInterests.join(", ")
              : "Select Interests (up to 3)"}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Headline style={styles.modalHeadline}>Select Interests</Headline>
              <FlatList
                data={interestOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={
                        selectedInterests.includes(item)
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => toggleInterest(item)}
                    />
                    <Text style={styles.checkboxLabel}>{item}</Text>
                  </View>
                )}
              />
              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Done
              </Button>
            </View>
          </View>
        </Modal>

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
  interestSelector: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 5,
  },
  interestSelectorText: {
    color: "#6200ee",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeadline: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#6200ee",
  },
});

export default Register;
