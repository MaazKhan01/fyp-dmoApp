import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Colors } from "../../config/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from "react-redux";
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from "../../components/button";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown'
import LinearGradient from "react-native-linear-gradient";


export default Signup = (props) => {

    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [UserRole, setUserRole] = useState(null);
    const [passwordVisible, setpasswordVisible] = useState(true);
    const ROLES = ["teacher", "student"]
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleSignup = () => {
        if (!email || !password || !name || !UserRole) {
            Alert.alert('Note', 'Please fill all the feilds !')
        } else {
            dispatch(loaderOn())
            auth().createUserWithEmailAndPassword(email, password)
                .then((e) => {
                    const user = e.user;
                    user.updateProfile({ displayName: name })

                    if (UserRole === 'teacher') {
                        setTeacherData()
                    } else {
                        setStudentData()
                    }

                    navigation.navigate('Login')
                    Alert.alert('Yeahh!', 'Account created successfully!')
                    dispatch(loaderOff())
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
                        dispatch(loaderOff())
                    }
                })
        }
    }

    const setTeacherData = () => {
        firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({
                profileDetails: {
                    id: auth().currentUser.uid,
                    name: name,
                    email: email,
                    userRole: UserRole,
                    contact: null,
                    qualification: null,
                    department: null,
                    designation: null,
                    bio: null,
                    profileImage: null,
                    teacherRole: null,
                    courses: [],
                    timeSlots: []
                },
                requests: []

            });
    }

    const setStudentData = () => {
        firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({
                profileDetails: {
                    name: name,
                    email: email,
                    userRole: UserRole,
                    contact: null,
                    department: null,
                    profileImage: null,
                },
                myRecords: []

            });
    }

    return (

        <LinearGradient colors={['#1b6aa3', Colors?.BLUE]} style={styles.view}>

            <ScrollView>
                <Text style={styles.heading}>Signup</Text>
                <Text style={styles.span}>{`Create your account on Digital Meet Online`}</Text>

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

                <Text style={styles.text}>User Role</Text>
                <SelectDropdown
                    data={ROLES}
                    defaultButtonText="Select user role"
                    buttonStyle={styles.inp1}
                    buttonTextStyle={{
                        fontSize: 14,
                        color: Colors.DGREY
                    }}

                    onSelect={(selectedItem, index) => {
                        setUserRole(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                />

                <Button title="Signup" style={styles.btn} onPress={handleSignup} />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20,
        paddingTop: 50
    },
    inputs: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 23,
        color: Colors.WHITE,
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
    },
    span: {
        fontSize: 13,
        color: Colors.WHITE,
        marginTop: 5,
        marginBottom: 30
    }

});



