import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const AddCustomerModal = ({ visible, setVisible, fun }) => {
  const [id, setId] = useState(""),
    [name, setName] = useState(""),
    ref1 = useRef(null),
    ref2 = useRef(null);

  const submitHandler = () => {
    if (id === "" || name === "") {
      return Alert.alert("All the fields are required");
    }
    fun(id.toLowerCase(), name);
  };
  return (
    <Modal
      // style={tw`h-full w-full  z-50 justify-center`}
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={[
          tw`h-full w-full absolute justify-center items-center`,
          { backgroundColor: "rgba(0,0,0,0.6)" },
        ]}
      >
        <View style={tw`w-11/12 rounded-lg bg-white`}>
          <TouchableOpacity
            style={tw`absolute right-4 top-4 z-10`}
            onPress={() => setVisible(false)}
          >
            <Text style={tw`text-black`}>
              <Icon type="feather" name="x" />
            </Text>
          </TouchableOpacity>
          <Text
            style={tw`border-b border-gray-300 mb-2 p-2 py-4 text-center text-xl font-semibold`}
          >
            Add Customer
          </Text>
          <TextInput
            style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
            ref={ref1}
            placeholder="Customer Email-Id"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
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
            placeholder="Customer Name"
            textContentType="name"
            returnKeyType="send"
            value={name}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={submitHandler}
          />
          <View style={tw`mx-4 my-2 mb-4`}>
            <Button onPress={submitHandler} title="Submit" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCustomerModal;
