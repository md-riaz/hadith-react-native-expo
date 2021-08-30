import React, {useEffect, useState} from "react";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {LinearGradient} from "expo-linear-gradient";
import Button from "./Button";
import Loader from "./Loader";

export default function Histories({onPress, getHistories}) {
    const [histories, setHistories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHistories().then((data) => setHistories(data), setLoading(false));
    }, []);

    if (loading) {
        return <Loader/>
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style='light'/>
                <LinearGradient style={styles.LinearGradient} colors={['#00172d 0%', '#000b18 100%']}>
                    <ScrollView contentContainerStyle={styles.ScrollView}>
                        <Text style={styles.text}>History {Object.keys(histories).length}!</Text>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            {Object.keys(histories).length ? (
                                Object.keys(histories).map((key, index) => {
                                    let history = histories[key];
                                    console.log(history)
                                    return (
                                        <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}} key={index}>
                                            <Text style={styles.text}>Hurray</Text>
                                        </View>
                                    )
                                })
                            ) : (
                                <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}><Text style={styles.text}>হিস্টোরি নাই
                                        বাপু</Text></View>
                                </View>
                            )

                            }
                        </View>
                    </ScrollView>
                </LinearGradient>
                <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center'}}>
                    <Button title='Show Hadith' bgColor='#28a745' color='#fff' onPress={() => onPress()}/>
                </View>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00172d'
    },
    ScrollView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00172d'
    },
    LinearGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Bangla',
        fontSize: 30,
        marginBottom: 20,
        color: '#fff'
    }
});