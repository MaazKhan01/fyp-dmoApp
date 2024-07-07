import React from "react";
import { View, StyleSheet,  Text, FlatList,  } from "react-native";
import { Colors } from "../../config/colors";
import RecordCard from "../../components/RecordCard";
import { useSelector } from "react-redux";

const StudentRecords = () => {

    const myRecords = useSelector(state => state.AppReducer?.StudentRecords?.filter((item) => {
        return item?.status == 'completed' || item?.status == 'declined'
    }))

    const renderItem = ({ item, index }) => {
        return (
            <RecordCard item={item} index={index} />
        )
    }

    return (
        <View style={styles.view}>
            <Text style={styles.sub_heading}>Past Records</Text>
            <FlatList
                data={myRecords}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ fontSize: 16, color: Colors?.GREY }}>No Past Records </Text>
                    </View>
                )}
            />
        </View>
    )
}

export default StudentRecords;

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

