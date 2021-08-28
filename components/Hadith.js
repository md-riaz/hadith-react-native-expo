import {StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import React from "react";


export default function Hadith({ hadith, setCurrentComp }) {
    return (
        <View style={styles.container}>
            <Text>{hadith.hadithBengali}</Text>
            <StatusBar style='auto'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'AdorshoLipi'
    }
});