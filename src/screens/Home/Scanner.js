import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import { View, Text, StyleSheet } from "react-native";
import { Camera, useCameraDevice, useCodeScanner, } from "react-native-vision-camera";
import { Colors } from "../../config/colors";

const Scanner = () => {
    const device = useCameraDevice('back')
    const navigation = useNavigation();
    if (device == null)
        return <NoCameraErrorView />


    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (code) => {
            navigation.navigate('TeacherDetail', { id: code[0]?.value })
        }
    })

    const NoCameraErrorView = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Camera not found</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>

            <Text style={{ color: Colors?.BLACK, alignSelf: 'center', marginTop: 70, fontSize: 18, fontWeight: 'bold' }}>Scan QR Code to find teacher</Text>

            <Camera
                style={{ height: 500, width: 500, alignSelf: 'center', marginTop: 50 }}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />


        </View>
    );
}

export default Scanner;