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

const Profile = () => {
  // Example user data (should be fetched from the server)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    country: "United States",
    age: "28",
    interests: ["Technology", "Fitness", "Music"],
  });

  const [countryCode, setCountryCode] = useState("US");
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [updatedData, setUpdatedData] = useState({
    name: userData.name,
    email: userData.email,
    country: userData.country,
    age: userData.age,
    interests: userData.interests,
  });

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

  const handleInterestSelection = (interest) => {
    if (updatedData.interests.includes(interest)) {
      setUpdatedData((prev) => ({
        ...prev,
        interests: prev.interests.filter((item) => item !== interest),
      }));
    } else if (updatedData.interests.length < 3) {
      setUpdatedData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    } else {
      Alert.alert("Limit Reached", "You can only select up to 3 interests.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Send updated data to the server
      const response = await axios.post(
        "https://roamlyservice.onrender.com/update-profile",
        updatedData
      );
      Alert.alert("Success", "Profile updated successfully!");
      setUserData(updatedData); // Update the local userData
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleSaveBilling = async () => {
    try {
      // Send billing information to the server
      const response = await axios.post(
        "https://roamlyservice.onrender.com/update-billing",
        billingInfo
      );
      Alert.alert("Success", "Billing information updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update billing information.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Headline style={styles.headline}>Your Profile</Headline>
        <Divider style={styles.divider} />

        {/* User Info */}
        <TextInput
          label="Name"
          value={updatedData.name}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, name: text })
          }
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={updatedData.email}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, email: text })
          }
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
        />

        {/* Country Picker */}
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          withCountryNameButton
          withAlphaFilter
          onSelect={(country) => {
            setUpdatedData({ ...updatedData, country: country.name });
            setCountryCode(country.cca2);
          }}
        />
        <Text style={styles.selectedCountryText}>
          Selected Country: {updatedData.country}
        </Text>

        <TextInput
          label="Age"
          value={updatedData.age}
          onChangeText={(text) => setUpdatedData({ ...updatedData, age: text })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        {/* Interests */}
        <Text style={styles.sectionTitle}>Your Interests (up to 3)</Text>
        <View style={styles.interestsContainer}>
          {interestsList.map((interest) => (
            <Button
              key={interest}
              mode={
                updatedData.interests.includes(interest)
                  ? "contained"
                  : "outlined"
              }
              style={styles.interestButton}
              onPress={() => handleInterestSelection(interest)}
            >
              {interest}
            </Button>
          ))}
        </View>

        {/* Billing Info */}
        <Text style={styles.sectionTitle}>Billing Information</Text>
        <TextInput
          label="Card Number"
          value={billingInfo.cardNumber}
          onChangeText={(text) =>
            setBillingInfo({ ...billingInfo, cardNumber: text })
          }
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Expiry Date (MM/YY)"
          value={billingInfo.expiryDate}
          onChangeText={(text) =>
            setBillingInfo({ ...billingInfo, expiryDate: text })
          }
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="CVV"
          value={billingInfo.cvv}
          onChangeText={(text) => setBillingInfo({ ...billingInfo, cvv: text })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSaveChanges}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Save Changes
        </Button>

        <Button
          mode="outlined"
          onPress={handleSaveBilling}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Save Billing Info
        </Button>
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
  selectedCountryText: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});

export default Profile;
