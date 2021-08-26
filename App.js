import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BASE_HADITH_URL } from 'react-native-dotenv';

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
         console.log(books);
      } catch (error) {}
   };

   return (
      <View style={styles.container}>
         <Text>This is hadith app with errors</Text>
         <StatusBar style='auto' />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
