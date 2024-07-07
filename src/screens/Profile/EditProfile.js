import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, FlatList, Alert } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button";
import { Colors } from "../../config/colors";
import SelectDropdown from 'react-native-select-dropdown'
import DatePicker from "react-native-date-picker";
import ImagePicker from 'react-native-image-crop-picker';
import StudentPic from '../../assets/student.png'
import TeacherPic from '../../assets/teacher.png'
import { useDispatch, useSelector } from "react-redux";
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { Calendar, LocaleConfig } from 'react-native-calendars';

const EditProfile = (props) => {

    const user = useSelector((state) => state.AuthReducer.userInfo?.data);
    const userID = useSelector((state) => state.AuthReducer.userInfo?.uid);
    const [name, setname] = useState(user?.name ? user?.name : null)
    const [contact, setcontact] = useState(user?.contact ? user?.contact : null)
    const [designation, setdesignation] = useState(user?.designation ? user?.designation : null)
    const [department, setdepartment] = useState(user?.department ? user?.department : null)
    const [qualification, setqualification] = useState(user?.qualification ? user?.qualification : null)
    const [bio, setbio] = useState(user?.bio ? user?.bio : null)
    const [teacherRole, setteacherRole] = useState(user?.teacherRole ? user?.teacherRole : null)
    const [selectedDays, setselectedDays] = useState([])
    const [image, setimage] = useState(null)
    const [start_time, setstart_time] = useState(null)
    const navigation = useNavigation()
    const [end_time, setend_time] = useState(null)
    const [courseName, setcourseName] = useState(null)
    const [courseList, setcourseList] = useState(user?.courses ? user?.courses : [])
    const [studentID, setstudentID] = useState(user?.studentID ? user?.studentID : null)
    const dispatch = useDispatch()

    const [profileImageURL, setprofileImageURL] = useState(null)
    const [startTimeModal, setstartTimeModal] = useState(false)
    const [endTimeModal, setendTimeModal] = useState(false)
    const [date, setDate] = useState(new Date());
    const [selected, setSelected] = useState('');
    const [timeSlots, setTimeSlots] = useState(user?.timeSlots ? user?.timeSlots : [])


    const updateTeacherProfile = async () => {
        dispatch(loaderOn())
        // if (image) {
        //     fetchImageURL()
        // }
        await firestore().collection('users').doc(userID).update({
            profileDetails: {
                ...user,
                name: name,
                contact: contact,
                department: department,
                bio: bio,
                designation: designation,
                qualification: qualification,
                teacherRole: teacherRole,
                timeSlots: timeSlots,
                courses: courseList,
                profileImage: profileImageURL ? profileImageURL : null,
            }
        })
            .then(() => {
                Alert.alert('Note', 'Profile updated successfully!')
                dispatch(loaderOff())
                navigation.goBack()
            }).catch((e) => {
                console.log(e);
                dispatch(loaderOff())
            })
    }


    const updateStudentProfile = () => {
        dispatch(loaderOn())
        firestore().collection('users').doc(userID).update({
            profileDetails: {
                ...user,
                name: name,
                contact: contact,
                department: department,
                studentID: studentID,
                profileImage: image,
            }
        }).then(() => {
            Alert.alert('Note', 'Profile updated successfully!')
            dispatch(loaderOff())
            navigation.goBack()
        }).catch((e) => {
            console.log(e);
            dispatch(loaderOff())
        })
    }

    const fetchImageURL = async () => {
        let pth = image?.path?.split('/')
        const name = pth[pth?.length - 1]
        const storageRef = storage().ref(`photos/${name}`);

        try {
            await storageRef.putFile(image?.path);
            const url = await storageRef.getDownloadURL();
            setprofileImageURL(url)
        } catch (error) {
            console.error('Error ', error);
            return null;
        }
    };

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
        }).then(image => {
            setimage(image)
        }).catch((e) => {
            console.log(e);
        })
    }



    return (
        <View style={styles.view} >
            <View style={styles.flex}>
                <Ionicons name="chevron-back" size={24} color={Colors?.BLUE} onPress={() => navigation.goBack()} />
                <Text style={[styles.sub_heading, { marginTop: 0, marginBottom: 0 }]}>Edit Profile </Text>
            </View>

            <ScrollView>

                <Image source={image ? { uri: image?.path } : (user?.userRole == 'student' ? StudentPic : TeacherPic)} style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 50, marginBottom: 15 }} tintColor={image ? null : Colors?.BLUE} />
                {/* <TouchableOpacity onPress={openGallery} style={{ backgroundColor: Colors.BLUE, borderRadius: 5, width: 100, padding: 8, marginBottom: 20, alignSelf: 'center' }}>
                    <Text style={{ color: Colors.WHITE, fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>Upload image</Text>
                </TouchableOpacity> */}

                <Text style={styles.text}>Name</Text>
                <View style={styles.inp1}>
                    <MaterialCommunityIcons name="account" size={16} color={Colors?.DGREY} />
                    <TextInput placeholder="Enter name" style={styles.inputtxt}
                        value={name}
                        onChangeText={(e) => setname(e)}
                        placeholderTextColor={Colors?.GREY} />
                </View>


                <Text style={styles.text}>Contact No.</Text>
                <View style={styles.inp1}>
                    <FontAwesome name="phone" size={16} color={Colors?.DGREY} />
                    <TextInput placeholder="Enter contact no" style={styles.inputtxt}
                        value={contact}
                        keyboardType="number-pad"
                        onChangeText={(e) => setcontact(e)}
                        placeholderTextColor={Colors?.GREY} />
                </View>

                <Text style={styles.text}>Department</Text>
                <View style={styles.inp1}>
                    <FontAwesome name="building" size={16} color={Colors?.DGREY} />
                    <TextInput placeholder="Enter department" style={styles.inputtxt}
                        value={department}
                        onChangeText={(e) => setdepartment(e)}
                        placeholderTextColor={Colors?.GREY} />
                </View>

                {
                    user?.userRole == 'student' ?
                        <>
                            <Text style={styles.text}>Student ID</Text>
                            <View style={styles.inp1}>
                                <FontAwesome5 name="id-badge" size={16} color={Colors?.DGREY} />
                                <TextInput placeholder="Enter student id" style={styles.inputtxt}
                                    value={studentID}
                                    onChangeText={(e) => setstudentID(e)}
                                    placeholderTextColor={Colors?.GREY} />
                            </View>
                        </>
                        : null
                }

                {
                    user?.userRole == 'teacher' ?

                        <>
                            <Text style={styles.text}>Bio</Text>
                            <View style={styles.inp1}>
                                <AntDesign name="infocirlce" size={16} color={Colors?.DGREY} />
                                <TextInput placeholder="Enter bio" style={styles.inputtxt}
                                    value={bio}
                                    onChangeText={(e) => setbio(e)}
                                    placeholderTextColor={Colors?.GREY} />
                            </View>

                            <Text style={styles.text}>Designation</Text>
                            <View style={styles.inp1}>
                                <FontAwesome5 name="id-badge" size={16} color={Colors?.DGREY} />
                                <TextInput placeholder="Enter designation" style={styles.inputtxt}
                                    value={designation}
                                    onChangeText={(e) => setdesignation(e)}
                                    placeholderTextColor={Colors?.GREY} />
                            </View>

                            <Text style={styles.text}>Qualification</Text>
                            <View style={styles.inp1}>
                                <FontAwesome name="graduation-cap" size={16} color={Colors?.DGREY} />
                                <TextInput placeholder="Enter qualification" style={styles.inputtxt}
                                    value={qualification}
                                    onChangeText={(e) => setqualification(e)}
                                    placeholderTextColor={Colors?.GREY} />
                            </View>

                            <Text style={styles.text}>Role</Text>
                            <SelectDropdown
                                data={["Internal", "External"]}
                                defaultButtonText={teacherRole ? teacherRole : "Select teacher role"}
                                buttonStyle={styles.inp1}
                                buttonTextStyle={{
                                    fontSize: 14,
                                    color: Colors.DGREY
                                }}

                                onSelect={(selectedItem, index) => {
                                    setteacherRole(selectedItem)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />

                            <Text style={styles.text}>Add Courses</Text>
                            <View style={styles.inp1}>
                                <Entypo name="book" size={16} color={Colors?.DGREY} />
                                <TextInput placeholder="Enter course name" style={[styles.inputtxt, { width: '80%' }]}
                                    value={courseName}
                                    onChangeText={(e) => setcourseName(e)}
                                    placeholderTextColor={Colors?.GREY} />
                                <TouchableOpacity onPress={() => {
                                    setcourseList([...courseList, courseName]),
                                        setcourseName(null)
                                }}>

                                    <FontAwesome5 name="plus" size={16} color={Colors?.BLUE} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={courseList}
                                horizontal
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ flexDirection: "row", alignItems: 'center', gap: 10, margin: 10 }}>
                                            <Text style={styles.span}>{item}</Text>
                                            <TouchableOpacity onPress={() => setcourseList(courseList.filter((i) => i != item))}>
                                                <Entypo name="cross" size={16} color={Colors?.BLUE} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />

                            <Text style={styles.text}>Select Day</Text>

                            <Calendar
                                style={{
                                    height: 350
                                }}
                                current={date}
                                onDayPress={day => {
                                    if (selected?.dateString == day.dateString) {
                                        setSelected(null)
                                    }
                                    else {
                                        setSelected(day)
                                    }
                                }}
                                markedDates={
                                    selected ? {
                                        [selected?.dateString]: { selected: true, selectedColor: Colors?.RGBA }
                                    } : null
                                }


                            />

                            <Text style={styles.text}>Select Available Time</Text>
                            <View style={styles.flexA}>
                                <TouchableOpacity style={[styles.inp1, { width: '45%' }]} onPress={() => setstartTimeModal(true)}>
                                    <Ionicons name='time' size={18} color={Colors.DGREY} style={styles.icon} />
                                    <TextInput placeholder="Start time" style={[styles.inputtxt, { width: '75%' }]}
                                        value={start_time ? moment(start_time, 'hh:mm A').format("LT") : 'Start time'}
                                        editable={false}
                                        onChangeText={(e) => setstart_time(e)}
                                        placeholderTextColor={Colors?.GREY} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.inp1, { width: '45%' }]} onPress={() => setendTimeModal(true)}>
                                    <Ionicons name='time' size={18} color={Colors.DGREY} style={styles.icon} />
                                    <TextInput placeholder="End time" style={[styles.inputtxt, { width: '75%' }]}
                                        value={end_time ? moment(end_time, 'hh:mm A').format("LT") : 'End Time'}
                                        editable={false}
                                        onChangeText={(e) => setend_time(e)}
                                        placeholderTextColor={Colors?.GREY} />
                                </TouchableOpacity>
                            </View>


                            <TouchableOpacity onPress={
                                () => {
                                    if (!selected) {
                                        Alert.alert('Note', 'Please select day!')
                                    }
                                    else if (!start_time || !end_time) {
                                        Alert.alert('Note', 'Please select start and end time!')
                                    } else if (
                                        timeSlots.filter((i) => i?.date == selected?.dateString).length > 0
                                    ) {
                                        Alert.alert('Note', 'Slot already exists for this day!')
                                    }
                                    else {


                                        let a = [...timeSlots]
                                        a.push({
                                            start_time: moment(start_time, 'hh:mm A').format("LT"),
                                            end_time: moment(end_time, 'hh:mm A').format("LT"),
                                            date: selected?.dateString,
                                        })
                                        setTimeSlots(a)
                                        setstart_time(null)
                                        setend_time(null)
                                        setSelected(null)
                                    }
                                }}

                                style={{ backgroundColor: Colors?.BLUE, borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center', width: 85, height: 35, alignSelf: 'flex-end' }}>
                                <Text style={{ color: Colors?.WHITE }} >Set Slot</Text>
                            </TouchableOpacity>

                            <Text style={styles.text}>Available Slots</Text>
                            <View>
                                <FlatList
                                    data={timeSlots}
                                    renderItem={({ item }) => {
                                        let isExist = selectedDays.includes(item?.name)
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                if (isExist) {
                                                    setselectedDays(selectedDays.filter((i) => i != item?.name))
                                                } else {
                                                    setselectedDays([...selectedDays, item?.name])
                                                }
                                            }} style={[styles.days_item, { backgroundColor: isExist ? Colors?.BLUE : Colors?.WHITE, alignItems: 'center', gap: 3 }]}>
                                                <View style={[styles.flex, { gap: 5 }]}>
                                                    <Text style={[styles.days_text, { color: isExist ? Colors?.WHITE : Colors?.BLUE }]}>{moment(item?.date).format('dddd')}</Text>
                                                    <Text style={[{ fontSize: 8, color: isExist ? Colors?.WHITE : Colors?.BLUE }]}>({moment(item?.date).format('D-MMM-yy')})</Text>
                                                </View>
                                                <View style={[styles.flex, { gap: 5 }]}>
                                                    <Text style={[styles.days_text, { color: isExist ? Colors?.WHITE : Colors?.BLUE }]}>{moment(item?.start_time, 'hh:mm A').format('LT')}</Text>
                                                    <Text style={[styles.days_text, { color: isExist ? Colors?.WHITE : Colors?.BLUE }]}>to</Text>
                                                    <Text style={[styles.days_text, { color: isExist ? Colors?.WHITE : Colors?.BLUE }]}>{moment(item?.end_time, 'hh:mm A').format('LT')}</Text>
                                                </View>

                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    ListEmptyComponent={
                                        <Text style={{ fontSize: 14, color: Colors?.GREY, marginLeft: 120, marginVertical: 20 }}>no available slots</Text>
                                    }
                                    showsHorizontalScrollIndicator={true}
                                />

                            </View>
                        </>
                        : null
                }


                <Button title="Save" onPress={user?.userRole == 'teacher' ? updateTeacherProfile : updateStudentProfile} style={{ marginVertical: 20 }} />
            </ScrollView>

            <DatePicker
                modal
                mode="time"
                open={startTimeModal}
                date={date}
                onConfirm={(res) => {
                    setstartTimeModal(false)
                    setstart_time(res)
                }}
                onCancel={() => {
                    setstartTimeModal(false)
                }}
            />

            <DatePicker
                minimumDate={start_time}
                modal
                mode="time"
                open={endTimeModal}
                date={date}
                onConfirm={(res) => {

                    setendTimeModal(false)
                    setend_time(res)
                }}
                onCancel={() => {
                    setendTimeModal(false)
                }}
            />

        </View >
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
        alignItems: 'center',
        gap: 15,
    },
    flexA: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: Colors.BLUE,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: "center",
        marginVertical: 20,
        width: '100%',
        paddingVertical: 15,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    span: {
        fontSize: 14,
        color: Colors.BLACK
    },
    text: {
        margin: 10,
        fontSize: 14,
        color: Colors.BLACK
    },
    sub_heading: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.BLACK,
    },
    inp1: {
        marginBottom: 15,
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
    days_item: {
        borderColor: Colors?.BLUE,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        marginHorizontal: 5,
        marginVertical: 10

    },
    days_text: {
        fontSize: 13,
    },
    inputtxt: {
        width: '80%',
        color: Colors.BLACK,
    },
})

export default EditProfile;