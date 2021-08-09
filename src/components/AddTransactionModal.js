import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const AddTransactionModal = ({ visible, setVisible, fun }) => {
  const [amt, setAmt] = useState(null),
    [desc, setDesc] = useState(""),
    ref1 = useRef(null),
    ref2 = useRef(null);

  const submitHandler = (isGiving) => {
    if (!amt || !desc) {
      return Alert.alert("All the fields are required");
    }
    if (amt < 1) {
      return Alert.alert("Amount must be grater than 0");
    }
    fun(isGiving, Number(amt), desc);
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
            Add Transaction
          </Text>
          <TextInput
            style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
            ref={ref1}
            placeholder="Amount"
            keyboardType="numeric"
            returnKeyType="next"
            value={amt}
            onChangeText={(text) => setAmt(text)}
            onSubmitEditing={() => {
              ref2.current.focus();
            }}
            blurOnSubmit={false}
          />
          <TextInput
            style={tw`border border-gray-400 rounded p-2 m-2 mx-4`}
            ref={ref2}
            placeholder="Description"
            value={desc}
            onChangeText={(text) => setDesc(text)}
          />
          <View style={tw`flex-row items-center mx-4 mb-2`}>
            <View style={tw`p-2 w-1/2`}>
              <Button
                color="rgb(185,28,28)"
                onPress={() => submitHandler(true)}
                title="You Gave"
              />
            </View>
            <View style={tw`p-2 w-1/2`}>
              <Button
                color="rgb(4,120,87)"
                onPress={() => submitHandler(false)}
                title="You Got"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTransactionModal;
