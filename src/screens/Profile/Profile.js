import React, { useState } from "react";
import { Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button";
import { Colors } from "../../config/colors";
import { useDispatch, useSelector } from "react-redux";
import QRCode from 'react-native-qrcode-svg';
import moment from "moment";
import firestore from '@react-native-firebase/firestore';
import { Logout, userInfo } from "../../redux/actions/AuthActions";
import StudentPic from '../../assets/student.png'
import TeacherPic from '../../assets/teacher.png'
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = (props) => {

    const navigation = useNavigation()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.AuthReducer.userInfo?.data);
    const userID = useSelector((state) => state.AuthReducer.userInfo?.uid);
    const [productQRref, setProductQRref] = useState();
    // const start_time = new Date(user?.timeSlots?.start_time?.seconds * 1000 + user?.timeSlots?.start_time?.nanoseconds / 1000000).toLocaleTimeString();

    const StudentDetails = [
        {
            id: 1,
            info: user?.name ,
            name: 'Name',
            icon: <MaterialCommunityIcons name="account" size={16} color={Colors?.BLUE} />
        },

        {
            id: 2,
            info: user?.email ,
            name: 'Email',
            icon: <FontAwesome name="envelope" size={16} color={Colors?.BLUE} />
        },

        {
            id: 3,
            info: user?.contact ,
            name: 'Contact No.',
            icon: <FontAwesome name="phone" size={16} color={Colors?.BLUE} />
        },

        {
            id: 4,
            info: user?.studentID ,
            name: 'Student ID',
            icon: <FontAwesome5 name="id-badge" size={16} color={Colors?.BLUE} />
        },
        {
            id: 5,
            info: user?.department ,
            name: 'Department',
            icon: <FontAwesome name="building" size={16} color={Colors?.BLUE} />
        },
    ]
    const TeacherDetails = [
        {
            id: 1,
            info: user?.name ,
            name: 'Name',
            icon: <MaterialCommunityIcons name="account" size={16} color={Colors?.BLUE} />
        },

        {
            id: 2,
            info: user?.email ,
            name: 'Email',
            icon: <FontAwesome name="envelope" size={16} color={Colors?.BLUE} />
        },

        {
            id: 3,
            info: user?.contact ,
            name: 'Contact No.',
            icon: <FontAwesome name="phone" size={16} color={Colors?.BLUE} />
        },

        {
            id: 4,
            info: user?.qualification ,
            name: 'Qualification',
            icon: <FontAwesome name="graduation-cap" size={16} color={Colors?.BLUE} />
        },

        {
            id: 5,
            info: user?.department ,
            name: 'Department',
            icon: <FontAwesome name="building" size={16} color={Colors?.BLUE} />
        },
        {
            id: 6,
            info: user?.teacherRole ,
            name: 'Role',
            icon: <FontAwesome5 name="chalkboard-teacher" size={16} color={Colors?.BLUE} />
        }, {
            id: 7,
            info: user?.designation ,
            name: 'Designation',
            icon: <FontAwesome5 name="id-badge" size={16} color={Colors?.BLUE} />
        }, {
            id: 8,
            info: user?.bio ,
            name: 'Bio',
            icon: <AntDesign name="infocirlce" size={16} color={Colors?.BLUE} />
        },
        {
            id: 9,
            moreInfo: user?.courses,
            name: 'Courses',
            icon: <Entypo name="book" size={16} color={Colors?.BLUE} />
        },
        {
            id: 10,
            times: user?.timeSlots,
            name: 'Available Time Slots',
            icon: <Ionicons name="time" size={16} color={Colors?.BLUE} />
        },
        {
            id: 11,
            name: 'QR Code',
            icon: <FontAwesome5 name="qrcode" size={16} color={Colors?.BLUE} />,
            qrCode: true
        },
    ]

    const renderItem = ({ item }) => (
        <View style={styles.flex}>

            {item?.icon}

            <View style={{ gap: 3, width: '100%' }}>
                <Text style={styles.sub_heading}>{item?.name}</Text>
                {item?.info && <Text style={[styles.text, { lineHeight: 20, width: '90%' }]}>{item?.info}</Text>}

                {
                    item?.moreInfo ?
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                            {
                                item?.moreInfo?.map((item, index) => (
                                    <Text style={[styles.text, { backgroundColor: Colors?.BLUE, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, color: Colors?.WHITE }]} key={index}>{item}</Text>
                                ))
                            }
                        </View>
                        : null
                }


                {
                    item?.times ?
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8  }}>
                            {
                                item?.times?.map((item, index) => (
                                    <View key={index} style={{backgroundColor: Colors?.WHITE , borderColor: Colors?.BLUE , borderWidth: 1 , alignItems: 'center', paddingHorizontal: 10 , gap: 2 , paddingVertical:8 , borderRadius: 8}}>
                                        <Text style={[styles.text, { color: Colors?.BLUE }]} >{moment(item?.date).format('dddd')}</Text>

                                        <Text style={[styles.text, {  color: Colors?.BLUE , fontSize: 8 }]} >{moment(item?.date).format('DD/MM/yy')}</Text>
                                        <View style={{ flexDirection: 'row', gap: 5 }}>
                                            <Text style={[styles.text, { color: Colors?.BLUE , fontSize: 12 }]} >{item?.start_time}</Text>
                                            <Text style={[styles.text, { color: Colors?.BLUE , fontSize: 12 }]} >to</Text>
                                            <Text style={[styles.text, { color: Colors?.BLUE , fontSize: 12 }]} >{item?.end_time}</Text>
                                        </View>
                                    </View>

                                ))
                            }
                        </View>
                        : null
                }
                {
                    item?.qrCode &&
                    <View style={{ marginTop: 15 }}>
                        <QRCode
                            value={userID}
                            size={150}
                            color={Colors.BLUE}
                            backgroundColor="white"
                            getRef={(c) => setProductQRref(c)}
                        />
                    </View>

                }
            </View>
        </View>
    );

    const fetchUpdatedUserData = async () => {
        try {
            const userDocRef = firestore().collection('users').doc(userID);
            const userDoc = await userDocRef.get();
            if (userDoc) {
                const userData = userDoc.data();
                dispatch(userInfo({ uid: userID, data: userData?.profileDetails }))
            } else {
                console.log('User document not found in Firestore');
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    }



    return (
        <View style={styles.view} >
            <View style={styles.flexA}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                    <Ionicons name="chevron-back" size={24} color={Colors?.BLUE} onPress={() => navigation.goBack()} />
                    <Text style={[styles.sub_heading, { marginTop: 0, marginBottom: 0 }]}>Profile </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    Alert.alert('Note', 'Wanna logout from DMO ?', [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'Yes', onPress: () => {
                                dispatch(Logout())
                                AsyncStorage.removeItem('@user')
                            }
                        }
                    ]);
                }}>
                    <MaterialCommunityIcons name='logout' size={25} color={Colors.RED} />
                </TouchableOpacity>
            </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={fetchUpdatedUserData}
                />
            }>
                <Image source={user?.userRole == 'student' ? StudentPic : TeacherPic} style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 50, marginBottom: 30 }} tintColor={Colors?.BLUE} />

                <FlatList
                    data={user?.userRole == 'teacher' ? TeacherDetails : StudentDetails}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />

                <Button title="Edit Profile" style={{ marginTop: 20 }} onPress={() => navigation.navigate('EditProfile')} />

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 20,
    },
    flex: {
        flexDirection: 'row',
        gap: 15,
        marginVertical: 15,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    text: {
        color: Colors.DDGREY,
        fontSize: 14,
    },
    sub_heading: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.BLACK,
    },
    flexA: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default Profile;