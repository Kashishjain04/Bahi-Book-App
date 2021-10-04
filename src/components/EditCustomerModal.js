import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';

const EditCustomerModal = ({
	visible,
	setVisible,
	fun,
	loading,
	setLoading,
}) => {
	const [name, setName] = useState('');

	useEffect(() => {
		setLoading(true);
		return setLoading(false);
	}, []);

	const submitHandler = () => {
		fun(name);
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
					style={tw`w-11/12 pb-4 rounded-lg bg-white`}
				>
					<TouchableOpacity
						style={tw`absolute right-4 top-4 z-10`}
						onPress={() => setVisible(false)}
					>
						<Text style={tw`text-black`}>
							<Icon type='feather' name='x' />
						</Text>
					</TouchableOpacity>
					<Text style={tw`mb-2 p-2 py-4 text-center text-xl font-semibold`}>
						Edit Name
					</Text>
					<TextInput
						style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
						autoFocus={true}
						placeholder='Name'
						keyboardType='default'
						returnKeyType='send'
						value={name}
						onChangeText={(text) => setName(text)}
						onSubmitEditing={submitHandler}
						blurOnSubmit={false}
					/>
					<View style={tw`mx-4 my-2`}>
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

export default EditCustomerModal;
