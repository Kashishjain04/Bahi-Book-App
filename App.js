import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/redux/store";
import { login, logout, selectUser } from "./src/redux/slices/userSlice";
import firebase from "./src/firebase";
import CustomerScreen from "./src/screens/CustomerScreen";
import tw from "tailwind-react-native-classnames";
import ReceiptScreen from "./src/screens/ReceiptScreen";
import Loader from "./src/components/Loader";
import { Icon } from "react-native-elements";

// ignore firebase set timer messages
import { LogBox } from "react-native";
import _ from "lodash";
LogBox?.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
// end ignore

const auth = firebase.auth;

export default function App() {
  const Stack = createStackNavigator();

  const logoutHandler = () => {
    auth().signOut();
  };

  const AppStack = () => (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureResponseDistance: 300,
        headerStyle: [
          tw`bg-red-800`,
          {
            elevation: 0,
            shadowOffset: { width: 0, height: 0 },
          },
        ],
        headerTitleStyle: tw`text-white`,
        headerTitleAlign: "left",
      }}
    >
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerRight: () => (
            <Text style={tw`mr-4 text-white`}>
              <Icon
                onPress={logoutHandler}
                type="material"
                name="logout"
                size={25}
                color="#fff"
              />
            </Text>
          ),
        }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen name="Customer" component={CustomerScreen} />
      <Stack.Screen name="Receipt" component={ReceiptScreen} />
    </Stack.Navigator>
  );
  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
  const RenderStack = () => {
    const user = useSelector(selectUser),
      dispatch = useDispatch(),
      [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      const unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          const obj = {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
          };
          dispatch(login(obj));
          setLoading(false);
        } else {
          dispatch(logout());
          setLoading(false);
        }
      });
      return unsubscribe;
    }, []);
    return loading ? <Loader /> : user ? <AppStack /> : <AuthStack />;
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
            style={{ flex: 1 }}
          >
            <RenderStack />
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
