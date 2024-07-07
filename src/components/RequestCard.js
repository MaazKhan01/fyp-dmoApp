import React from "react";

import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Entypo from 'react-native-vector-icons/Entypo';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from "../config/colors";

import ProfileImage from '../assets/student.png'
import { loaderOff, loaderOn, teacherRecords } from "../redux/actions/AppAction";
import { useDispatch } from "react-redux";
import firestore from '@react-native-firebase/firestore';
import { useSelector } from "react-redux";


const RequestCard = ({ item, index, active }) => {
    const navigation = useNavigation()
    const userID = useSelector(state => state.AuthReducer.userInfo?.uid)
    const dispatch = useDispatch();

    const deleteRecord = async (id) => {
        try {
            dispatch(loaderOn())
            const docRef = firestore().collection('users').doc(userID)
            const allRequests = await docRef.get();
            const { requests } = allRequests.data()
            const recordIndex = requests.findIndex(item => item?.requestID == id);
            if (recordIndex != -1) {
                requests.splice(recordIndex, 1);
                await docRef.update({ requests });

                let completedReq = requests?.filter((item) => {
                    return item?.status == 'completed'
                })
                dispatch(teacherRecords(completedReq))
                dispatch(loaderOff())
                Alert.alert('Note', 'Record Deleted!')
            }
        }
        catch (e) {
            console.log(e)
            Alert.alert('Error', 'Request failed!')
            dispatch(loaderOff())
        }
    }

    return (
        <TouchableOpacity disabled={active ? false : true} onPress={() => navigation.navigate('RequestDetail', { type: active ? 'active' : 'inactive', item: item })} style={{ backgroundColor: Colors?.WHITE, elevation: 8, gap: 8, padding: 20, borderRadius: 18, marginVertical: 10, marginHorizontal: 4 }}>
            {
                active ?
                    <FontAwesome name="circle" size={13} color={Colors?.LIGHT_GREEN} style={{ position: 'absolute', top: -5, alignSelf: 'flex-end' }} />
                    : null
            }


            <View style={styles.flexA}>
                <Text style={[styles.text, { color: Colors?.BLACK }]}>Request from </Text>
                {!active ?
                    <TouchableOpacity onPress={() => deleteRecord(item?.requestID)} >
                        <Entypo name="trash" size={20} color={Colors?.RED} />
                    </TouchableOpacity>
                    : null}
            </View>


            <View style={[styles.flex, { marginVertical: 5 }]}>
                <Image source={ProfileImage} style={{ width: 25, height: 25, borderRadius: 50 }} tintColor={Colors?.BLUE} />
                <Text style={{ color: Colors?.BLUE, fontSize: 20 }}>{item?.studentDetails?.name ? item?.studentDetails?.name : 'Abdul Ahad'}</Text>
            </View>
            {
                !active ?
                    <View style={[styles.flex, { marginVertical: 3 }]}>
                        <Text style={styles.text}>Reason: </Text>
                        <Text style={styles.text}>{item?.course ? item?.course : 'I want to understand the numericals'}</Text>
                    </View>
                    : null
            }
            <View style={[styles.flex, { gap: 15, width: '100%' }]}>
                {
                    item?.studentDetails?.department ?
                        <View style={[styles.flex, { width: '50%' }]}>
                            <MaterialCommunityIcons name="google-classroom" size={16} color={Colors?.DGREY} />
                            <Text numberOfLines={1} style={[styles.text, { width: '85%', }]}>{item?.studentDetails?.department}</Text>
                        </View>
                        : null
                }


                <View style={styles.flex}>
                    <Entypo name="book" size={16} color={Colors?.DGREY} />
                    <Text style={styles.text}>{item?.course ? item?.course : 'Physics'}</Text>
                </View>




            </View>
            <View style={[styles.flex, { gap: 15, width: '100%' }]}>
                {
                    !active ?
                        <View style={styles.flex}>
                            <Entypo name="calendar" size={16} color={Colors?.DGREY} />
                            <Text style={styles.text}>{item?.day?.date}</Text>

                        </View>
                        : null
                }

                {
                    !active ?
                        <View style={styles.flex}>
                            <Entypo name="clock" size={16} color={Colors?.DGREY} />
                            <Text style={styles.text}>{item?.day?.start_time + ' - ' + item?.day?.end_time}</Text>

                        </View>
                        : null
                }
            </View>
        </TouchableOpacity>





    )
}

export default RequestCard;
const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors?.WHITE,
        paddingHorizontal: 20,
        paddingTop: 20
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors?.BLACK
    },
    sub_heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors?.BLACK,
        marginTop: 20
    },
    text: {
        fontSize: 13,
        color: Colors?.DGREY
    },
    flexA: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

})  