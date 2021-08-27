import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { BASE_HADITH_URL } from '@env';

export default function App() {
   useEffect(() => {
      getHadiths();
   }, []);

   const [loader, setLoader] = useState(true);

   const getHadiths = async function () {
      try {
         setLoader(true);
         // get all available books
         let response = await fetch(BASE_HADITH_URL + '/hadith');
         const books = await response
            .json()
            .then((b) => b.filter((item) => item.book_key != ''));

         let randomBook = books[Math.floor(Math.random() * books.length)];
      } catch (error) {}
   };

   if (loader) {
      return (
         <View style={styles.container}>
            <StatusBar style='auto' />
            <ActivityIndicator size='large' color='#28a745' />
            <Text style={{ marginTop: 20, fontSize: 20 }}>আইতাছি...</Text>
         </View>
      );
   } else {
      return (
         <View style={styles.container}>
            <Text>Hooray</Text>
            <StatusBar style='auto' />
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
   },
});
