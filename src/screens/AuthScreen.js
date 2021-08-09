import React from "react";
import { Image, StyleSheet, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { ANDROID_OAUTH_KEY, IOS_OAUTH_KEY } from "@env";
import * as Google from "expo-google-app-auth";
import { GoogleSocialButton } from "react-native-social-buttons";
import firebase from "../firebase";

const auth = firebase.auth,
  db = firebase.firestore,
  googleProvider = new auth.GoogleAuthProvider();

const AuthScreen = () => {
  const googleLogin = async () => {
    try {
      const res = await Google.logInAsync({
        androidStandaloneAppClientId: ANDROID_OAUTH_KEY,
        androidClientId: ANDROID_OAUTH_KEY,
        iosClientId: IOS_OAUTH_KEY,
        scopes: ["profile", "email"],
      });
      if (res.type === "success") {
        const cred = googleProvider.credential(res.idToken, res.accessToken);
        auth()
          .signInWithCredential(cred)
          .then(({ additionalUserInfo }) => {
            if (additionalUserInfo?.isNewUser) {
              db()
                .collection("users")
                .doc(additionalUserInfo?.profile?.email)
                .set(
                  { name: additionalUserInfo?.profile?.name },
                  { merge: true }
                );
            }
          })
          .catch((err) => console.log(err));
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Image
        style={tw`w-full h-96 -mt-44`}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/bahi-book.appspot.com/o/icon.png?alt=media&token=13344b24-3410-4047-957a-e6447432c4e7",
        }}
      />
      <GoogleSocialButton
        buttonViewStyle={tw`border border-gray-400 w-60 h-12 mt-10`}
        textStyle={tw`text-black text-lg font-semibold`}
        onPress={googleLogin}
      />
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({});
