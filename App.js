import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './components/Loader';
import TryAgain from './components/TryAgain';
import AppLoading from 'expo-app-loading';
import Hadith from './components/Hadith';
import Histories from './components/Histories';

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
      };

      // save history
      await saveHistory(
        randomHadith['topicName'],
        randomBook['book_key'],
        randomChapter['chSerial'],
        randomHadith['hadithNo']
      );

      return selectedHadith;
    } catch (error) {
      setError(true);
      alert(error);
    }
  }, [saveHistory]);

  // on refresh
  const RefreshHadith = async function () {
    try {
      let data = await getHadiths();
      setHadith(data);
      setError(false);
      setView('hadith');
    } catch (e) {
      setError(true);
      alert(e);
    }

    console.log('refresh done');
  };

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
        uri: BASE_HADITH_URL + `/hadith/${book_key}/${chapterID}`,
      };

      await storeHistories(localHistories);
    },
    []
  );

  // get single hadith from parameters
  const getThisHadith = async (hadithNo, uri) => {
    setView('loader');
    try {
      const hadith = await fetch(uri)
        .then((res) => res.json())
        .then((hadiths) => hadiths.find((h) => h.hadithNo === hadithNo));
      const data = {
        topicName: hadith['topicName'],
        book: hadith['nameBengali'],
        chapter: hadith['nameBengali'],
        hadithArabic: hadith['hadithArabic'],
        hadithEnglish: hadith['hadithEnglish'],
        hadithBengali: hadith['hadithBengali'],
      };
      setHadith(data);
    } catch (error) {
      setError(true);
      alert(error);
    } finally {
      setView('hadith');
      console.log();
    }
  };

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
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      setError(true);
      alert(e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getHadiths().then((data) => {
      if (isMounted) {
        setHadith(data);
        setView('hadith');
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getHadiths]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else if (error) {
    return <TryAgain RefreshHadith={RefreshHadith} />;
  } else if (view === 'loader') {
    return <Loader />;
  } else if (view === 'history') {
    return (
      <Histories
        handleHadithBtn={handleHadithBtn}
        getHistories={getHistories}
        getThisHadith={getThisHadith}
      />
    );
  } else {
    return (
      <Hadith
        hadith={hadith}
        RefreshHadith={RefreshHadith}
        showHistory={showHistory}
      />
    );
  }
}
