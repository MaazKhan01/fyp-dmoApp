import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../config/colors";

const SplashScreen = (props) => {

    const navigation = useNavigation();

    useEffect(() => {
        const timeOut = setTimeout(navigateToHome, 4000)

        return () => clearTimeout(timeOut)
    }, [])

    const navigateToHome = () => {
        navigation.navigate('BottomTabs')
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors?.BLUE }}>
            <Image source={require('../../assets/icon.jpg')} style={{ width: 150, height: 150, position: "absolute", top: 150 }} />
            <Text
                style={{ color: Colors?.WHITE, fontSize: 20, marginTop: 50, fontWeight: 'bold', lineHeight: 35, textAlign: 'center', width: '80%' }}
            >{'Welcome to \n Digital Meet Online'}</Text>

            <Text
                style={{ color: Colors?.WHITE, fontSize: 14, textAlign: 'center', bottom: -250 }}
            >{'Powered by MUA'}</Text>

        </View>
    );


}


export default SplashScreen;
