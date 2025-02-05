import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text as NativeText,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from "react-native";
import AppBar from "../components/AppBar";
import ReactLogoPng from "../assets/images/react-logo.png";
import { usePropertyStore } from "@/stores/Property_Store";
import { useUserStore } from "@/stores/user_store";
import { useLocalSearchParams } from "expo-router";
const textContent =
  "The Hollywood Sign, perched atop Mount Lee in the Hollywood Hills of Los Angeles, is an iconic symbol of the entertainment industry. Originally erected in 1923 as Hollywoodland to advertise a real estate development, the sign has since become synonymous with the glitz and glamour of Hollywood. Standing 45 feet tall and stretching 350 feet wide, it offers sweeping views of the city and serves as a cultural landmark, drawing visitors from around the world. Over the decades, the sign has been restored and preserved, cementing its status as a beacon of ambition and creativity.";

const imageUri =
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Hollywood_Sign_%28Zuschnitt%29.jpg"; // Example Hollywood Sign image URL

export default function Details({ navigation }) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const { landmarkName } = useLocalSearchParams<{
    landmarkName: string;
  }>();
  console.log(landmarkName);
  const property = usePropertyStore((state) => state.properties[landmarkName]);
  const userInfo = useUserStore((state) => state.userInfo);
  console.log(property);
  const words = textContent.split(" ");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (property && property.responses) {
      // Convert responses into a Record<string, any>
      const responsesRecord = Object.entries(property.responses).reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {}
      );
      const trimmedLandmarkName = landmarkName.replace(" ", "");
      const trimmedCountryName = userInfo.country.replace(" ", "");

      let ageRange = "";

      if (Number(userInfo.age) < 25) {
        ageRange = "young";
      } else if (Number(userInfo.age) > 25 && Number(userInfo.age) < 60) {
        ageRange = "medium";
      } else {
        ageRange = "old";
      }
      const constructedKey = `${trimmedLandmarkName}_${userInfo.interestOne}_${userInfo.interestTwo}_${userInfo.interestThree}_${trimmedCountryName}_${userInfo.language}_${ageRange}_small`;
      console.log(constructedKey);
      // Open JSON file with the same name as the constructedKey from property.response
      console.log("responsesRecord is \n");
      console.log(responsesRecord);
      const response = responsesRecord[constructedKey];
      console.log("printing out selected response");
      console.log(response);
    }
  }, [property]);

  return (
    <View style={styles.container}>
      <AppBar title="Details" navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Image Section */}
        <Image source={ReactLogoPng} style={styles.image} />

        {/* Text Section */}
        <View style={styles.textContainer}>
          {words.map((word, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handleWordPress(index)}
            >
              <NativeText
                style={[
                  styles.word,
                  index === highlightedIndex && styles.highlightedWord,
                ]}
              >
                {word + " "}
              </NativeText>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f9", // Light background
  },
  scrollViewContent: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  word: {
    fontSize: 18,
    marginHorizontal: 4,
    marginVertical: 6,
    color: "#333",
    textAlign: "center",
  },
  highlightedWord: {
    backgroundColor: "#FFD700", // Golden yellow
    color: "#333",
    fontWeight: "600",
    borderRadius: 5,
    paddingHorizontal: 4,
  },
});
