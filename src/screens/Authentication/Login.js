import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Colors } from "../../config/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Entypo from 'react-native-vector-icons/Entypo';
import Button from "../../components/button";
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { userExist, userInfo } from "../../redux/actions/AuthActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';


export default Login = (props) => {

    const passingData = props?.route?.params?.item;
    const navigation = useNavigation();
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [passwordVisible, setpasswordVisible] = useState(true);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Note', 'Please fill all the feilds !')
        } else {
            dispatch(loaderOn())
            await auth()
                .signInWithEmailAndPassword(email, password)
                .then((res) => {
                    // let uid = res?.user?.uid
                    AsyncStorage.setItem('@user', JSON.stringify(res?.user))
                    dispatch(userExist(true))
                    dispatch(loaderOff())
                })
                .catch(error => {
                    console.log(error.message);
                    Alert.alert('Note', 'email or password is invalid!')
                    dispatch(loaderOff())
                })
        }
    }


    return (
        <LinearGradient colors={['#1b6aa3', Colors?.BLUE]} style={styles.view}>
         
                <ScrollView>
                    <Image source={require('../../assets/icon.jpg')} style={{ width: 120, height: 120, marginBottom: 50, alignSelf: 'center' }} />

                    <Text style={styles.heading}>Login</Text>
                    <Text style={styles.span}>Login to get into your account </Text>

                    <Text style={styles.text}>Email</Text>
                    <View style={[styles.inp1, { marginBottom: 20 }]}>
                        <FontAwesome5 name='envelope' size={18} color={Colors.DGREY} style={styles.icon} />
                        <TextInput placeholder="Enter email" style={styles.inputtxt}
                            value={email}
                            onChangeText={(e) => setemail(e)}
                            placeholderTextColor={Colors?.GREY} />
                    </View>

                    <Text style={styles.text}>Password</Text>
                    <View style={styles.inp1}>
                        <Feather name='lock' size={18} color={Colors.DGREY} style={styles.icon} />
                        <TextInput placeholder="Enter password" style={[styles.inputtxt, { width: '75%' }]}
                            value={password}
                            secureTextEntry={passwordVisible}
                            onChangeText={(e) => setpassword(e)}
                            placeholderTextColor={Colors?.GREY} />

                        <Entypo onPress={() => setpasswordVisible(!passwordVisible)} name={passwordVisible ? 'eye-with-line' : 'eye'} size={18} color={Colors.DGREY} />
                    </View>

                    <Button title="Login" style={styles.btn} onPress={handleLogin} />
                    <Text style={styles.txt}>Don't have an account ? <Text  onPress={() => navigation.navigate('Signup', { item: passingData })}>SIGN UP</Text> </Text>
                </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        padding: 20,
        paddingTop: 50
    },
    inputs: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        color: Colors.WHITE,
        fontWeight: 'bold',
    },
    span: {
        fontSize: 13,
        color: Colors.WHITE,
        marginTop: 5,
        marginBottom: 40,
    },
    inp1: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        gap: 10,
        alignSelf: 'center',
        borderRadius: 10,
        width: '96%',
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        elevation: 5
    },
    inputtxt: {
        width: '80%',
        color: Colors.BLACK,
    },
    txt: {
        fontSize: 12,
        marginTop: 25,
        alignSelf: 'center',
        color: Colors.WHITE,
    },
    btn: {
        marginTop: '15%',
        width: '95%',
        paddingVertical: 15,
borderColor: Colors.WHITE,
borderWidth: 1,
    },
    btntxt: {
        textAlign: "center",
        fontSize: 18,
        padding: 5,
        color: '#fff'
    },
    text: {
        margin: 10,
        fontSize: 14,
        color: Colors.WHITE
    }

});



