import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const AddButton = ({ fun, text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-white rounded-lg w-11/12 mx-auto p-1 mt-4 items-center justify-center flex-row shadow-lg`}
    >
      <Icon name="plus" type="feather" size={40} style={tw`mx-2`} />
      <Text style={tw`text-xl mx-2`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default AddButton;
