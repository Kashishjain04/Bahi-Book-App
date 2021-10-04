import React from 'react';
import { Image, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {
	ANDROID_OAUTH_KEY,
	IOS_OAUTH_KEY,
	ANDROID_OAUTH_KEY_LOCAL,
	API_BASE_URL,
} from '@env';
import * as Google from 'expo-google-app-auth';
import firebase from '../firebase';
import { SocialIcon } from 'react-native-elements';
import Loader from '../components/Loader';

const auth = firebase.auth,
	googleProvider = new auth.GoogleAuthProvider();

const AuthScreen = () => {
	const [loading, setLoading] = React.useState(false);
	const googleLogin = async () => {
		setLoading(true);
		try {
			const res = await Google.logInAsync({
				androidStandaloneAppClientId: ANDROID_OAUTH_KEY,
				androidClientId: ANDROID_OAUTH_KEY_LOCAL,
				iosClientId: IOS_OAUTH_KEY,
				scopes: ['profile', 'email'],
			});
			if (res.type === 'success') {
				const cred = googleProvider.credential(res.idToken, res.accessToken);
				auth()
					.signInWithCredential(cred)
					.then(({ additionalUserInfo }) => {
						if (additionalUserInfo?.isNewUser) {
							fetch(`${API_BASE_URL}/api/createUser`, {
								method: 'POST',
								body: JSON.stringify(additionalUserInfo?.profile),
								headers: { 'Content-Type': 'application/json' },
								crossDomain: true,
							}).catch((err) => console.log(err));
						} else {
							fetch(`${API_BASE_URL}/api/updateUser`, {
								method: 'POST',
								body: JSON.stringify({user: additionalUserInfo?.profile}),
								headers: { 'Content-Type': 'application/json' },
								crossDomain: true,
							}).catch((err) => console.log(err));
						}
					})
					.catch((err) => console.log(err))
					.finally(() => setLoading(false));
			} else {
				setLoading(false);
				console.log(res);
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	return (
		<View style={tw`flex-1 items-center justify-center`}>
			<Image
				loadingIndicatorSource={<Loader />}
				style={tw`w-full h-96 -mt-44`}
				source={{
					uri: 'https://firebasestorage.googleapis.com/v0/b/bahi-book.appspot.com/o/icon.png?alt=media&token=13344b24-3410-4047-957a-e6447432c4e7',
				}}
			/>
			<SocialIcon
				disabled={loading}
				onPress={googleLogin}
				title='Sign In With Google'
				button
				loading={loading}
				style={tw`pl-10 ${loading ? 'pr-5' : 'pr-10'}`}
				type='google'
			/>
		</View>
	);
};

export default AuthScreen;
