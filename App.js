import {StatusBar} from 'expo-status-bar';
import {useFonts} from "expo-font";
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BASE_HADITH_URL} from '@env';
import AppLoading from './components/AppLoading';
import TryAgain from "./components/TryAgain";

export default function App() {
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(false);
    const [hadith, setHadith] = useState([]);

    // loading custom font
    let [fontsLoaded] = useFonts({
        'AdorshoLipi': require('./assets/fonts/AdorshoLipi_Normal.ttf'),
    });

    const getRandomOf = (item) => item[Math.floor(Math.random() * item.length)];


    const getHadiths = async function () {

        try {
            setLoader(true);
            // get all available books
            const books = await fetch(BASE_HADITH_URL + '/hadith').then(resp => resp.json()).then((b) => b.filter((item) => item.book_key !== ''));
            const randomBook = getRandomOf(books);

            // get all chapter number from the selected random book
            const chapters = await fetch(BASE_HADITH_URL + `/hadith/${randomBook['book_key']}`).then(resp => resp.json());
            const randomChapter = getRandomOf(chapters);

            // get all available hadith from the random chapter
            const hadiths = fetch(BASE_HADITH_URL + `/hadith/${randomBook['book_key']}/${randomChapter['chSerial']}`).then(res => res.json());
            const randomHadith = getRandomOf(hadiths);

            // the final hadith
            const hadith = {
                topicName: randomHadith['topicName'],
                book: randomBook['nameBengali'],
                chapter: randomChapter['nameBengali'],
                hadithArabic: randomHadith['hadithArabic'],
                hadithEnglish: randomHadith['hadithEnglish'],
                hadithBengali: randomHadith['hadithBengali']
            };

            // set hadith info to state and stop the loader
            setHadith(hadith);
            setLoader(false);

        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        getHadiths();
    }, []);


    if (loader || !fontsLoaded) {

        return <AppLoading/>

    } else if (error) {

        return <TryAgain/>

    } else {

        return (
            <View style={styles.container}>
                <Text>Hooray</Text>
                <StatusBar style='auto'/>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'AdorshoLipi'
    },

});
