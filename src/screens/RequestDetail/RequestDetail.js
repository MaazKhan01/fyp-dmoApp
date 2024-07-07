import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from "../../components/button";
import { Colors } from "../../config/colors";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import firestore from '@react-native-firebase/firestore';
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";

const RequestDetail = (props) => {
    const Inactivity = props?.route?.params?.type != 'inactive'
    const navigation = useNavigation()
    const RequestDetailsData = props?.route?.params?.item

    const [status, setStatus] = useState(RequestDetailsData?.status)
    const userID = useSelector((state) => state.AuthReducer.userInfo?.uid);
    const dispatch = useDispatch();




    const updateRequestStatus = async (newStatus, msg, back) => {
        try {
            dispatch(loaderOn());
            const docRef = firestore().collection('users').doc(userID)
            const reqData = await docRef.get();
            const { requests } = reqData.data()
            const requestIndex = requests.findIndex(item => item?.requestID === RequestDetailsData?.requestID);

            const st_docRef = firestore().collection('users').doc(RequestDetailsData?.studentUid)
            const st_reqData = await st_docRef.get();
            const { myRecords } = st_reqData.data()
            const recordIndex = myRecords.findIndex(item => item?.requestID === RequestDetailsData?.requestID);

            if (requestIndex != -1) {
                requests[requestIndex].status = newStatus;
                await docRef.update({ requests });

                if (recordIndex != -1) {
                    myRecords[recordIndex].status = newStatus;
                    await st_docRef.update({ myRecords });
                }
                Alert.alert('Note', msg)
                setStatus(newStatus)
                dispatch(loaderOff())

            }

            if (back) {
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error updating request status:', error.message);
            dispatch(loaderOff());
            Alert.alert('Error', 'Error in updating request status');
        }
    };

    const declineRequest = async () => {
        try {
            dispatch(loaderOn());
            const docRef = firestore().collection('users').doc(userID)
            const reqData = await docRef.get();
            const { requests } = reqData.data()
            const requestIndex = requests.findIndex(item => item?.requestID == RequestDetailsData?.requestID);

            const st_docRef = firestore().collection('users').doc(RequestDetailsData?.studentUid)
            const st_reqData = await st_docRef.get();
            const { myRecords } = st_reqData.data()
            const recordIndex = myRecords.findIndex(item => item?.requestID == RequestDetailsData?.requestID);

            if (requestIndex != -1) {
                requests.splice(requestIndex, 1);
                await docRef.update({ requests });

                if (recordIndex != -1) {
                    myRecords[recordIndex].status = 'declined';
                    await st_docRef.update({ myRecords });
                }

                Alert.alert('Note', 'Request Declined!')
                dispatch(loaderOff())
                navigation.goBack();
            }
           
        } catch (error) {
            dispatch(loaderOff());
            Alert.alert('Error', 'Error in declining request');
        }
    };

    return (
        <View style={styles.view}>
            <ScrollView style={{ flex: 1 }}>
                <View style={[styles.flex, { marginVertical: 0, marginBottom: 30 }]}>
                    <Ionicons name="chevron-back" size={24} color={Colors?.BLUE} onPress={() => navigation.goBack()} />
                    <Text style={[styles.sub_heading, { marginTop: 0, marginBottom: 0 }]}>Request From </Text>
                </View>

                <View style={styles.flex}>
                    <Image source={require('../../assets/student.png')} style={{ width: 80, height: 80, }} tintColor={Colors?.BLUE} />
                    <Text style={styles.heading}>{RequestDetailsData?.studentDetails?.name}</Text>
                </View>

                <Text style={styles.sub_heading}>Course</Text>
                <Text style={styles.text}>{RequestDetailsData?.course}</Text>

                <Text style={styles.sub_heading}>Day</Text>
                <Text style={styles.text}>{`${moment(RequestDetailsData?.day?.date).format('dddd')}  (${moment(RequestDetailsData?.day?.date).format('DD/MM/YY')})`}</Text>

                <Text style={styles.sub_heading}>Time Slot</Text>
                <Text style={styles.text}>{`From  ${RequestDetailsData?.day?.start_time}  to  ${RequestDetailsData?.day?.end_time}`}</Text>


                <Text style={styles.sub_heading}>Reason for meeting</Text>
                <Text style={styles.text}>{RequestDetailsData?.reason}</Text>
            </ScrollView>
            {
                Inactivity ?
                    (
                        status == 'pending' ?
                            <View style={styles.flexA}>
                                <Button title="Decline" style={styles.button} onPress={declineRequest} />
                                <Button title="Accept" style={styles.button} onPress={() => updateRequestStatus('accepted', 'Request Accepted!')} />
                            </View>
                            :
                            status == 'accepted' ?
                                <Button title="Start Meeting" onPress={() => updateRequestStatus('started', 'Meeting Started!')} style={{ width: '100%', backgroundColor: Colors?.GREEN }} />
                                :
                                status == 'started' ?
                                    <Button title="End Meeting" onPress={() => updateRequestStatus('completed', 'Meeting Ended!', true)} style={{ width: '100%', backgroundColor: Colors?.RED }} />
                                    :
                                    <Button title="Meeting Completed" style={{ width: '100%', backgroundColor: Colors?.BLUE }} />
                    )
                    :
                    <Button title="Delete Record" />

            }


        </View>
    )
}

export default RequestDetail;

const styles = StyleSheet.create({
    view: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors?.WHITE

    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 15,
    },
    flexA: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    text: {
        fontSize: 13,
        color: Colors?.BLACK,
        lineHeight: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors?.BLACK,
    },
    sub_heading: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors?.BLACK,
        marginTop: 20,
        marginBottom: 5,
    },
    button: {
        width: '40%'
    }
})

