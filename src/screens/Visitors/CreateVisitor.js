import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from "react-redux";
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button";
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";
import { Colors } from "../../config/colors";


export default CreateVisitor = (props) => {

    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [passwordVisible, setpasswordVisible] = useState(true);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const onPressCreateVisitor = () => {
        if (!email || !password || !name) {
            Alert.alert('Note', 'Please fill all the feilds !')
        } else {
            dispatch(loaderOn())
            auth().createUserWithEmailAndPassword(email, password)
                .then((e) => {
                    const user = e.user;
                    setDatabase()

                    navigation.goBack()
                    Alert.alert('Success!', 'Visitor created successfully!')
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        Alert.alert('Note', 'That email address is already in use!')
                    }
                    else if (error.code === 'auth/invalid-email') {
                        Alert.alert('Note', 'That email address is invalid!')
                    } else if (error.code === 'auth/weak-password') {
                        Alert.alert('Note', 'Password length must be 8 digits!')
                    }
                    else if (error.code === 'auth/network-request-failed') {
                        Alert.alert('Note', 'Network error!')
                    } else {
                        Alert.alert('Note', 'something goes wrong')
                        console.error(error);
                    }
                }).finally(() => dispatch(loaderOff()));
        }
    }


    const setDatabase = () => {
        firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({
                profileDetails: {
                    name: name,
                    email: email,
                    password: password,
                    id: auth().currentUser.uid,
                    userRole: 'visitor'
                },
                myRecords: []

            });
    }

    return (

        <View style={styles.view}>
            <ScrollView>
                <View style={styles.flex}>
                    <Ionicons name="chevron-back" size={24} color={Colors?.BLUE} onPress={() => navigation.goBack()} />
                    <Text style={styles.sub_heading}>Create Visitor </Text>
                </View>

                <Text style={styles.text}>Name</Text>
                <View style={styles.inp1}>
                    <Ionicons name='person-outline' size={18} color={Colors.DGREY} style={styles.icon} />
                    <TextInput placeholder="Enter name" style={styles.inputtxt}
                        value={name}
                        onChangeText={(e) => setname(e)}
                        placeholderTextColor={Colors?.GREY} />
                </View>

                <Text style={styles.text}>Email</Text>
                <View style={styles.inp1}>
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

                <Button title="Create" style={styles.btn} onPress={onPressCreateVisitor} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20,
    },
    inputs: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 30,
        color: Colors.BLACK,
        fontWeight: 'bold',
    },
    inp1: {
        marginBottom: 20,
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
        color: Colors.DGREY,
    },
    btn: {
        marginTop: '15%',
        width: '95%',
        paddingVertical: 15,

    },
    text: {
        margin: 10,
        fontSize: 14,
        color: Colors.BLACK
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    sub_heading: {
        fontSize: 14,
        color: Colors.BLACK,
        fontWeight: 'bold',
        marginLeft: 10
    },

});



