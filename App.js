import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useFonts} from 'expo-font';
import {BASE_HADITH_URL} from '@env';
import Loader from './components/Loader';
import TryAgain from "./components/TryAgain";
import AppLoading from "expo-app-loading";
import Hadith from "./components/Hadith";

export default function App() {
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(false);
    const [currentComp, setCurrentComp] = useState('hadith');
    const [hadith, setHadith] = useState([]);

    // loading custom fonts
    let [fontsLoaded] = useFonts({
        'AdorshoLipi': require('./assets/fonts/AdorshoLipi_Normal.ttf'),
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

            // set hadith info to state and stop the loader
            setHadith(hadith);
            setLoader(false);

        } catch (error) {
            setError(true);
            alert(error)
        }
    };

    useEffect(() => {
        getHadiths();
    }, []);


    if (!fontsLoaded) {
        return <AppLoading/>;
    } else if (error) {
        return <TryAgain getHadith={getHadiths}/>
    } else if (loader) {
        return <Loader/>
    } else {

        return (
            <>
                {currentComp === 'hadith' && (
                    <Hadith hadith={hadith} getHadiths={getHadiths} setCurrentComp={setCurrentComp}/>
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
        fontFamily: 'AdorshoLipi'
    },

});
