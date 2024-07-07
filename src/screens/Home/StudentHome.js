import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TextInput, FlatList, TouchableOpacity, RefreshControl, Alert, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Colors } from "../../config/colors";
import auth from '@react-native-firebase/auth';
import ProfileImage from '../../assets/student.png'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import RecordCard from "../../components/RecordCard";
import { loaderOff, loaderOn, studentRecords, teachersList } from "../../redux/actions/AppAction";
import { useDispatch, useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';
import { useCameraPermission } from "react-native-vision-camera";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Logout } from "../../redux/actions/AuthActions";

const StudentHome = () => {
    const navigation = useNavigation()
    const userName = auth().currentUser.displayName
    const user = useSelector(state => state.AuthReducer.userInfo)
    const [TeachersList, setTeachersList] = useState([]);
    const allTeachers = useSelector(state => state.AppReducer.TeachersList)
    const [tsearch, settsearch] = useState('');
    const dispatch = useDispatch();
    const renderItem = ({ item, index }) => (
        <RecordCard item={item} index={index} active={true} />
    )

    const { hasPermission, requestPermission } = useCameraPermission()


    useEffect(() => {
        if (!hasPermission) {
            requestPermission()
        }
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            fetchTeachers();
            fetchMyRecords();
        }, [navigation])
    );

    const fetchMyRecords = async () => {
        const userRef = firestore().collection('users').doc(user?.uid)
        const recordData = await userRef.get();
        if (recordData) {
            const response = recordData.data();
            dispatch(studentRecords(response?.myRecords));
        } else {
            console.log('User document not found in Firestore');
        }
    }

    useEffect(() => {
        dispatch(teachersList(TeachersList));
    }, [TeachersList])
    
    const fetchTeachers = (e = null) => {
        dispatch(loaderOn());
        setTeachersList([]);
        const usersRef = firestore().collection('users')
        const teacherUsersQuery = usersRef.where('profileDetails.userRole', '==', 'teacher');
        teacherUsersQuery.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const response = doc.data();
                    setTeachersList(arr => [...arr, response?.profileDetails]);
                    dispatch(loaderOff());
                });
            })
            .catch((error) => {
                console.error('Error getting documents: ', error);
                dispatch(loaderOff());
            })
    }

    return (
        <View style={styles.view}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { fetchTeachers(true), settsearch('') }}
                    />
                }>
                {
                    user?.data?.userRole == 'student' ?
                        <View style={styles.flex}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={ProfileImage} style={{ width: 40, height: 40, borderRadius: 50 }} tintColor={Colors?.BLUE} />
                            </TouchableOpacity>
                            <Text style={styles.heading}>Hii ! {userName ? userName : user?.data?.name}</Text>
                        </View>
                        :
                        <View style={styles.flexABC}>
                            <Text style={styles.heading}>Welcome! Mr. Visitor</Text>
                            <TouchableOpacity onPress={() => {
                                Alert.alert('Note', 'Wanna logout from DMO ?', [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes', onPress: () => {
                                            try {
                                                dispatch(Logout())
                                                AsyncStorage.removeItem('@user')
                                            } catch (e) {
                                                console.log(e);
                                                Alert.alert('Error', 'Something went wrong, Please try again later');
                                            }
                                        }
                                    }
                                ]);
                            }}>
                                <MaterialCommunityIcons name='logout' size={25} color={Colors.RED} />
                            </TouchableOpacity>
                        </View>

                }

                <View style={[styles.inp1, { marginTop: 20, marginBottom: 5 }]}>
                    <FontAwesome name='search' size={20} color={Colors.DGREY} />
                    <TextInput placeholder="search teacher" style={styles.inputtxt}
                        value={tsearch}
                        onChangeText={
                            (e) => {
                                settsearch(e);
                                if (e != '') {
                                    const searchResult = allTeachers.filter((item) => {
                                        return item?.name?.toLowerCase().includes(e.toLowerCase())
                                    })
                                    dispatch(teachersList(searchResult));
                                }
                                else if (e == '') {
                                    dispatch(teachersList(TeachersList));
                                }
                                else {
                                    dispatch(teachersList(TeachersList));
                                }
                            }
                        }
                        placeholderTextColor={Colors?.DGREY} />
                </View>


                {
                    user?.data?.userRole == 'student' ?
                        <>
                            <Text style={styles.sub_heading}>Find Your Teacher</Text>
                            <TouchableOpacity onPress={hasPermission ? () => navigation.navigate('Scanner') :
                                () => Alert.alert('Note', 'No camera permission granted!')} style={styles.scanner_button}>
                                <SimpleLineIcons name='magnifier' color={Colors?.BLUE} size={25} />
                                <Text style={{ color: Colors?.BLUE, fontSize: 14, }}>By scanning QR Code</Text>
                            </TouchableOpacity>
                        </>

                        : null
                }
                <Text style={styles.sub_heading}>Teachers</Text>

                <FlatList
                    data={allTeachers}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                            <Text style={{ fontSize: 16, color: Colors?.GREY }}>No Teacher Available</Text>
                        </View>
                    )}

                />

            </ScrollView>
        </View>
    )
}

export default StudentHome;

const styles = StyleSheet.create({
    view: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: Colors?.WHITE,
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    flexABC: {
        flexDirection: 'row',
        alignItems: 'center',
justifyContent: 'space-between',
   },
    text: {
        fontSize: 15,
        color: Colors?.BLACK,
        fontWeight: '600'
    },
    span: {
        fontSize: 12,
        color: Colors?.DGREY,
    },
    heading: {
        fontSize: 18,
        color: Colors?.BLACK,
    },
    sub_heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors?.BLACK,
        marginTop: 30,
        marginBottom: 10,
    },
    scanner_button: {
        backgroundColor: Colors?.LIGHT,
        borderColor: Colors?.BLUE,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        gap: 10,

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
        width: '90%',
        color: Colors.BLACK,
    },
})

