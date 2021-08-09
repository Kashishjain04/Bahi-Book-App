import React, { useLayoutEffect, useState } from "react";
import { View, Image, Text, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Loader from "../components/Loader";

const ReceiptScreen = ({ route }) => {
  const { uri } = route.params,
    navigation = useNavigation(),
    [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerBackTitleVisible: false,
      headerTransparent: true,
      gestureEnabled: true,
      gestureDirection: "vertical",
      gestureResponseDistance: 1000,
      headerTintColor: "white",
      cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      cardStyle: { backgroundColor: "rgba(0,0,0,0.7)" },
      headerRight: () => (
        <Text style={tw`mr-4 text-white`}>
          <Icon
            onPress={onDownloadImage}
            type="feather"
            name="download"
            size={25}
            color="#fff"
          />
        </Text>
      ),
    });
  }, []);

  const onDownloadImage = async () => {
    setLoading(true);
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission to access gallery is required");
    }
    const filePath =
      FileSystem.documentDirectory +
      uri.slice(uri.lastIndexOf("=") + 1) +
      ".jpg";
    FileSystem.downloadAsync(uri, filePath)
      .then(async ({ uri }) => {
        await MediaLibrary.saveToLibraryAsync(uri);
        navigation.goBack();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  return (
    <View style={tw`flex-grow`}>
      {loading && <Loader />}
      <Image
        source={{ uri }}
        style={[
          tw`h-full w-full`,
          {
            flex: 1,
            resizeMode: "contain",
          },
        ]}
      />
    </View>
  );
};

export default ReceiptScreen;
