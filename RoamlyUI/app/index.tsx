import { View } from "react-native";
import { Link } from "expo-router";
import { Redirect } from "expo-router";

export default function Page() {
  return <Redirect href="/details" />;
}
