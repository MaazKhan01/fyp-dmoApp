import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../../config/colors";

const Disconnected = (props) => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors?.WHITE }}>
            <MaterialIcons name="wifi-off" size={100} color={Colors?.BLACK} />
            <Text
                style={{ color: Colors?.BLACK, fontSize: 20, marginTop: 50, fontWeight: 'bold', lineHeight: 35, textAlign: 'center', width: '80%' }}
            >{"You're not connected to the internet"}</Text>

            <Text
                style={{ color: Colors?.BLACK, fontSize: 14, textAlign: 'center', bottom: -250 }}
            >{'Please check your internet connection and try again'}</Text>
        </View>
    );


}


export default Disconnected;
