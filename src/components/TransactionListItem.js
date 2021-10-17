import React from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectUser } from "../redux/slices/userSlice";
import { formatNumber } from "../utils/common";

const TransactionListItem = ({ trans }) => {
	const navigation = useNavigation(),
		user = useSelector(selectUser);    
	return (
		<View style={tw`flex-row items-center p-2 py-4 my-1 bg-white`}>
			<Text style={tw`absolute top-0 left-2 text-sm text-gray-400`}>
				{moment(trans?.timestamp?._seconds * 1000)?.format("DD/M/YY, h:mm A")}
			</Text>
			<Text numberOfLines={1} style={tw`text-lg w-52 mx-2 font-semibold`}>
				{trans?.desc || "No Description"}
			</Text>
			<Text
				numberOfLines={1}
				style={tw`absolute bottom-0 left-2 w-52 text-sm text-gray-400`}
			>
				{`By: ${trans?.by === user?.name ? "You" : trans?.by}`}
			</Text>
			<TouchableOpacity
				onPress={() => {
					trans.receipt &&
						navigation.navigate("Receipt", { uri: trans?.receipt });
				}}
				style={tw`w-16`}
			>
				<Text>
					{trans.receipt && (
						<Icon size={30} type="material" name="receipt-long" />
					)}
				</Text>
			</TouchableOpacity>
			{trans.amount !== 0 && (
				<View style={tw`items-center`}>
					<Text
						style={tw`text-xl ${
							trans?.amount < 0 ? "text-red-700" : "text-green-700"
						}`}
					>
						{formatNumber(Math.abs(trans?.amount))}
					</Text>
					<Text style={tw`text-gray-400`}>
						{trans?.amount < 0 ? "You Gave" : "You Got"}
					</Text>
				</View>
			)}
		</View>
	);
};

export default TransactionListItem;
