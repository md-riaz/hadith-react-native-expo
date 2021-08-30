import React from "react";
import {Text, TouchableOpacity, StyleSheet} from "react-native";

export default function Button({onPress, title = '', bgColor = '#28a745', color = '#fff', style={}}) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: bgColor},style]}>
            <Text style={[styles.buttonText, {color: color}]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
    },
})