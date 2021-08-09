import React from "react";
import { View, ActivityIndicator } from "react-native";
import tw from "tailwind-react-native-classnames";

const Loader = () => (
  <View
    style={[
      tw`h-full w-full absolute z-50 justify-center`,
      { backgroundColor: "rgba(0,0,0,0.7)" },
    ]}
  >
    <ActivityIndicator
      size={Platform.OS === "android" ? 75 : "large"}
      color="#c53030"
    />
  </View>
);

export default Loader;
