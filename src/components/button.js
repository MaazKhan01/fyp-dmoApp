import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from "../config/colors";



const Button = (props) => {
    return (
        <TouchableOpacity
            disabled={props?.disabled}
            style={[styles.button,
                 { backgroundColor: props?.light ? Colors?.LIGHT : Colors?.BLUE }
                , { ...props?.style }]} onPress={props?.onPress}>
            <Text style={[styles.text, { color: props?.light ? Colors?.BLUE : Colors?.WHITE }, { ...props?.text_style }]}>{props?.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: "center",
        alignSelf: 'center',
        width: '90%',
        paddingVertical: 13,
    },
})

export default Button;