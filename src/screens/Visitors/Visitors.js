import React, { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../config/colors";
import Clipboard from "@react-native-clipboard/clipboard";
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from "react-redux";
import { loaderOff, loaderOn } from "../../redux/actions/AppAction";

const Visitors = () => {


    const [visitorList, setVisitorList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchVisitors();
    }, [])

    const fetchVisitors = (e = null) => {
        dispatch(loaderOn());
        if (e) {
            setVisitorList([]);
        }
        const usersRef = firestore().collection('users')
        const visitorUsersQuery = usersRef.where('profileDetails.userRole', '==', 'visitor');
        visitorUsersQuery.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const response = doc.data();
                    setVisitorList(arr => [...arr, response?.profileDetails]);
                });
            })
            .catch((error) => {
                console.error('Error getting documents: ', error);
            }).finally(() => {
                dispatch(loaderOff());
            });
    }

    const navigation = useNavigation();
    const [currItem, setcurrItem] = useState(null);

    // const DeleteVisitor = async (userId) => {
    //     dispatch(loaderOn());
    //     try {
    //         const usersRef = firestore().collection('users');
    //         await usersRef.doc(userId).delete();
    //         // auth().deleteUser(userId)
    //         fetchVisitors(true);
    //         Alert.alert('Visitor Deleted Successfully');
    //         dispatch(loaderOff());
    //     } catch (error) {
    //         console.error('Error deleting Visitor: ', error);
    //         Alert.alert('Error deleting Visitor. Please try again.');
    //         dispatch(loaderOff());
    //     }
    // };


    return (
        <View style={styles.view}>
            <Text style={styles.heading}>Visitors</Text>
            <FlatList
                data={visitorList}
                renderItem={({ item }) => {
                    let e = currItem === item?.email ? true : false;
                    return (
                        <View style={styles.card}>
                            <View style={[styles.flex, { justifyContent: 'space-between' }]}>
                                <Text style={styles.sub_heading}>{item?.name}</Text>
                                <TouchableOpacity onPress={() => e ? setcurrItem(null) : setcurrItem(item.email)}>
                                    <MaterialIcons name={e ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={23} color={Colors?.BLACK} />
                                </TouchableOpacity>
                            </View>
                            {
                                e && (
                                    <>
                                        <View style={styles.flex}>
                                            <FontAwesome name='envelope-o' size={13} color={Colors.BLACK} />
                                            <Text style={styles.text}>{item?.email}</Text>
                                        </View>
                                        <View style={[styles.flex, { justifyContent: 'space-between' }]}>
                                            <View style={styles.flex}>
                                                <Feather name='lock' size={13} color={Colors.BLACK} />
                                                <Text style={styles.text}>{item?.password}</Text>
                                            </View>
                                            <View style={styles.flex}>
                                                <TouchableOpacity onPress={() => {
                                                    Clipboard.setString(item?.password, item?.email);
                                                    Alert.alert("Note", "Password copied to clipboard")
                                                }} >
                                                    <MaterialCommunityIcons name='content-copy' size={23} color={Colors?.DGREY} />
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity onPress={()=> DeleteVisitor(item?.id)}>
                                                    <MaterialCommunityIcons name='trash-can-outline' size={23} color={Colors?.RED} />
                                                </TouchableOpacity> */}
                                            </View>
                                        </View>
                                    </>
                                )
                            }

                        </View>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        colors={[Colors?.BLUE]}
                        refreshing={false}
                        onRefresh={() => fetchVisitors(e = true)}
                    />
                }
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: Colors?.GREY }}>no visitors yet</Text>
                    </View>
                }
            />

            <TouchableOpacity onPress={() => navigation.navigate('CreateVisitor')} style={{ position: "absolute", bottom: 10, right: 20 }}>
                <MaterialCommunityIcons name="plus-box" size={55} color={Colors?.BLUE} />
            </TouchableOpacity>
        </View>
    );
}

export default Visitors;


const styles = StyleSheet.create({

    view: {
        flex: 1,
        backgroundColor: Colors?.WHITE,
        padding: 25,
    },
    card
        : {
        backgroundColor: Colors?.WHITE,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 3,
        borderRadius: 10,
        elevation: 2,
        gap: 3
    },
    heading: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors?.BLACK,
        marginBottom: 20,
    },
    sub_heading: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors?.BLACK,
        marginBottom: 5,
    },
    text: {
        fontSize: 13,
        color: Colors?.BLACK
    },
    flex: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8

    },
})