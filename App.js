import React, {useCallback, useEffect, useState} from 'react';
import {useFonts} from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import {Image, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Loader from './components/Loader';
import TryAgain from './components/TryAgain';
import AppLoading from 'expo-app-loading';
import Hadith from './components/Hadith';
import Histories from './components/Histories';
import refreshIcon from './assets/img/refresh.svg';

const BASE_HADITH_URL = 'https://alquranbd.com/api';

export default function App() {
    const [error, setError] = useState(false);
    const [view, setView] = useState('');
    const [hadith, setHadith] = useState([]);

    // loading custom fonts
    let [fontsLoaded] = useFonts({
        Bangla: require('./assets/fonts/Bangla.ttf'),
    });

    const getRandomOf = (item) => item[Math.floor(Math.random() * item.length)];

    const getHadiths = useCallback(async () => {
        const state = await NetInfo.fetch();

        if (state && state.isConnected) {
            setView('loader');
            try {
                // get all available books
                const books = await fetch(BASE_HADITH_URL + '/hadith')
                    .then((resp) => resp.json())
                    .then((b) => b.filter((item) => item.book_key !== ''));
                const randomBook = getRandomOf(books);

                // get all chapter number from the selected random book
                const chapters = await fetch(
                    BASE_HADITH_URL + `/hadith/${randomBook['book_key']}`
                ).then((resp) => resp.json());
                const randomChapter = getRandomOf(chapters);

                // get all available hadith from the random chapter
                const hadiths = await fetch(
                    BASE_HADITH_URL +
                    `/hadith/${randomBook['book_key']}/${randomChapter['chSerial']}`
                ).then((res) => res.json());
                const randomHadith = getRandomOf(hadiths);

                // the final hadith
                const selectedHadith = {
                    topicName: randomHadith['topicName'],
                    book: randomBook['nameBengali'],
                    chapter: randomChapter['nameBengali'],
                    hadithArabic: randomHadith['hadithArabic'],
                    hadithEnglish: randomHadith['hadithEnglish'],
                    hadithBengali: randomHadith['hadithBengali'],
                    bookId: randomBook['book_key'],
                    chapterId: randomChapter['chSerial'],
                    hadithNo: randomHadith['hadithNo'],
                };

                // save history
                await saveHistory(
                    randomHadith['topicName'],
                    randomBook['book_key'],
                    randomChapter['chSerial'],
                    randomHadith['hadithNo']
                );

                // if web set to url
                if (Platform.OS === 'web') {
                    setHadithURL(
                        randomBook['book_key'],
                        randomChapter['chSerial'],
                        randomHadith['hadithNo']
                    );
                }

                return selectedHadith;
            } catch (error) {
                setError(true);
                alert(error);
            }
        } else {
            setError(true);
            alert('Network connection unavailable.');
        }

    }, [saveHistory]);

    // on refresh
    const RefreshHadith = useCallback(async () => {
        const state = await NetInfo.fetch();

        if (state && state.isConnected) {
            setView('loader');
            try {
                let data = await getHadiths();
                if (data) {
                    setHadith(data);
                    setError(false);
                    setView('hadith');
                }
            } catch (e) {
                setError(true);
                alert(e);
            }
        } else {
            setError(true);
            alert('Network connection unavailable.');
        }

        console.log('refresh done');
    }, []);

    // on history btn click
    const showHistory = function () {
        setView('history');
    };

    // on show hadith btn click
    const handleHadithBtn = function () {
        setView('hadith');
    };

    // save current hadith to localStorage
    const saveHistory = useCallback(
        async (topic, book_key, chapterID, hadithNo) => {
            let localHistories = (await getHistories()) ?? {};
            localHistories[Date.now()] = {
                topic: topic,
                hadithNo: hadithNo,
                book_key,
                chapterID,
            };

            await storeHistories(localHistories);
        },
        []
    );

    // get single hadith from parameters
    const getThisHadith = useCallback(async (book_key, chapterID, hadithNo) => {
        setView('loader');
        try {
            // get book name
            const book = await fetch(BASE_HADITH_URL + `/hadith/`)
                .then((resp) => resp.json())
                .then((b) => b.find((item) => item.book_key === book_key));

            // get chapter name
            const chapter = await fetch(BASE_HADITH_URL + `/hadith/${book_key}`)
                .then((resp) => resp.json())
                .then((c) => c.find((item) => item.chSerial === chapterID));

            // get the hadith
            const hadith = await fetch(
                BASE_HADITH_URL + `/hadith/${book_key}/${chapterID}/`
            )
                .then((res) => res.json())
                .then((hadiths) => hadiths.find((h) => h.hadithNo === hadithNo));

            const data = {
                topicName: hadith['topicName'],
                book: book['nameBengali'],
                chapter: chapter['nameBengali'],
                hadithArabic: hadith['hadithArabic'],
                hadithEnglish: hadith['hadithEnglish'],
                hadithBengali: hadith['hadithBengali'],
            };

            // if web set to url
            if (Platform.OS === 'web') {
                setHadithURL(book_key, chapterID, hadithNo);
            }

            // save data to state
            setHadith(data);
        } catch (error) {
            setError(true);
            alert(error);
        } finally {
            setView('hadith');
        }
    }, []);

    // set history
    const storeHistories = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@histories', jsonValue);
        } catch (e) {
            setError(true);
            alert(e);
        }
    };

    const getHistories = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@histories');
            let localHistories = jsonValue != null ? JSON.parse(jsonValue) : {};

            let sortedHistories = Object.entries(localHistories)
                .sort((a, b) => b[0] - a[0])
                .reduce((r, [k, v]) => ({...r, [k]: v}), {});

            return sortedHistories;
        } catch (e) {
            setError(true);
            alert(e);
        }
    };

    // set hadith info in url only for web
    const setHadithURL = (book_key, chapterID, hadithNo) => {
        if (Platform.OS === 'web') {
            window.history.pushState(
                '',
                'Hadith',
                `/?book_key=${book_key}&chapterID=${chapterID}&hadithNo=${hadithNo}`
            );
        }
    };

    useEffect(() => {
        let isMounted = true;

        if (Platform.OS === 'web') {
            Linking.getInitialURL().then((url) => {
                let new_url = url.replace('http://', '').replace('https://', '');
                let {path, queryParams} = Linking.parse(new_url);

                if (
                    (queryParams.book_key, queryParams.chapterID, queryParams.hadithNo)
                ) {
                    getThisHadith(
                        queryParams.book_key,
                        queryParams.chapterID,
                        queryParams.hadithNo
                    );
                } else {
                    getHadiths().then((data) => {
                        if (isMounted) {
                            setHadith(data);
                            setView('hadith');
                        }
                    });
                }
            });
        } else {
            getHadiths().then((data) => {
                if (isMounted) {
                    setHadith(data);
                    setView('hadith');
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [getHadiths, getThisHadith]);

    if (!fontsLoaded) {
        return <AppLoading/>;
    } else if (error || typeof hadith !== 'object') {
        return <TryAgain RefreshHadith={RefreshHadith}/>;
    } else if (view === 'loader') {
        return <Loader/>;
    } else if (view === 'history') {
        return (
            <Histories
                handleHadithBtn={handleHadithBtn}
                getHistories={getHistories}
                getThisHadith={getThisHadith}
            />
        );
    }

    return (
        <>
            <Hadith
                hadith={hadith}
                RefreshHadith={RefreshHadith}
                showHistory={showHistory}
            />
            <TouchableOpacity
                style={styles.refreshIconContainer}
                onPress={() => {
                    getHadiths().then((data) => {
                        setHadith(data);
                        setView('hadith');
                    });
                }}>
                <Image source={refreshIcon} style={styles.refreshIcon}/>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    refreshIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 25,
        right: 25,
        ...Platform.select({
            web: {
                cursor: 'pointer',
            },
        }),
    },
    refreshIcon: {
        width: 50,
        height: 50,
        maxWidth: '100%',
    },
});
