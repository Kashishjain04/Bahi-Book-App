import 'react-native-gesture-handler';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RenderStack from './src/stacks/RenderStack';

// ignore firebase set timer messages
import { LogBox } from 'react-native';
import _ from 'lodash';
LogBox?.ignoreLogs(['Setting a timer']);
const _console = _.clone(console);
console.warn = (message) => {
	if (message.indexOf('Setting a timer') <= -1) {
		_console.warn(message);
	}
};
// end ignore

export default function App() {		
	return (
		<Provider store={store}>
			<NavigationContainer>
				<SafeAreaProvider>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
						style={{ flex: 1 }}
					>
						<RenderStack />
					</KeyboardAvoidingView>
				</SafeAreaProvider>
			</NavigationContainer>
		</Provider>
	);
}
