import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useFonts} from 'expo-font';
import {BASE_HADITH_URL} from '@env';
import Loader from './components/Loader';
import TryAgain from "./components/TryAgain";
import AppLoading from "expo-app-loading";
import Hadith from "./components/Hadith";
import Histories from "./components/Histories";

export default function App() {
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(false);
    const [currentComp, setCurrentComp] = useState('hadith');
    const [hadith, setHadith] = useState([]);

    // loading custom fonts
    let [fontsLoaded] = useFonts({
        'Bangla': require('./assets/fonts/Bangla.ttf'),
    });

    const getRandomOf = (item) => item[Math.floor(Math.random() * item.length)];


    const getHadiths = async function () {
        setLoader(true);
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
            const hadith = {
                topicName: randomHadith['topicName'],
                book: randomBook['nameBengali'],
                chapter: randomChapter['nameBengali'],
                hadithArabic: randomHadith['hadithArabic'],
                hadithEnglish: randomHadith['hadithEnglish'],
                hadithBengali: randomHadith['hadithBengali']
            };

            return hadith;
        } catch (error) {
            setError(true);
            alert(error)
        } finally {
            setLoader(false);
        }
    };

    // on refresh
    const RefreshHadith = async function () {
        getHadiths().then(data => setHadith(data) && setCurrentComp('hadith'));
    }

    // on history btn click
    const historyClick = function () {
        setCurrentComp('histories');
    }



    useEffect ( ()=> {
        getHadiths().then(data => setHadith(data));
    }, []);


    if (!fontsLoaded) {
        return <AppLoading/>;
    } else if (error) {
        return <TryAgain RefreshHadith={RefreshHadith}/>
    } else if (loader) {
        return <Loader/>
    } else {

        return (
            <>
                {currentComp === 'hadith' && (
                    <Hadith hadith={hadith} RefreshHadith={RefreshHadith} historyClick={historyClick}/>
                )}
            </>

        );

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
