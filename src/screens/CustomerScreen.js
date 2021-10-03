import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/userSlice';
import Dashboard from '../components/Dashboard';
import { useNavigation } from '@react-navigation/native';
import { Avatar, FAB } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import TransactionListItem from '../components/TransactionListItem';
import Loader from '../components/Loader';
import AddButton from '../components/AddButton';
import AddTransactionModal from '../components/AddTransactionModal';
import { API_BASE_URL } from '@env';
import { io } from 'socket.io-client';

const CustomerScreen = ({ route }) => {
	const { customerId, customerName } = route?.params,
		navigation = useNavigation(),
		user = useSelector(selectUser),
		[trans, setTrans] = useState([]),
		[gave, setGave] = useState(0),
		[got, setGot] = useState(0),
		[loading, setLoading] = useState(true),
		[modalVisible, setModalVisible] = useState(false),
		[transDesc, setTransDesc] = useState(0),
		[transAmount, setTransAmount] = useState(0);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			title: customerName || 'Name',
			headerStyle: [tw`bg-red-800`, { elevation: 10 }],
			headerLeft: () => (
				<View style={tw`bg-gray-500 shadow-md ml-4 rounded-full`}>
					<Avatar
						rounded
						title={customerName?.[0]?.toUpperCase() || 'N'}
						size={35}
						titleStyle={tw`text-white`}
					/>
				</View>
			),
		});
	}, [customerId]);

	useEffect(() => {
		const socket = io(API_BASE_URL);

		// socket.emit("custDoc", {user, custId: customerId}, (err) => console.log(err));
		socket.emit('transactionsCol', { user, custId: customerId }, (err) =>
			console.log(err)
		);

		// socket.on("custDoc", ({data}) => {
		//   if (data) {
		//     setName(data?.name);
		//   } else {
		//     setExist(false);
		//   }
		// })

		socket.on('transactionsCol', ({ data }) => {
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

	const addTransaction = (isGiving, amount, desc, url = '') => {
		setLoading(true);
		fetch(`${API_BASE_URL}/api/addTransaction`, {
			method: 'POST',
			body: JSON.stringify({
				user,
				customerId,
				amount,
				desc,
				url,
				isGiving,
			}),
			crossDomain: true,
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					Alert.alert(res.error || 'Something went wrong');
				} else {
					Alert.alert('Transaction added successfully');
				}
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setModalVisible(false);
				setLoading(false);
			});
	};

	return (
		<SafeAreaView style={tw`h-full`}>
			{loading && <Loader />}
			{modalVisible && (
				<AddTransactionModal
					fun={addTransaction}
					visible={modalVisible}
					setVisible={setModalVisible}
					setLoading={setLoading}
					amt={transAmount}
					setAmt={setTransAmount}
					desc={transDesc}
					setDesc={setTransDesc}
				/>
			)}
			<FAB
				onPress={() => setModalVisible(true)}
				title='Add Transaction'
				color='rgb(153,27,27)'
				style={tw`z-10`}
				placement='right'
			/>
			<FlatList
				ListHeaderComponent={() => (
					<View>
						<Dashboard data={{ sent: gave || 0, received: got || 0 }} />
						{gave !== got && (
							<AddButton
								text='Settle Up'
								onPress={() => {
									setTransAmount(Math.abs(gave - got));
									setTransDesc(
										`${gave > got ? 'Gave' : 'Got'}: ₹${Math.abs(gave - got)}`
									);
									setModalVisible(true);
								}}
							/>
						)}
					</View>
				)}
				ListHeaderComponentStyle={tw`mb-4`}
				ItemSeparatorComponent={() => (
					<View style={[tw`w-full bg-gray-300`, { height: 1 }]}></View>
				)}
				showsVerticalScrollIndicator={false}
				data={trans}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item }) => <TransactionListItem trans={item} />}
			/>
		</SafeAreaView>
	);
};

export default CustomerScreen;
