import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "../redux/slices/userSlice";
import Loader from "../components/Loader";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import firebase from '../firebase';

const auth = firebase.auth;

const RenderStack = () => {
    const user = useSelector(selectUser),
        dispatch = useDispatch(),
        [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // mock login
        // auth().signInWithEmailAndPassword("test@user.com", "123456").catch(err => console.log(err));
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

export default RenderStack;