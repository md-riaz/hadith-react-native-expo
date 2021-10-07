import {
    Alert,
    Clipboard,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import React, {useCallback, useState} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import Button from './Button';
import he from 'he'

const BASE_WEB_URL = 'https://hadith.ml';

export default function Hadith({hadith, RefreshHadith, showHistory}) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        RefreshHadith();

        return () => {
            setRefreshing(false);
        };
    }, [RefreshHadith]);

    const notifyMessage = (msg) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else if (Platform.OS === 'ios') {
            Alert.alert(msg);
        } else {
            alert(msg);
        }
    };

    const _handleLongPress = (textContent) => {
        if (Platform.OS !== 'web') {
            let data = textContent.replace(/<[^>]+>/g, '');
            data = he.decode(data);
            Clipboard.setString(data);
            notifyMessage('Copied!');
        }
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    BASE_WEB_URL +
                    `/?book_key=${hadith.bookId}&chapterID=${hadith.chapterId}&hadithNo=${hadith.hadithNo}`,
            });

            if (result.action === Share.dismissedAction) {
                notifyMessage('dismissed');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const systemFonts = [...defaultSystemFonts, 'Bangla'];
    const {width} = useWindowDimensions();
    return (
        <LinearGradient
            style={styles.LinearGradient}
            colors={['#00172d', '#000b18']}>
            <SafeAreaView style={styles.container}>
                <StatusBar style="light"/>
                <Text style={styles.headerText}>প্রতি মুহুর্তে হাদিস</Text>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    contentContainerStyle={{maxWidth: 1100}}>
                    <TouchableWithoutFeedback
                        onLongPress={() =>
                            _handleLongPress('পরিচ্ছেদঃ ' + hadith.topicName)
                        }>
                        <View>
                            <RenderHtml
                                source={{
                                    html: hadith.topicName && 'পরিচ্ছেদঃ ' + hadith.topicName,
                                }}
                                tagsStyles={topicNameStyles}
                                systemFonts={systemFonts}
                                contentWidth={width}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onLongPress={() => _handleLongPress(hadith.hadithArabic)}>
                        <Text style={styles.arabic}>{hadith.hadithArabic}</Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onLongPress={() => _handleLongPress(hadith.hadithBengali)}>
                        <View>
                            <RenderHtml
                                source={{html: hadith.hadithBengali}}
                                tagsStyles={banglaStyles}
                                systemFonts={systemFonts}
                                contentWidth={width}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onLongPress={() => _handleLongPress(hadith.hadithEnglish)}>
                        <Text style={styles.english}>{hadith.hadithEnglish}</Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onLongPress={() => _handleLongPress('বইঃ ' + hadith.book)}>
                        <View>
                            <RenderHtml
                                source={{html: 'বইঃ ' + hadith.book}}
                                tagsStyles={bookStyles}
                                systemFonts={systemFonts}
                                contentWidth={width}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onLongPress={() => _handleLongPress('অধ্যায়ঃ ' + hadith.chapter)}>
                        <View>
                            <RenderHtml
                                source={{html: 'অধ্যায়ঃ ' + hadith.chapter}}
                                tagsStyles={chapterStyles}
                                systemFonts={systemFonts}
                                contentWidth={width}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    <View
                        style={{
                            marginVertical: 20,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <Button
                            title="Show History"
                            bgColor="#ffc107"
                            color="#212529"
                            onPress={() => showHistory()}
                        />
                        {Platform.OS !== 'web' ? (
                            <Button
                                title="Share"
                                bgColor="#0058a0"
                                color="#fff"
                                style={{marginLeft: 20}}
                                onPress={() => onShare()}
                            />
                        ) : (
                            ''
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const banglaStyles = {
    body: {
        fontFamily: 'Bangla',
        color: '#fff',
        fontSize: 25,
        lineHeight: 45,
        marginVertical: 10,
        textAlign: 'justify',
    },
};

const topicNameStyles = {
    body: {
        fontSize: 30,
        color: 'darksalmon',
        fontFamily: 'Bangla',
        marginBottom: 10,
        textAlign: 'center',
        userSelect: 'auto'
    },
};

const bookStyles = {
    body: {
        color: '#28a745',
        textAlign: 'center',
        fontSize: 25,
        fontFamily: 'Bangla',
        marginVertical: 3,
    },
};

const chapterStyles = {
    body: {
        color: '#28a745',
        textAlign: 'center',
        fontSize: 25,
        fontFamily: 'Bangla',
        marginVertical: 3,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    LinearGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    headerText: {
        fontFamily: 'Bangla',
        fontSize: 30,
        marginBottom: 25,
        paddingBottom: 3,
        borderBottomWidth: 4,
        borderBottomColor: '#28a745',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 60,
    },
    english: {
        fontSize: 22,
        color: 'darkgray',
        marginBottom: 20,
    },
    arabic: {
        fontSize: 20,
        color: '#fff',
        marginVertical: 20,
    },
});
