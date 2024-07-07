import React from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../../config/colors";
import auth from '@react-native-firebase/auth';
import RecordCard from "../../components/RecordCard";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Logout } from "../../redux/actions/AuthActions";
import { useDispatch } from "react-redux";

const VisitorHome = () => {

    const dispatch = useDispatch();
    const renderItem = ({ item, index }) => (
        <RecordCard item={item} index={index} active={true} />
    )

    return (
        <View style={styles.view}>
            <View style={styles.flex}>
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

            <Text style={styles.sub_heading}>Explore Teachers</Text>
            <FlatList
                data={[1, 2, 3, 4, 5]}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ fontSize: 16, color: Colors?.GREY }}>No Teacher Found</Text>
                    </View>
                )}
            />

        </View>
    )
}

export default VisitorHome;

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
        justifyContent: 'space-between',
        gap: 10,
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

    }
})

