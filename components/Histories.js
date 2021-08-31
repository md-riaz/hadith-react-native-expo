import React, {useEffect, useState} from "react";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {LinearGradient} from "expo-linear-gradient";
import Button from "./Button";
import Loader from "./Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Histories({handleHadithBtn, getHistories, getThisHadith}) {
    const [histories, setHistories] = useState({});
    const [loading, setLoading] = useState(true);

    // on delete history click
    const deleteHistory = async function () {
        try {
            await AsyncStorage.removeItem('@histories');
            setHistories({});
        } catch (e) {
            alert(e);
        }

        console.log('Done.')
    }

    useEffect(() => {
        getHistories().then((data) => {
            data = Object.keys(data).reduce((obj, k) => {
                if (data[k] != null && typeof data[k] === 'object') obj[k] = data[k];
                return obj;
            }, {});
            setHistories(data);
            setLoading(false);
        });

    }, []);

    if (loading) {
        return <Loader/>
    } else {

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style='light'/>
                <LinearGradient style={styles.LinearGradient} colors={['#00172d 0%', '#000b18 100%']}>
                    <ScrollView contentContainerStyle={styles.ScrollView}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            {Object.keys(histories).length ? (
                                Object.keys(histories).map((key, index) => {
                                    let history = histories[key];
                                    return (
                                        <View style={{
                                            flex: 1,
                                            textAlign: 'left',
                                            justifyContent: 'center',
                                            marginBottom: 10
                                        }}
                                              key={index}>
                                            <Text style={styles.text}  onPress={() => getThisHadith(history.hadithNo, history.uri)}>{history?.topic ?? history.hadithNo}</Text>
                                        </View>
                                    )
                                })
                            ) : (
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.noHistory}>হিস্টোরি নাই বাপু</Text>
                                </View>
                            )

                            }
                        </View>
                    </ScrollView>
                </LinearGradient>
                <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center'}}>
                    <Button title='Show Hadith' bgColor='#28a745' color='#fff' onPress={() => handleHadithBtn()}/>
                    <Button title='Delete History' bgColor='#dc3545' color='#fff' onPress={() => deleteHistory()} style={{marginLeft: 20}}/>
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
        backgroundColor: '#00172d',
        paddingVertical: 30,
        paddingHorizontal: 15,
        paddingTop: 40
    },
    LinearGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noHistory: {
        fontFamily: 'Bangla',
        fontSize: 30,
        marginBottom: 20,
        color: '#fff'
    },
    text: {
        fontFamily: 'Bangla',
        fontSize: 25,
        marginBottom: 10,
        paddingBottom: 10,
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#4b4b4b',
    }
});