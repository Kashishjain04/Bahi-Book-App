import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Avatar } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { formatNumber } from "../utils/common";

const CustomerListItem = ({ customer }) => {
  const navigation = useNavigation(),
    [active, setActive] = useState(false);
  return (
    <Pressable
      activeOpacity={0.7}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      onPress={() =>
        navigation.navigate("Customer", {
          customerId: customer?.id,
          customerName: customer?.name,
        })
      }
      style={tw`flex-row items-center p-2 py-4 ${active && "bg-gray-300"}`}
    >
      <>
        <View style={tw`bg-gray-500 shadow-md mr-4 rounded-full`}>
          <Avatar
            rounded
            title={customer?.name?.[0]?.toUpperCase()}
            size={50}
            titleStyle={tw`text-white`}
          />
        </View>
        <Text style={tw`text-lg font-semibold`}>{customer?.name}</Text>
        {customer?.balance !== 0 && (
          <View style={tw`ml-auto items-center mr-2`}>
            <Text
              style={tw`text-lg ${
                customer?.balance < 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {formatNumber(Math.abs(customer?.balance))}
            </Text>
            <Text style={tw`text-gray-400`}>
              {customer?.balance < 0 ? "You will get" : "You will give"}
            </Text>
          </View>
        )}
      </>
    </Pressable>
  );
};

export default CustomerListItem;
