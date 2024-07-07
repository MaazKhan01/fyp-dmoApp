import React, { useEffect, useState } from "react";

import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity, RefreshControl, TextInput, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import { Colors } from "../../config/colors";
import ProfileImage from '../../assets/teacher.png'
import RequestCard from "../../components/RequestCard";
import { useDispatch, useSelector } from "react-redux";
import { loaderOff, loaderOn, teacherRecords } from "../../redux/actions/AppAction";
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const TeacherHome = () => {
    const navigation = useNavigation()
    const userName = useSelector(state => state.AuthReducer.userInfo?.data?.name)
    const user = useSelector(state => state.AuthReducer.userInfo)
    const dispatch = useDispatch();
    const [requests, setRequests] = useState([]);
    const [ssearch, setssearch] = useState('');
    const renderItem = ({ item, index }) => {
        return (
            <RequestCard item={item} index={index} active={true} />
        )
    }
    useFocusEffect(
        React.useCallback(() => {
            fetchRequests();
        }, [navigation])
    );

    const fetchRequests = async () => {
        try {
            dispatch(loaderOn());
            const userRef = firestore().collection('users').doc(user?.uid)
            const reqData = await userRef.get()
            if (reqData) {
                const response = reqData.data();
                let currReq = response?.requests?.filter((item) => {
                    return item?.status != 'completed'
                })
                let completedReq = response?.requests?.filter((item) => {
                    return item?.status == 'completed'
                })
                setRequests(currReq);
                dispatch(teacherRecords(completedReq))
                dispatch(loaderOff());
            } else {
                console.log('User document not found ');
                dispatch(loaderOff());
            }
        }
        catch (e) {
            Alert.alert('Error', e.message);
            dispatch(loaderOff());

        }
    }

    return (
        <View style={styles.view}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>

                <View>
                    <Text style={{ fontSize: 14, color: Colors?.DGREY }}>Welcome to DMO ,</Text>
                    <Text style={styles.heading}>{userName ? userName : 'Teacher'} !</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={ProfileImage} style={{ width: 40, height: 40, borderRadius: 50 }} tintColor={Colors?.BLUE} />
                </TouchableOpacity>
            </View>

            <Text style={styles.sub_heading}>Upcoming Requests</Text>
            <View style={[styles.inp1, { marginVertical: 20 }]}>
                <FontAwesome name='search' size={20} color={Colors.DGREY} />
                <TextInput placeholder="search student" style={styles.inputtxt}
                    value={ssearch}
                    onChangeText={
                        (e) => {
                            setssearch(e);
                            if (e == '') {
                                fetchRequests();
                            } else {
                                let filteredRequests = requests.filter((item) => {
                                    return item?.studentDetails?.name?.toLowerCase().includes(e.toLowerCase())
                                })
                                setRequests(filteredRequests)

                            }
                        }
                    }
                    placeholderTextColor={Colors?.DGREY} />
            </View>
            <FlatList
                data={requests}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={fetchRequests}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ fontSize: 16, color: Colors?.GREY }}>no upcoming requests</Text>
                    </View>
                )}
            />

        </View>
    )
}

export default TeacherHome;

const styles = StyleSheet.create({
    view: {
        flex: 1,
        padding: 25,
        backgroundColor: Colors?.WHITE,
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontSize: 13,
        color: Colors?.BLACK,
    },
    heading: {
        fontSize: 26,
        color: Colors?.BLACK,
    },
    sub_heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors?.BLACK,
        marginTop: 30,
        marginBottom: 10,
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
})

