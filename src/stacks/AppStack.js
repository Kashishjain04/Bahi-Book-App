import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import {
	createStackNavigator,
	CardStyleInterpolators,
} from '@react-navigation/stack';
import tw from 'tailwind-react-native-classnames';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/userSlice';
import { API_BASE_URL } from '@env';
import HomeScreen from '../screens/HomeScreen';
import CustomerScreen from '../screens/CustomerScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import firebase from '../firebase';

const auth = firebase.auth;

const AppStack = () => {
	const Stack = createStackNavigator(),
		navigation = useNavigation(),
		user = useSelector(selectUser),
		notificationListener = useRef(null),
		responseListener = useRef(null);

	const logoutHandler = () => {
		Alert.alert(
			'Are you sure want to Logout?', // title
			'', // message
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{ text: 'OK', onPress: () => auth().signOut() },
			] // buttons
		);
	};

	useEffect(() => {
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log(notification);
			});
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				({ notification }) => {
					const notifData = notification.request.content.data;
					fetch(`${API_BASE_URL}/api/getCustomerDoc`, {
						method: 'POST',
						body: JSON.stringify({ user, custId: notifData.friendId }),
						crossDomain: true,
						headers: { 'Content-Type': 'application/json' },
					})
						.then((res) => res.json())
						.then((res) => {
							if (res.message === 'success') {
								navigation.navigate('Customer', {
									customerId: notifData.friendId,
									customerName: res.data.name,
								});
							} else {
								console.log(res.error || 'Invalid error');
							}
						})
						.catch((err) => console.log(err))
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	return (
		<Stack.Navigator
			screenOptions={{
				gestureEnabled: true,
				headerBackTitle: "back",
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				gestureResponseDistance: 150,
				headerStyle: [
					tw`bg-red-800`,
					{
						elevation: 0,
						shadowOffset: { width: 0, height: 0 },
					},
				],
				headerTitleStyle: tw`text-white`,
				headerTitleAlign: 'left',
			}}
		>
			<Stack.Screen
				options={{
					headerTitleAlign: 'center',
					headerRight: () => (
						<Text style={tw`mr-4 text-white`}>
							<Icon
								onPress={logoutHandler}
								type='material'
								name='logout'
								size={25}
								color='#fff'
							/>
						</Text>
					),
				}}
				name='Home'
				component={HomeScreen}
			/>
			<Stack.Screen name='Customer' component={CustomerScreen} />
			<Stack.Screen name='Receipt' component={ReceiptScreen} />
		</Stack.Navigator>
	);
};

export default AppStack;
