import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import AuthScreen from '../screens/AuthScreen';

const AuthStack = () => {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen name='Auth' component={AuthScreen} />
		</Stack.Navigator>
	);
};

export default AuthStack;