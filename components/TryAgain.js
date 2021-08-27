import {ActivityIndicator, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import React from "react";

export default function TryAgain() {
    return (
        <View>
            <StatusBar style='auto'/>
            <ActivityIndicator size='large' color='#28a745'/>
            <Text style={[{marginTop: 20, fontSize: 20}]}>সমস্যা হইসে...</Text>
        </View>
    );
}