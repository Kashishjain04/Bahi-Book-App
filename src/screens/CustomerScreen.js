import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, SafeAreaView, Alert } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import { Avatar, FAB } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import Loader from "../components/Loader";
import AddTransactionModal from "../components/AddTransactionModal";
import { API_BASE_URL } from "@env";
import { io } from "socket.io-client";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditCustomerModal from "../components/EditCustomerModal";
import TransactionsList from "../components/TransactionsList";

const CustomerScreen = ({ route }) => {
	const { customerId, customerName } = route?.params,
		[custName, setCustName] = useState(customerName),
		navigation = useNavigation(),
		user = useSelector(selectUser),
		[trans, setTrans] = useState([]),
		[gave, setGave] = useState(0),
		[got, setGot] = useState(0),
		[loading, setLoading] = useState(true),
		[editModal, setEditModal] = useState(false);

	// For Add Transaction Modal
	const [modalVisible, setModalVisible] = useState(false),
		[transDesc, setTransDesc] = useState(""),
		[transAmount, setTransAmount] = useState(""),
		[settling, setSettling] = useState(0);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			title: custName || "Name",
			headerStyle: [tw`bg-red-800`, { elevation: 10 }],
			headerLeft: () => (
				<View style={tw`bg-gray-500 shadow-md ml-4 rounded-full`}>
					<Avatar
						rounded
						title={custName?.[0]?.toUpperCase() || "N"}
						size={35}
						titleStyle={tw`text-white`}
					/>
				</View>
			),
			headerRight: () => (
				<TouchableOpacity
					onPress={() => setEditModal(true)}
					activeOpacity={0.5}
					style={tw`mr-4`}
				>
					<Icon type="material" name="edit" size={25} color="#fff" />
				</TouchableOpacity>
			),
		});
	}, [customerId, custName]);

	const fetchTransactions = () => {
		const socket = io(API_BASE_URL);

		// socket.emit("custDoc", {user, custId: customerId}, (err) => console.log(err));
		socket.emit("transactionsCol", { user, custId: customerId }, (err) =>
			console.log(err)
		);
		return socket;
	};

	useEffect(() => {
		const socket = fetchTransactions();
		// socket.on("custDoc", ({data}) => {
		//   if (data) {
		//     setName(data?.name);
		//   } else {
		//     setExist(false);
		//   }
		// })

		socket.on("transactionsCol", ({ data }) => {
			setLoading(true);
			setTrans(data?.transactions || []);
			setGot(data?.received || 0);
			setGave(data?.sent || 0);
			setLoading(false);
		});

		return () => {
			setTrans([]);
			setLoading(true);
			socket.off();
		};
	}, [user, customerId]);

	useEffect(() => {
		let tGave = 0,
			tGot = 0;
		trans.forEach((t) => {
			if (t.amount < 0) tGave -= t.amount;
			else tGot += t.amount;
		});
		setGave(tGave);
		setGot(tGot);
	}, [trans]);

	const addTransaction = (isGiving, amount, desc, url = "", fileType = "") => {
		setLoading(true);
		fetch(`${API_BASE_URL}/api/addTransaction`, {
			method: "POST",
			body: JSON.stringify({
				user,
				customerId,
				amount,
				desc,
				url,
				fileType,
				isGiving,
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
			.catch((err) => console.log(err))
			.finally(() => {
				setModalVisible(false);
				setTransAmount("");
				setTransDesc("");
				setSettling(0);
				setLoading(false);
			});
	};

	const editCustomerHandler = (name) => {
		setLoading(true);
		if (name === custName) {
			setLoading(false);
			return Alert.alert("No changes made");
		}
		fetch(`${API_BASE_URL}/api/editCustomer`, {
			method: "POST",
			body: JSON.stringify({
				user,
				name,
				custId: customerId,
			}),
			crossDomain: true,
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					Alert.alert(res.error || "Something went wrong");
				} else {
					setCustName(name);
					setEditModal(false);
				}
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<SafeAreaView style={tw`h-full bg-white`}>
			{loading && <Loader />}
			{editModal && (
				<EditCustomerModal
					visible={editModal}
					setVisible={setEditModal}
					loading={loading}
					setLoading={setLoading}
					fun={editCustomerHandler}
				/>
			)}
			{modalVisible && (
				<AddTransactionModal
					fun={addTransaction}
					visible={modalVisible}
					setVisible={setModalVisible}
					loading={loading}
					setLoading={setLoading}
					amt={transAmount}
					setAmt={setTransAmount}
					desc={transDesc}
					setDesc={setTransDesc}
					settling={settling}
					setSettling={setSettling}
				/>
			)}
			<FAB
				onPress={() => setModalVisible(true)}
				title="Add Transaction"
				color="rgb(153,27,27)"
				style={tw`z-10`}
				placement="right"
			/>
			<TransactionsList
				trans={trans}
				gave={gave}
				got={got}
				custId={customerId}
				custName={custName}
				setLoading={setLoading}
				setModalVisible={setModalVisible}
				setTransAmount={setTransAmount}
				setTransDesc={setTransDesc}
				setSettling={setSettling}
			/>
		</SafeAreaView>
	);
};

export default CustomerScreen;
