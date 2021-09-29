import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import Button from './Button';

export default function TryAgain({ RefreshHadith }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    RefreshHadith().then(() => setRefreshing(false)).catch(e => alert(e));
  }, [RefreshHadith]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <StatusBar style="auto" />
        <Text style={[styles.text]}>সমস্যার জন্য দুঃখিত। আবার চেষ্টা করুন</Text>
        <Button
          title="Try Now"
          bgColor="#28a745"
          color="#fff"
          onPress={() => onRefresh()}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    fontFamily: 'Bangla',
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center'
  },
});
