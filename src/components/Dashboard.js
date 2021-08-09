import React from "react";
import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import "intl";
import "intl/locale-data/jsonp/en";
import { formatNumber } from "../utils/common";

const Dashboard = ({ data }) => {
  return (
    <View style={tw`h-36`}>
      <View style={tw`bg-red-800 h-24`}></View>
      <View
        style={tw`bg-white w-11/12 self-center mt-5 rounded-lg shadow-lg absolute`}
      >
        <View style={tw`flex-row justify-evenly border-b border-gray-300`}>
          <View style={tw`py-2`}>
            <Text style={tw`text-xl text-green-700`}>
              {formatNumber(data.received)}
            </Text>
            <Text style={tw`text-center text-gray-400`}>You Got</Text>
          </View>
          <View style={tw`border-r border-gray-300`}></View>
          <View style={tw`py-2`}>
            <Text style={tw`text-xl text-red-700`}>
              {formatNumber(data.sent)}
            </Text>
            <Text style={tw`text-center text-gray-400`}>You Gave</Text>
          </View>
        </View>
        <View>
          <View style={tw`py-2 items-center`}>
            <Text
              style={tw`text-xl ${
                data.sent < data.received ? "text-red-700" : "text-green-700"
              }`}
            >
              {formatNumber(Math.abs(data.sent - data.received))}
            </Text>
            <Text style={tw`text-center text-gray-400`}>
              {data.sent === data.received
                ? "You are all settled up"
                : data.sent > data.received
                ? "You will get"
                : "You will give"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
