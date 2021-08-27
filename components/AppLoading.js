import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import React from "react";


export default function AppLoading () {
    return (
        <View style={styles.container}>
            <StatusBar style='auto' />
            <ActivityIndicator size='large' color='#28a745' />
            <Text style={[{ marginTop: 20, fontSize: 20 }, styles.text]}>আইতাছি...</Text>
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
        fontFamily: 'AdorshoLipi'
    }
});