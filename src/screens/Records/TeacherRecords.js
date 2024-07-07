import React from "react";
import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity } from "react-native";
import { Colors } from "../../config/colors";
import RequestCard from "../../components/RequestCard";
import { useSelector } from "react-redux";

const TeacherRecords = () => {

    const recordsList = useSelector(state => state.AppReducer?.TeacherRecords)
    const renderItem = ({ item, index }) => {
        return (
            <RequestCard item={item} index={index} />
        )
    }


    return (
        <View style={styles.view}>
            <Text style={styles.sub_heading}>Past Records</Text>
            <FlatList
                data={recordsList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ fontSize: 16, color: Colors?.GREY }}>no past requests </Text>
                    </View>
                )}
            />
        </View>
    )
}

export default TeacherRecords;

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
        marginBottom: 10,
    }
})

