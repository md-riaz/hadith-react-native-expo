import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, useWindowDimensions, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import Button from './Button';
import Loader from './Loader';

export default function Histories({
                                      handleHadithBtn,
                                      getHistories,
                                      getThisHadith,
                                  }) {
    const [histories, setHistories] = useState({});
    const [loading, setLoading] = useState(true);

    // on delete history click
    const deleteHistory = async function () {
        try {
            await AsyncStorage.removeItem('@histories');
            setHistories({});
        } catch (e) {
            alert(e);
        }

        console.log('Delete Done.');
    };

    // on history name click
    const _handleHistory = (book_key, chapterID, hadithNo) => {
        getThisHadith(book_key, chapterID, hadithNo);
    };

    useEffect(() => {
        let isMounted = true;
        getHistories().then((data) => {
            data = Object.keys(data).reduce((obj, k) => {
                if (data[k] != null && typeof data[k] === 'object') obj[k] = data[k];
                return obj;
            }, {});
            if (isMounted) {
                setHistories(data);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [getHistories]);

    const {width} = useWindowDimensions();

    if (loading) {
        return <Loader/>;
    } else {
        const systemFonts = [...defaultSystemFonts, 'Bangla'];

        return (
            <LinearGradient
                style={styles.LinearGradient}
                colors={['#00172d', '#000b18']}>
                <SafeAreaView style={styles.container}>
                    <StatusBar style="light"/>
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        {Object.keys(histories).length ? (
                            Object.keys(histories).map((key, index) => {
                                let history = histories[key];
                                return (
                                    <TouchableHighlight
                                        onPress={() =>
                                            _handleHistory(
                                                history.book_key,
                                                history.chapterID,
                                                history.hadithNo
                                            )
                                        }
                                        key={index}>
                                        <View>
                                            <RenderHtml
                                                source={{
                                                    html:
                                                        history.topic !== ''
                                                            ? history.topic
                                                            : history.hadithNo,
                                                }}
                                                tagsStyles={banglaStyles}
                                                systemFonts={systemFonts}
                                                contentWidth={width}
                                            />
                                        </View>
                                    </TouchableHighlight>
                                );
                            })
                        ) : (
                            <View style={{width: '100%'}}>
                                <Text style={styles.noHistory}>হিস্টোরি নাই বাপু</Text>
                            </View>
                        )}
                    </ScrollView>
                    <View
                        style={{
                            marginVertical: 20,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <Button
                            title="Show Hadith"
                            bgColor="#28a745"
                            color="#fff"
                            onPress={() => handleHadithBtn()}
                        />
                        <Button
                            title="Delete History"
                            bgColor="#dc3545"
                            color="#fff"
                            onPress={() => deleteHistory()}
                            style={{marginLeft: 20}}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const banglaStyles = {
    body: {
        fontFamily: 'Bangla',
        fontSize: 25,
        marginBottom: 10,
        paddingBottom: 10,
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#4b4b4b',
        textAlign: 'left',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 50,
    },
    contentContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingVertical: 30,
        paddingHorizontal: 15,
        paddingTop: 40,
    },
    LinearGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noHistory: {
        fontFamily: 'Bangla',
        fontSize: 30,
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
});
