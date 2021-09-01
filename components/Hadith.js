import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import React, {useCallback, useState} from "react";
import {LinearGradient} from 'expo-linear-gradient'
import Button from "./Button";


export default function Hadith({hadith, RefreshHadith, showHistory}) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        RefreshHadith();

        return () => {
            setRefreshing(false);
        };
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light'/>
            <LinearGradient style={styles.LinearGradient} colors={['#00172d 0%', '#000b18 100%']}>
                <Text style={styles.headerText}>প্রতি মুহুর্তে হাদিস</Text>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} contentContainerStyle={{maxWidth: 1100}}>
                    <Text style={styles.topicName}>{hadith.topicName && 'পরিচ্ছেদঃ ' + hadith.topicName}</Text>
                    <Text style={styles.arabic}>{hadith.hadithArabic}</Text>
                    <Text style={styles.bangla}>{hadith.hadithBengali}</Text>
                    <Text style={styles.english}>{hadith.hadithEnglish}</Text>
                    <Text style={styles.book}>{'বইঃ ' + hadith.book}</Text>
                    <Text style={styles.chapter}>{'অধ্যায়ঃ ' + hadith.chapter}</Text>
                    <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center'}}>
                        <Button title='Show History' bgColor='#ffc107' color='#212529' onPress={() => showHistory()}/>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00172d'
        },
        LinearGradient: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            paddingTop: 50
        },
        headerText: {
            fontFamily: 'Bangla',
            fontSize: 30,
            marginBottom: 25,
            paddingBottom: 3,
            borderBottomWidth: 4,
            borderBottomColor: '#28a745',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 60,

        },
        topicName: {
            fontSize: 30,
            color: 'darksalmon',
            fontFamily: 'Bangla',
            marginBottom: 10,
            textAlign: 'center',
        },
        bangla: {
            fontFamily: 'Bangla',
            color: '#fff',
            fontSize: 25,
            lineHeight: 35,
            marginVertical: 10,
            textAlign: 'justify'

        },
        english: {
            fontSize: 22,
            color: 'darkgray',
            marginBottom: 20
        },
        arabic: {
            fontSize: 20,
            color: '#fff',
            marginVertical: 20
        },
        book: {
            color: '#28a745',
            textAlign: 'center',
            fontSize: 25,
            fontFamily: 'Bangla',
            marginVertical: 3
        },
        chapter: {
            color: '#28a745',
            textAlign: 'center',
            fontSize: 25,
            fontFamily: 'Bangla',
            marginVertical: 3
        }
    })
;