import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, Alert, Platform } from "react-native";
import { FAB } from "react-native-elements";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerListItem from "../components/CustomerListItem";
import Dashboard from "../components/Dashboard";
import Loader from "../components/Loader";
import { selectUser } from "../redux/slices/userSlice";
import { API_BASE_URL } from "@env";
import { io } from "socket.io-client";
import { registerForPushNotificationsAsync } from "../utils/notifications";

const HomeScreen = () => {
	const user = useSelector(selectUser),
		[userDoc, setUserDoc] = useState(null),
		[customers, setCustomers] = useState([]),
		[loading, setLoading] = useState(false),
		[listLoading, setListLoading] = useState(true),
		[modalVisible, setModalVisible] = useState(false);

	// push notifications
	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((res) => {
				if (res.status === 200) {
					fetch(`${API_BASE_URL}/api/updateUser`, {
						method: "POST",
						body: JSON.stringify({
							user: { ...user, tokenType: "expoPushToken", token: res.token },
						}),
						headers: { "Content-Type": "application/json" },
						crossDomain: true,
					}).catch((err) => console.log(err));
				} else console.log(res.message);
			})
			.catch((err) => console.log(err));
	}, []);

	const loadData = () => {
		const socket = io(API_BASE_URL);

		socket.emit("userDoc", { user }, (err) => {
			console.log(err);
		});
		socket.emit("customersCol", { user }, (err) => {
			console.log(err);
		});

		socket.on("userDoc", ({ data }) => {
			setLoading(true);
			setUserDoc(data);
			setLoading(false);
			setListLoading(false);
		});
		socket.on("customersCol", ({ data }) => {
			setLoading(true);
			setCustomers(data);
			setLoading(false);
			setListLoading(false);
		});

		return socket;
	};

	useEffect(() => {
		const socket = loadData();

		return () => {
			setLoading(true);
			setCustomers([]);
			socket.off();
		};
	}, [user]);

	const addCustomer = (id, name) => {
		if (id && name) {
			setLoading(true);
			if (id === user?.email) {
				setLoading(false);
				Alert.alert("Can't add yourself as your friend!!");
				return;
			}
			fetch(`${API_BASE_URL}/api/addCustomer`, {
				method: "POST",
				body: JSON.stringify({
					user,
					id,
					name,
				}),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				crossDomain: true,
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.error) {
						Alert.alert(res.error || "Something went wrong");
					} else {
						Alert.alert("Friend added successfully");
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setModalVisible(false);
					setLoading(false);
				});
		}
	};

	return (
		<SafeAreaView style={tw`flex-grow h-full bg-white`}>
			{loading && <Loader />}
			{modalVisible && (
				<AddCustomerModal
					loading={loading}
					fun={addCustomer}
					visible={modalVisible}
					setVisible={setModalVisible}
				/>
			)}
			<StatusBar style="light" />
			<FAB
				onPress={() => setModalVisible(true)}
				title="Add Friend"
				color="rgb(153,27,27)"
				style={tw`z-10`}
				placement="right"
			/>
			<FlatList
				refreshing={listLoading}
				onRefresh={() => {
					setListLoading(true);
					loadData();
				}}
				ListEmptyComponent={() => (
					<View style={tw`flex flex-col h-64 justify-center`}>
						<Text style={tw`text-gray-500 text-center text-2xl mb-3`}>
							You don't have any Friend
						</Text>
						<Text style={tw`text-gray-500 text-center text-2xl`}>
							Press <Text style={tw`text-red-700`}>Add Friend</Text> to add one
						</Text>
					</View>
				)}
				ListHeaderComponent={() => (
					<View>
						<Dashboard
							data={{
								sent: userDoc?.sent || 0,
								received: userDoc?.received || 0,
							}}
						/>
					</View>
				)}
				ItemSeparatorComponent={() => (
					<View style={[tw`w-full bg-gray-300`, { height: 1 }]} />
				)}
				ListFooterComponent={() => <View />}
				overScrollMode="never"
				ListHeaderComponentStyle={tw`mb-2`}
				showsVerticalScrollIndicator={false}
				ListFooterComponentStyle={Platform.OS === "ios" ? tw`my-7` : tw`my-9`}
				data={customers}
				keyExtractor={(_, index) => index.toLocaleString()}
				renderItem={({ item }) => <CustomerListItem customer={item} />}
			/>
		</SafeAreaView>
	);
};

export default HomeScreen;
