import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useFonts} from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_HADITH_URL} from '@env';
import Loader from './components/Loader';
import TryAgain from "./components/TryAgain";
import AppLoading from "expo-app-loading";
import Hadith from "./components/Hadith";
import Histories from "./components/Histories";

export default function App() {
    const [error, setError] = useState(false);
    const [view, setView] = useState('hadith');
    const [hadith, setHadith] = useState([]);

    // loading custom fonts
    let [fontsLoaded] = useFonts({
        'Bangla': require('./assets/fonts/Bangla.ttf'),
    });

    const getRandomOf = (item) => item[Math.floor(Math.random() * item.length)];

    const getHadiths = async function () {
        setView('loader');
        try {
            // get all available books
            const books = await fetch(BASE_HADITH_URL + '/hadith').then(resp => resp.json()).then((b) => b.filter((item) => item.book_key !== ''));
            const randomBook = getRandomOf(books);

            // get all chapter number from the selected random book
            const chapters = await fetch(BASE_HADITH_URL + `/hadith/${randomBook['book_key']}`).then(resp => resp.json());
            const randomChapter = getRandomOf(chapters);

            // get all available hadith from the random chapter
            const hadiths = await fetch(BASE_HADITH_URL + `/hadith/${randomBook['book_key']}/${randomChapter['chSerial']}`).then(res => res.json());
            const randomHadith = getRandomOf(hadiths);

            // the final hadith
            const selectedHadith = {
                topicName: randomHadith['topicName'],
                book: randomBook['nameBengali'],
                chapter: randomChapter['nameBengali'],
                hadithArabic: randomHadith['hadithArabic'],
                hadithEnglish: randomHadith['hadithEnglish'],
                hadithBengali: randomHadith['hadithBengali']
            };

            // save history
            saveHistory(randomHadith['topicName'], randomBook['book_key'], randomChapter['chSerial'], randomHadith['hadithNo'])

            return selectedHadith;
        } catch (error) {
            setError(true);
            alert(error)
        } finally {
            setView('hadith');
        }
    };

    // on refresh
    const RefreshHadith = async function () {
        setError(false);
        getHadiths().then(data => setHadith(data) && setView('hadith'));
    }

    // on history btn click
    const handleHistoryBtn = function () {
        setView('history');
    }

    // on show hadith btn click
    const handleHadithBtn = function () {
        setView('hadith');
    }

    // save current hadith to localStorage
    const saveHistory = (topic, book_key, chapterID, hadithNo) => {
        let localHistories = getHistories() ?? {};

        localHistories[Date.now()] = {
            topic: topic,
            hadithNo: hadithNo,
            uri: BASE_HADITH_URL + `/hadith/${book_key}/${chapterID}`
        };

        storeHistories(localHistories);
    };

    // get single hadith from parameters
    const getThisHadith = async (hadithNo, uri) => {
        setView('loader');
        try {
            const hadith = await fetch(uri).then(res => res.json()).then(hadiths => hadiths.find(h => h.hadithNo === hadithNo));
            return {
                topicName: hadith['topicName'],
                book: hadith['nameBengali'],
                chapter: hadith['nameBengali'],
                hadithArabic: hadith['hadithArabic'],
                hadithEnglish: hadith['hadithEnglish'],
                hadithBengali: hadith['hadithBengali']
            };

        } catch (error) {
            setError(true);
            alert(error)
        } finally {
            setView('hadith');
        }
    }

    // set history
    const storeHistories = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@histories', jsonValue)
        } catch (e) {
            setError(true);
            alert(e);
        }
    }

    const getHistories = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@histories')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            setError(true);
            alert(e);
        }
    }


    useEffect(() => {
        getHadiths().then(data => setHadith(data));
    }, []);


    if (!fontsLoaded) {
        return <AppLoading/>;
    } else if (error) {
        return <TryAgain tryAgain={RefreshHadith}/>
    } else if (view === 'loader') {
        return <Loader/>
    } else if (view === 'history') {
        return <Histories onPress={handleHadithBtn} getHistories={getHistories}/>
    } else {
        return <Hadith hadith={hadith} RefreshHadith={RefreshHadith} onPress={handleHistoryBtn}/>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Bangla'
    },

});
