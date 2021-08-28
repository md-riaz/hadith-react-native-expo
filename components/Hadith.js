import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text} from "react-native";
import {StatusBar} from "expo-status-bar";
import React, {useState} from "react";
import {LinearGradient} from 'expo-linear-gradient'

export default function Hadith({hadith, getHadiths, setCurrentComp}) {
    const [refreshing, setRefreshing] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light'/>
            <LinearGradient style={styles.LinearGradient} colors={['#00172d 0%', '#000b18 100%']}>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=> getHadiths()}/>}>
                    <Text style={styles.headerText}>প্রতি মুহুর্তে হাদিস</Text>
                    <Text style={styles.topicName}>{hadith.topicName && 'পরিচ্ছেদঃ ' + hadith.topicName}</Text>
                    <Text style={styles.arabic}>{hadith.hadithArabic}</Text>
                    <Text style={styles.bangla}>{hadith.hadithBengali}</Text>
                    <Text style={styles.english}>{hadith.hadithEnglish}</Text>
                    <Text style={styles.book}>{'বইঃ ' + hadith.book}</Text>
                    <Text style={styles.chapter}>{'অধ্যায়ঃ ' + hadith.chapter}</Text>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
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
            fontFamily: 'AdorshoLipi',
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
            fontSize: 28,
            color: 'darksalmon',
            fontFamily: 'AdorshoLipi',
            marginBottom: 10,
            textAlign: 'center',
        },
        bangla: {
            fontFamily: 'AdorshoLipi',
            color: '#fff',
            fontSize: 20,
            lineHeight: 35,
            marginVertical: 10,
            textAlign: 'justify'

        },
        english: {
            fontSize: 18,
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
            fontSize: 20,
            fontFamily: 'AdorshoLipi',
            marginVertical: 3
        },
        chapter: {
            color: '#28a745',
            textAlign: 'center',
            fontSize: 20,
            fontFamily: 'AdorshoLipi',
            marginVertical: 3
        }
    })
;