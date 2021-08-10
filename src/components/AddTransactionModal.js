import React, { useEffect, useRef, useState } from "react";
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
import * as ImagePicker from "expo-image-picker";

const AddTransactionModal = ({
  visible,
  setVisible,
  fun,
  transId,
  storage,
  setLoading,
}) => {
  const [amt, setAmt] = useState(null),
    [desc, setDesc] = useState(""),
    ref1 = useRef(null),
    ref2 = useRef(null),
    [image, setImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    return setLoading(false);
  }, []);

  const submitHandler = (isGiving) => {
    if (!amt || !desc) {
      return Alert.alert("All the fields are required");
    }
    if (amt < 1) {
      return Alert.alert("Amount must be grater than 0");
    }
    if (image) {
      uploadImage(isGiving);
    } else {
      fun(isGiving, Number(amt), desc, "");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert("Permission to access camera roll is required");
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    setImage(res.uri || null);
  };

  const uploadImage = async (isGiving) => {
    setLoading(true);
    const fileName = image.substring(image.lastIndexOf("/")),
      response = await fetch(image),
      blob = await response.blob(),
      storageRef = storage().ref(`receipts/${transId}-${fileName}`),
      task = storageRef.put(blob);
    task.on(
      "state_changed",
      function progress(snapshot) {},
      function error(err) {
        console.log(err);
        setLoading(false);
      },
      function complete() {
        storageRef
          .getDownloadURL()
          .then((url) => {
            setLoading(false);
            fun(isGiving, Number(amt), desc, url);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    );
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={[
          tw`h-full w-full absolute justify-center items-center`,
          { backgroundColor: "rgba(0,0,0,0.6)" },
        ]}
      >
        <TouchableOpacity
          onPress={null}
          activeOpacity={1}
          style={tw`w-11/12 rounded-lg bg-white`}
        >
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
          <View style={tw`mx-4 my-2`}>
            <Button onPress={pickImage} title="Add Receipt" />
          </View>
          <View style={tw`flex-row items-center mx-2 mb-2`}>
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddTransactionModal;
