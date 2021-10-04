import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Modal,
	TextInput,
	// Button,
	Alert,
	TouchableOpacity,
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import * as ImagePicker from 'expo-image-picker';

const AddTransactionModal = ({
	visible,
	setVisible,
	fun,
	loading,
	setLoading,
	amt,
	setAmt,
	desc,
	setDesc,
	settling,
	setSettling,
}) => {
	const ref1 = useRef(null),
		ref2 = useRef(null),
		// [desc, setDesc] = useState(""),
		// [amt, setAmt] = useState(null),
		[image, setImage] = useState('');

	useEffect(() => {
		setLoading(true);
		return setLoading(false);
	}, []);

	const submitHandler = (isGiving) => {
		if (!amt || !desc) {
			return Alert.alert('All the fields are required');
		}
		if (amt < 1) {
			return Alert.alert('Amount must be grater than 0');
		}
		fun(isGiving, Number(amt), desc, image);
	};

	const pickImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permission.granted) {
			return Alert.alert('Permission to access camera roll is required');
		}
		const res = await ImagePicker.launchImageLibraryAsync({
			base64: true,
			quality: 0.5,
			allowsEditing: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		});
		setImage('data:image/jpg;base64,' + res?.base64 || null);
	};

	return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={visible}
			onRequestClose={() => {
				setAmt(null);
				setDesc('');
				setSettling(0);
				setVisible(false);
			}}
		>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => {
					setAmt(null);
					setDesc('');
					setSettling(0);
					setVisible(false);
				}}
				style={[
					tw`h-full w-full absolute justify-center items-center`,
					{ backgroundColor: 'rgba(0,0,0,0.6)' },
				]}
			>
				<TouchableOpacity
					onPress={null}
					activeOpacity={1}
					style={tw`w-11/12 rounded-lg bg-white`}
				>
					<TouchableOpacity
						style={tw`absolute right-4 top-4 z-10`}
						onPress={() => {
							setAmt(null);
							setDesc('');
							setSettling(0);
							setVisible(false);
						}}
					>
						<Text style={tw`text-black`}>
							<Icon type='feather' name='x' />
						</Text>
					</TouchableOpacity>
					<Text
						style={tw`border-b border-gray-300 mb-2 p-2 py-4 text-center text-xl font-semibold`}
					>
						Add Transaction
					</Text>
					<TextInput
						style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
						ref={ref1}
						placeholder='Amount'
						keyboardType='numeric'
						returnKeyType='next'
						value={amt?.toString() || ''}
						onChangeText={(text) => setAmt(Number(text))}
						onSubmitEditing={() => {
							ref2.current.focus();
						}}
						blurOnSubmit={false}
					/>
					<TextInput
						style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
						ref={ref2}
						placeholder='Description'
						value={desc}
						onChangeText={(text) => setDesc(text)}
					/>
					<View style={tw`mx-4 my-2`}>
						<Button
							onPress={pickImage}
							title='Add Receipt'
							containerStyle={tw`rounded-full`}
						/>
					</View>
					<View style={tw`flex-row items-center mx-2 mb-2`}>
						{settling > 0 ? (
							<View style={tw`p-2 w-full`}>
								<Button
									loading={loading}
									onPress={() => submitHandler(settling === 2)}
									title='Settle Up'
									titleStyle={tw`text-green-700`}
									containerStyle={tw`border border-gray-400 rounded-full`}
									type='clear'
								/>
							</View>
						) : (
							<>
								<View style={tw`p-2 w-1/2`}>
									<Button
										loading={loading}
										onPress={() => submitHandler(true)}
										title='You Gave'
										titleStyle={tw`text-red-700`}
										containerStyle={tw`border border-gray-400 rounded-full`}
										type='clear'
									/>
								</View>
								<View style={tw`p-2 w-1/2`}>
									<Button
										loading={loading}
										onPress={() => submitHandler(false)}
										title='You Got'
										titleStyle={tw`text-green-700`}
										containerStyle={tw`border border-gray-400 rounded-full`}
										type='clear'
									/>
								</View>
							</>
						)}
					</View>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
};

export default AddTransactionModal;
