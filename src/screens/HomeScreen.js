import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, View, Text, Alert } from 'react-native';
import { FAB } from 'react-native-elements';
import { useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
import AddButton from '../components/AddButton';
import AddCustomerModal from '../components/AddCustomerModal';
import CustomerListItem from '../components/CustomerListItem';
import Dashboard from '../components/Dashboard';
import Loader from '../components/Loader';
import { selectUser } from '../redux/slices/userSlice';
import { API_BASE_URL } from '@env';
import { io } from 'socket.io-client';

const HomeScreen = () => {
	const user = useSelector(selectUser),
		[userDoc, setUserDoc] = useState(null),
		[customers, setCustomers] = useState([]),
		[loading, setLoading] = useState(true),
		[modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		const socket = io(API_BASE_URL);

		socket.emit('userDoc', { user }, (err) => {
			console.log(err);
		});
		socket.emit('customersCol', { user }, (err) => {
			console.log(err);
		});

		socket.on('userDoc', ({ data }) => {
			setLoading(true);
			setUserDoc(data);
			setLoading(false);
		});
		socket.on('customersCol', ({ data }) => {
			setLoading(true);
			setCustomers(data);
			setLoading(false);
		});

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
				Alert.alert("Can't add yourself as a customer!!");
				return;
			}
			fetch(`${API_BASE_URL}/api/addCustomer`, {
				method: 'POST',
				body: JSON.stringify({
					user,
					id,
					name,
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				crossDomain: true,
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.error) {
						Alert.alert(res.error || 'Something went wrong');
					} else {
						Alert.alert('Customer added successfully');
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
		<SafeAreaView style={tw`flex-grow h-full`}>
			{loading && <Loader />}
			{modalVisible && (
				<AddCustomerModal
					fun={addCustomer}
					visible={modalVisible}
					setVisible={setModalVisible}
				/>
			)}
			<StatusBar style='light' />
			<FAB
				onPress={() => setModalVisible(true)}
				title='Add Customer'
				color='rgb(153,27,27)'
				style={tw`z-10`}
				placement='right'
			/>
			<FlatList
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
					<View style={[tw`w-full bg-gray-300`, { height: 1 }]}></View>
				)}
				overScrollMode='never'
				ListHeaderComponentStyle={tw`mb-2`}
				showsVerticalScrollIndicator={false}
				data={customers}
				keyExtractor={(_, index) => index.toLocaleString()}
				renderItem={({ item }) => <CustomerListItem customer={item} />}
			/>
		</SafeAreaView>
	);
};

export default HomeScreen;
