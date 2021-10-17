import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const registerForPushNotificationsAsync = async () => {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			return {
				status: 400,
				message: 'Failed to get push token for push notification!',
				token: null,
			};
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		return {
			status: 400,
			message: 'Must use physical device for Push Notifications',
			token: null,
		};
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return { status: 200, message: 'success', token };
};
