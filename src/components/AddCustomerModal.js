import React, { useRef, useState } from 'react';
import {
	View,
	Text,
	Modal,
	TextInput,
	Alert,
	TouchableOpacity,
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';

const AddCustomerModal = ({ visible, setVisible, fun, loading }) => {
	const [id, setId] = useState(''),
		[name, setName] = useState(''),
		ref1 = useRef(null),
		ref2 = useRef(null);

	const submitHandler = () => {
		if (id === '' || name === '') {
			return Alert.alert('All the fields are required');
		}
		fun(id.toLowerCase(), name);
	};
	return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={visible}
			onRequestClose={() => setVisible(false)}
		>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => setVisible(false)}
				style={[
					tw`h-full w-full absolute justify-center items-center`,
					{ backgroundColor: 'rgba(0,0,0,0.6)' },
				]}
			>
				<TouchableOpacity
					onPress={null}
					activeOpacity={1}
					style={tw`w-11/12 rounded-lg bg-white z-20`}
				>
					<TouchableOpacity
						style={tw`absolute right-4 top-4 z-10`}
						onPress={() => setVisible(false)}
					>
						<Text style={tw`text-black`}>
							<Icon type='feather' name='x' />
						</Text>
					</TouchableOpacity>
					<Text
						style={tw`border-b border-gray-300 mb-2 p-2 py-4 text-center text-xl font-semibold`}
					>
						Add Friend
					</Text>
					<TextInput
						style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
						ref={ref1}
						placeholder="Friend's Email-Id"
						keyboardType='email-address'
						textContentType='emailAddress'
						returnKeyType='next'
						value={id}
						onChangeText={(text) => setId(text)}
						onSubmitEditing={() => {
							ref2.current.focus();
						}}
						blurOnSubmit={false}
					/>
					<TextInput
						style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
						ref={ref2}
						placeholder="Friend's Name"
						textContentType='name'
						returnKeyType='send'
						value={name}
						onChangeText={(text) => setName(text)}
						onSubmitEditing={submitHandler}
					/>
					<View style={tw`mx-4 my-2 mb-4`}>
						<Button
							onPress={submitHandler}
							title='Submit'
							containerStyle={tw`border border-gray-400 rounded-full`}
							type='clear'
							loading={loading}
						/>
					</View>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
};

export default AddCustomerModal;
