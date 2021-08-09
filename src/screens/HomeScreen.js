import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, Alert } from "react-native";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import AddButton from "../components/AddButton";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerListItem from "../components/CustomerListItem";
import Dashboard from "../components/Dashboard";
import Loader from "../components/Loader";
import firebase from "../firebase";
import { selectUser } from "../redux/slices/userSlice";

const db = firebase.firestore;

const HomeScreen = () => {
  const user = useSelector(selectUser),
    [userDoc, setUserDoc] = useState(null),
    [customers, setCustomers] = useState([]),
    [loading, setLoading] = useState(false),
    [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = db()
      .collection("users")
      .doc(user?.email)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setUserDoc(snap.data());
        }
        setLoading(false);
      });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = db()
      .collection("users")
      .doc(user?.email)
      .collection("customers")
      .orderBy("lastActivity", "desc")
      .onSnapshot((snap) => {
        let cst = [];
        snap.forEach((doc) => {
          cst.push({
            id: doc?.id,
            name: doc?.data()?.name,
            balance: doc?.data()?.balance,
          });
        });
        setCustomers(cst);
        setLoading(false);
      });
    return unsubscribe;
  }, [user]);

  const addCustomer = (id, name) => {
    if (id && name) {
      if (id === user?.email) {
        return Alert.alert("Can't add yourself as a customer!!");
      }
      if (customers.filter((cust) => cust.id === id).length > 0) {
        return Alert.alert("Customer already exists!!");
      }
      setLoading(true);
      const lastActivity = db.FieldValue.serverTimestamp();
      db()
        .collection("users")
        .doc(user.email)
        .collection("customers")
        .doc(id)
        .set({
          name,
          balance: 0,
          lastActivity,
        });
      setModalVisible(false);
      setLoading(false);
      // // //ALL THIS IS NOW DONE USING CLOUD FUNCTIONS // // // // //
      //                                                             //
      db().collection("users").doc(id).set({}, { merge: true });
      db()
        .collection("users")
        .doc(id)
        .collection("customers")
        .doc(user.email)
        .set({ name: user.name, balance: 0, lastActivity })
        .catch((err) => console.log(err.message));
      //                                                             //
      // // // // // // // // // // // // // // // // // // // // // //
    }
  };

  return (
    <SafeAreaView style={tw`flex-grow h-full`}>
      {loading && <Loader />}
      {modalVisible && (
        <AddCustomerModal
          fun={addCustomer}
          visible={modalVisible}
          setVisible={setModalVisible}
        />
      )}
      <StatusBar style="light" />
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Dashboard
              data={{
                sent: userDoc?.sent || 0,
                received: userDoc?.received || 0,
              }}
            />
            <AddButton
              onPress={() => setModalVisible(true)}
              text="Add Customer"
            />
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={[tw`w-full bg-gray-300`, { height: 1 }]}></View>
        )}
        overScrollMode="never"
        ListHeaderComponentStyle={tw`mb-2`}
        showsVerticalScrollIndicator={false}
        data={customers}
        keyExtractor={(_, index) => index.toLocaleString()}
        renderItem={({ item }) => <CustomerListItem customer={item} />}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
