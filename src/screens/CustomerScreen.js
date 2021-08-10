import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import firebase from "../firebase";
import Dashboard from "../components/Dashboard";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import TransactionListItem from "../components/TransactionListItem";
import Loader from "../components/Loader";
import AddButton from "../components/AddButton";
import AddTransactionModal from "../components/AddTransactionModal";

const db = firebase.firestore,
  storage = firebase.storage;

const CustomerScreen = ({ route }) => {
  const { customerId, customerName } = route?.params,
    navigation = useNavigation(),
    user = useSelector(selectUser),
    [trans, setTrans] = useState([]),
    [gave, setGave] = useState(0),
    [got, setGot] = useState(0),
    [loading, setLoading] = useState(false),
    [modalVisible, setModalVisible] = useState(false),
    custRef = db()
      .collection("users")
      .doc(user?.email)
      .collection("customers")
      .doc(customerId),
    transRef = custRef.collection("transactions").doc(),
    selfRef = db()
      .collection("users")
      .doc(customerId)
      .collection("customers")
      .doc(user.email),
    selfTransRef = selfRef.collection("transactions").doc(transRef.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: customerName || "Name",
      headerStyle: [tw`bg-red-800`, { elevation: 10 }],
      headerLeft: () => (
        <View style={tw`bg-gray-500 shadow-md ml-4 rounded-full`}>
          <Avatar
            rounded
            title={customerName?.[0]?.toUpperCase() || "N"}
            size={35}
            titleStyle={tw`text-white`}
          />
        </View>
      ),
    });
  }, [customerId]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = db()
      .collection("users")
      .doc(user?.email)
      .collection("customers")
      .doc(customerId)
      .collection("transactions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        let trn = [];
        snap.forEach((doc) => {
          trn.push({ ...doc.data(), id: doc.id });
        });
        setTrans(trn);
        setLoading(false);
      });
    return unsubscribe;
  }, [user, customerId]);

  useEffect(() => {
    let tGave = 0,
      tGot = 0;
    trans.forEach((t) => {
      if (t.amount < 0) tGave -= t.amount;
      else tGot += t.amount;
    });
    setGave(tGave);
    setGot(tGot);
  }, [trans]);

  const addTransaction = (isGiving, amount, desc, url = "") => {
    setLoading(true);
    let amt = 0;
    if (isGiving) {
      amt = -1 * amount;
    } else {
      amt = amount;
    }
    setModalVisible(false);
    const lastActivity = db.FieldValue.serverTimestamp();
    transRef.set({
      timestamp: lastActivity,
      amount: amt,
      desc,
      receipt: url,
    });
    selfTransRef.set({
      timestamp: lastActivity,
      amount: -1 * amt,
      receipt: url,
      desc,
    });
    if (isGiving) {
      db()
        .collection("users")
        .doc(user?.email)
        .update({ sent: db.FieldValue.increment(Math.abs(amt)) });
      db()
        .collection("users")
        .doc(customerId)
        .update({ received: db.FieldValue.increment(Math.abs(amt)) });
    } else {
      db()
        .collection("users")
        .doc(user.email)
        .update({ received: db.FieldValue.increment(Math.abs(amt)) });
      db()
        .collection("users")
        .doc(customerId)
        .update({ sent: db.FieldValue.increment(Math.abs(amt)) });
    }
    custRef.update({
      balance: db.FieldValue.increment(amt),
      lastActivity,
    });
    selfRef
      .update({
        balance: db.FieldValue.increment(-1 * amt),
        lastActivity,
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={tw`h-full`}>
      {loading && <Loader />}
      {modalVisible && (
        <AddTransactionModal
          fun={addTransaction}
          visible={modalVisible}
          setVisible={setModalVisible}
          transId={transRef?.id}
          storage={storage}
          setLoading={setLoading}
        />
      )}
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Dashboard data={{ sent: gave || 0, received: got || 0 }} />
            <AddButton
              text="Add Transaction"
              onPress={() => setModalVisible(true)}
            />
          </View>
        )}
        ListHeaderComponentStyle={tw`mb-4`}
        ItemSeparatorComponent={() => (
          <View style={[tw`w-full bg-gray-300`, { height: 1 }]}></View>
        )}
        showsVerticalScrollIndicator={false}
        data={trans}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <TransactionListItem trans={item} />}
      />
    </SafeAreaView>
  );
};

export default CustomerScreen;
