import React from "react";
import { View, Text, Alert } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import Dashboard from "../components/Dashboard";
import { Button } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import TransactionListItem from "../components/TransactionListItem";
import AddButton from "../components/AddButton";
import { API_BASE_URL } from "@env";
import { SwipeListView } from "react-native-swipe-list-view";
import { Platform } from "react-native";

const TransactionsList = ({
	trans,
	gave,
	got,
	custId,
	custName,
	setLoading,
	setModalVisible,
	setTransAmount,
	setTransDesc,
	setSettling,
}) => {
	const user = useSelector(selectUser);

	const deleteTransaction = (rowMap, transId) => {
		setLoading(true);
		try {
			rowMap[transId].closeRow();
		} catch (err) {}
		fetch(`${API_BASE_URL}/api/deleteTransaction`, {
			method: "POST",
			body: JSON.stringify({
				user,
				custId,
				transId,
			}),
			crossDomain: true,
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					Alert.alert(res.error || "Something went wrong");
				}
			})
			.catch((err) => {
				Alert.alert(err.message || "Something went wrong");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<SwipeListView
			removeClippedSubviews={true}
			extraData={trans}
			useFlatList={true}
			disableRightSwipe={true}
			leftOpenValue={0}
			rightOpenValue={-100}
			renderHiddenItem={(rowData, rowMap) => (
				<View style={tw`py-1 w-full flex flex-row justify-end`}>
					<Button
						onPress={() => deleteTransaction(rowMap, rowData.item.id)}
						title="Delete"
						icon={{ name: "delete", color: "white" }}
						buttonStyle={[
							tw`bg-red-700 rounded-md p-1`,
							{ width: 100, height: "100%" },
						]}
					/>
				</View>
			)}
			ListEmptyComponent={() => (
				<View style={tw`flex flex-col h-64 justify-center`}>
					<Text style={tw`text-gray-500 text-center text-2xl mb-3`}>
						You don't have any transaction with {custName}
					</Text>
					<Text style={tw`text-gray-500 text-center text-2xl`}>
						Press <Text style={tw`text-red-700`}>Add Transaction</Text> to add
						one
					</Text>
				</View>
			)}
			ListHeaderComponent={() => (
				<View>
					<Dashboard data={{ sent: gave || 0, received: got || 0 }} />
					{gave !== got && (
						<AddButton
							text="Settle Up"
							onPress={() => {
								setTransAmount(Math.abs(gave - got));
								setTransDesc("Automatic Settlement");
								setModalVisible(true);
								setSettling(gave > got ? 1 : 2);
							}}
						/>
					)}
				</View>
			)}
			ListHeaderComponentStyle={tw`mb-4`}
			ItemSeparatorComponent={() => (
				<View style={[tw`w-full bg-gray-300`, { height: 1 }]}></View>
			)}
			ListFooterComponent={() => <View />}
			showsVerticalScrollIndicator={false}
			ListFooterComponentStyle={Platform.OS === "ios" ? tw`my-7` : tw`my-9`}
			data={trans}
			keyExtractor={(trans) => trans.id}
			renderItem={({ item }) => <TransactionListItem trans={item} />}
		/>
	);
};

export default TransactionsList;
