import React from "react";

import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";


import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from "../config/colors";
import TeacherImage from '../assets/teacher.png'
import { loaderOff, loaderOn, studentRecords } from "../redux/actions/AppAction";
import { useDispatch, useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';
const RecordCard = ({ item, index, active }) => {

    const userID = useSelector(state => state.AuthReducer.userInfo?.uid)
    const dispatch = useDispatch();

    const deleteRecord = async (id) => {
        try {
            dispatch(loaderOn())
            const docRef = firestore().collection('users').doc(userID)
            const records = await docRef.get();
            const { myRecords } = records.data()
            const recordIndex = myRecords.findIndex(item => item?.requestID == id);
            myRecords.splice(recordIndex, 1);
            await docRef.update({ myRecords });
            dispatch(studentRecords(myRecords));
            dispatch(loaderOff())
            Alert.alert('Note', 'Record Deleted!')
        }
        catch (e) {
            console.log(e)
            Alert.alert('Error', 'Request failed!')
            dispatch(loaderOff())
        }
    }


    const navigation = useNavigation()
    return (
        <TouchableOpacity disabled={active ? false : true}
            onPress={() => navigation.navigate('TeacherDetail', { type: active ? 'active' : 'inactive', item: item })} style={{ backgroundColor: Colors?.WHITE, elevation: 5, gap: 5, padding: 20, borderRadius: 10, marginVertical: 10, marginHorizontal: 4, flexDirection: "row", alignItems: 'center', gap: 10 }}>
            <Image source={TeacherImage} style={{ width: 40, height: 40, borderRadius: 50 }} tintColor={Colors?.BLUE} />
            <View style={{ gap: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '82%' }}>
                    <Text style={[styles.text, { width: '70%' }]}>{item?.name ? item?.name : item?.teacherDetails?.name ? item?.teacherDetails?.name : ' '}</Text>
                    {
                        !active ?
                            <TouchableOpacity onPress={() => deleteRecord(item?.requestID)}>
                                <Entypo name='trash' size={18} color={Colors?.RED} />
                            </TouchableOpacity>
                            :
                            null}

                </View>
                <View style={styles.flex}>
                    <MaterialCommunityIcons name="google-classroom" size={14} color={Colors?.DGREY} />
                    <Text style={styles.span}>{item?.department ? item?.department : 'Computer Science'}</Text>
                </View>
                {
                    !active ?
                        <View style={styles.flex}>
                            <MaterialCommunityIcons name="book" size={14} color={Colors?.DGREY} />
                            <Text style={styles.span}>{item?.course}</Text>
                            <View style={[styles.flex, { marginLeft: 10 }]}>
                                <MaterialCommunityIcons name="calendar" size={14} color={Colors?.DGREY} />
                                <Text style={styles.span}>{item?.day?.date}</Text>
                            </View>

                        </View>
                        : null
                }

                {
                    item?.courses?.length > 0 ?
                        <View style={styles.flex}>
                            <Entypo name="book" size={14} color={Colors?.DGREY} />
                            <FlatList
                                data={item?.courses}
                                horizontal
                                renderItem={({ item }) => (
                                    <Text style={styles.span}>{item + ' - '}</Text>
                                )}
                                style={{ width: '70%' }}
                                keyExtractor={(item, index) => index}
                            />
                            {
                                item?.courses?.length > 2 ?
                                    <Text style={styles.span}>{'...'}</Text>
                                    : null
                            }

                        </View>
                        : null
                }

                {
                    !active ?
                        (item?.status == 'declined' ?

                            <View style={styles.flex}>
                                <Entypo name="circle-with-cross" size={16} color={Colors?.RED} />
                                <Text style={{fontSize: 13 , color: Colors?.RED}}>Declined</Text>
                            </View>
                            :
                            <View style={styles.flex}>
                                <MaterialCommunityIcons name="clock" size={14} color={Colors?.DGREY} />
                                <Text style={styles.span}>{item?.day?.start_time + ' to ' + item?.day?.end_time}</Text>
                            </View>)
                        : null
                }
            </View>


        </TouchableOpacity>
    )
}

export default RecordCard;
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

})  