import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const AddButton = ({ text, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`bg-green-500 rounded-lg w-11/12 mx-auto p-1 mt-4 items-center justify-center flex-row shadow-lg`,
        style,
      ]}
    >
      <Icon
        name="checkbox-marked-circle-outline"
        type="material-community"
        size={40}
        style={tw`mx-2`}
        color="#fff"
      />
      <Text style={tw`text-xl mx-2 text-white font-semibold`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default AddButton;
