import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppScreens from './AppScreens';
import AuthScreens from './AuthScreens';
import { userExist, userInfo } from '../redux/actions/AuthActions';
import { ActivityIndicator, Modal, View } from 'react-native';
import { Colors } from '../config/colors';
import firestore from '@react-native-firebase/firestore';


export default Navigation = () => {

    const dispatch = useDispatch();
    const USER = useSelector(state => state.AuthReducer.userExist)
    const loading = useSelector(state => state.AppReducer.loading)

    useEffect(() => {
        setTimeout(async () => {
            let e = await AsyncStorage.getItem('@user')
            if (e != null) {
                dispatch(userExist(true))
                const userdata = JSON.parse(e)
                fetchUserData(userdata?.uid)
            } else {
                dispatch(userExist(false))
            }
        }, 1000);
    }, [USER])

    const fetchUserData = async (uid) => {
        try {
            const userDocRef = firestore().collection('users').doc(uid);
            const userDoc = await userDocRef.get();

            if (userDoc) {
                const userData = userDoc.data();
                dispatch(userInfo({ uid: uid, data: userData?.profileDetails }))
            } else {
                console.log('User document not found in Firestore');
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {
                    USER ?
                        <AppScreens />
                        : <AuthScreens />
                }



                <Modal visible={loading} transparent >
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color={Colors?.WHITE} />
                    </View>
                </Modal>


            </NavigationContainer>
        </SafeAreaProvider>
    );
}