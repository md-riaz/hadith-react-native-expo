import { StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import React from "react";
import Button from './Button'

export default function TryAgain({getHadith}) {
    return (
        <View style={styles.container}>
            <StatusBar style='auto'/>
            <Text style={[styles.text]}>সমস্যার জন্য দুঃখিত। আবার চেষ্টা করুন</Text>
            <Button title='Try Now' bgColor='#28a745' color='#fff' onPress={getHadith}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'AdorshoLipi',
        fontSize: 20,
        marginBottom: 20
    }
});