import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal, RefreshControl,  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button";
import { Colors } from "../../config/colors";
import moment from "moment";
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from "react-redux";
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";


const TeacherDetail = (props) => {

    const navigation = useNavigation()
    const Inactivity = props?.route?.params?.type != 'inactive'
    const [DetailsData, setDetailsData] = useState(props?.route?.params?.item)
    const TeacherID = props?.route?.params?.id
    const user = useSelector(state => state.AuthReducer?.userInfo)
    const myRecords = useSelector(state => state.AppReducer?.StudentRecords)
    const allTeachers = useSelector(state => state.AppReducer.TeachersList)

    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false)
    const [reason, setreason] = useState('')
    const [selectedCourse, setselectedCourse] = useState('')
    const [selectedDay, setselectedDay] = useState('')
    const [status, setstatus] = useState('')
    const meetID = Math.random().toString().substring(2, 5)

    const Details = [
        {
            id: 3,
            info: DetailsData?.contact,
            name: 'Contact No.',
            icon: <FontAwesome name="phone" size={16} color={Colors?.BLUE} />
        },

        {
            id: 4,
            info: DetailsData?.qualification,
            name: 'Qualification',
            icon: <FontAwesome name="graduation-cap" size={16} color={Colors?.BLUE} />
        },

        {
            id: 5,
            info: DetailsData?.department,
            name: 'Department',
            icon: <FontAwesome name="building" size={16} color={Colors?.BLUE} />
        },
        {
            id: 6,
            info: DetailsData?.teacherRole,
            name: 'Role',
            icon: <FontAwesome5 name="chalkboard-teacher" size={16} color={Colors?.BLUE} />
        }, {
            id: 7,
            info: DetailsData?.designation,
            name: 'Designation',
            icon: <FontAwesome5 name="id-badge" size={16} color={Colors?.BLUE} />
        }, {
            id: 8,
            info: DetailsData?.bio,
            name: 'Bio',
            icon: <AntDesign name="infocirlce" size={16} color={Colors?.BLUE} />
        },
    ]
    useEffect(() => {
        if (TeacherID) {
            fetchDetails()
        }
        if (props?.route?.params?.item?.id) {
            checkRecord(props?.route?.params?.item?.id);
            setDetailsData(props?.route?.params?.item)
        }
    }, [])

   
    const fetchDetails = async () => {
        dispatch(loaderOn())
        let data = allTeachers?.filter(item => item?.id == TeacherID)
        if (data) {
            dispatch(loaderOff())
            setDetailsData(data[0])
            checkRecord(data[0]?.id)
        } else {
            console.log('details not found ');
            dispatch(loaderOff())
        }
    }

    const checkRecord = (teach_id) => {
        const record = myRecords?.filter(item => (item?.teacherDetails?.id == teach_id && (item?.status != 'completed' && item?.status != 'declined')))
        if (record?.length > 0) {
            setselectedCourse(record[0]?.course)
            setselectedDay(record[0]?.day)
            setreason(record[0]?.reason)
            setstatus(record[0]?.status)
        }
    }

    const renderItem = ({ item }) => (
        item?.info ?
            <View style={styles.flex}>

                {item?.icon}

                <View style={{ gap: 3, width: '100%' }}>
                    <Text style={styles.sub_heading}>{item?.name}</Text>
                    <Text style={[styles.text, { lineHeight: 20, width: '90%' }]}>{item?.info}</Text>

                    {
                        item?.moreInfo?.length > 0 ?
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5, width: '95%' }}>
                                {
                                    item?.moreInfo?.map((item, index) => (
                                        <Text style={[styles.text, { backgroundColor: Colors?.BLUE, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, color: Colors?.WHITE }]} key={index}>{item}</Text>
                                    ))
                                }
                            </View>
                            : null
                    }
                </View>
            </View>
            : null
    );

    const onSchduleMeeting = async () => {
        if (!selectedCourse) {
            Alert.alert('Note', 'Please select course')
            return
        }
        if (!selectedDay) {
            Alert.alert('Note', 'Please select day')
            return
        }
        if (!reason) {
            Alert.alert('Note', 'Please enter reason for meeting')
            return
        }
        
        try {
            dispatch(loaderOn())
            const userRef = firestore().collection('users').doc(DetailsData?.id);
            await userRef.update({
                requests: firestore.FieldValue.arrayUnion({
                    course: selectedCourse,
                    day: selectedDay,
                    reason: reason,
                    status: 'pending',
                    studentDetails: user?.data,
                    studentUid: user?.uid,
                    requestID: user?.uid + DetailsData?.id + meetID,
                }),
            });

            const myRef = firestore().collection('users').doc(user?.uid);
            await myRef.update({
                myRecords: firestore.FieldValue.arrayUnion({
                    course: selectedCourse,
                    day: selectedDay,
                    reason: reason,
                    status: 'pending',
                    requestID: user?.uid + DetailsData?.id + meetID,
                    teacherDetails: DetailsData,
                }),
            });
            dispatch(loaderOff())
            setModalVisible(true)
        } catch (error) {
            console.error('Error adding data to Requests array:', error);
            dispatch(loaderOff())
        }
    }

    return (
        <View style={styles.view} >
            <View style={styles.flex}>
                <Ionicons name="chevron-back" size={24} color={Colors?.BLUE} onPress={TeacherID ? () => navigation.reset(
                    {
                        index: 0,
                        routes: [{ name: 'StudentHome' }],
                    }) : () => navigation.goBack()} />
                <Text style={[styles.sub_heading, { marginTop: 0, marginBottom: 0 }]}>Teacher Detail</Text>
            </View>
            <ScrollView>
                <View style={{ flexDirection: "row", alignItems: 'center', gap: 20 }}>
                    <Image source={require('../../assets/teacher.png')} style={{ width: 100, height: 100, marginTop: 50, marginBottom: 35 }} tintColor={Colors?.BLUE} />
                    <Text style={styles.heading}>{DetailsData?.name}</Text>
                </View>

                <FlatList
                    data={Details}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />

                {
                    Inactivity ?
                        <>

                            <Text style={styles.sub_heading}>Select course</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5, width: '95%' }}>
                                {
                                    DetailsData?.courses?.map((item, index) => (
                                        <TouchableOpacity onPress={() => setselectedCourse(item)}
                                            style={{ margin: 4, borderColor: Colors?.BLUE, borderWidth: selectedCourse == item ? 0 : 1, backgroundColor: selectedCourse == item ? Colors?.BLUE : Colors?.WHITE, paddingHorizontal: 20, paddingVertical: 7, borderRadius: 20, }} key={index}>
                                            <Text style={[styles.text, { color: selectedCourse == item ? Colors?.WHITE : Colors?.BLUE }]} >{item}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                                {
                                    DetailsData?.courses?.length == 0 ?
                                        <Text style={styles.text}>No Courses Available</Text>
                                        : null
                                }
                            </View>

                            <Text style={[styles.sub_heading, { marginTop: 10 }]}>Select Day Slot</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5, width: '100%' }}>
                                {
                                    DetailsData?.timeSlots?.map((item, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => setselectedDay(item)}
                                                style={{ margin: 4, alignItems: 'center', borderColor: Colors?.BLUE, borderWidth: selectedDay?.date == item?.date ? 0 : 1, backgroundColor: selectedDay?.date == item?.date ? Colors?.BLUE : Colors?.WHITE, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, }} key={index}>
                                                <Text style={[styles.text, { color: selectedDay?.date == item?.date ? Colors?.WHITE : Colors?.BLUE }]}>{moment(item?.date).format('dddd')}</Text>
                                                <Text style={[styles.text, { color: selectedDay?.date == item?.date ? Colors?.WHITE : Colors?.BLUE, fontSize: 10 }]}>{moment(item?.date).format('DD/MM/YY')}</Text>
                                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                                    <Text style={[styles.text, { color: selectedDay?.date == item?.date ? Colors?.WHITE : Colors?.BLUE, fontSize: 12 }]}>{moment(item?.start_time, 'hh:mm A').format('LT')}</Text>
                                                    <Text style={[styles.text, { color: selectedDay?.date == item?.date ? Colors?.WHITE : Colors?.BLUE }]}> - </Text>
                                                    <Text style={[styles.text, { color: selectedDay?.date == item?.date ? Colors?.WHITE : Colors?.BLUE, fontSize: 12 }]}>{moment(item?.end_time, 'hh:mm A').format('LT')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                                {
                                    DetailsData?.timeSlots?.length == 0 ?
                                        <Text style={styles.text}>No Day Slot Available</Text>
                                        : null
                                }
                            </View>


                            <Text style={[styles.sub_heading, { marginTop: 10 }]}>Reason</Text>
                            <View style={styles.inp1}>
                                <TextInput placeholder="Enter reason statement"
                                    value={reason}
                                    numberOfLines={5}
                                    editable={status == 'pending' || status == 'accepted' || status == 'started' ? false : true}
                                    onChangeText={(e) => setreason(e)}
                                    style={{ textAlignVertical: 'top', color: Colors?.BLACK }}
                                    placeholderTextColor={Colors?.GREY} />
                            </View>

                        </>
                        : null
                }



                <Button title={status == 'pending' ? "Pending" : status == 'accepted' ? "Request Accepted" : status == 'started' ? "Meeting Started" : "Schedule a meeting"}
                    style={{ marginVertical: 20 }}
                    onPress={onSchduleMeeting}
                    disabled={status == 'pending' || status == 'accepted' || status == 'started' ? true : false}
                />
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors?.RGBA }}>
                    <View style={{ width: '80%', paddingVertical: 30, paddingHorizontal: 20, backgroundColor: Colors?.WHITE, borderRadius: 10, alignItems: "center", gap: 8 }}>
                        <FontAwesome name="check-circle" size={80} color={Colors?.BLUE} style={{ marginBottom: 10 }} />
                        <Text style={styles.heading}>Request Sent!</Text>
                        <Text style={styles.text}>Your request to teacher has been sent.</Text>
                        <Button title="OK" style={{ marginTop: 10, width: '60%' }} onPress={() => { setModalVisible(false), navigation.goBack() }} />
                    </View>
                </View>

            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 15,
    },
    flex: {
        flexDirection: 'row',
        gap: 15,
        marginVertical: 15,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    text: {
        color: Colors.DDGREY,
        fontSize: 14,
    },
    sub_heading: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.BLACK,
    },
    inp1: {
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 2,
        gap: 10,
        alignSelf: 'center',
        borderRadius: 10,
        width: '96%',
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        elevation: 2,
        textAlignVertical: 'top',
    },
})

export default TeacherDetail;