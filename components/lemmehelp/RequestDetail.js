import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Colors, DefaultStyles, Fonts} from '../../constants';
import RequestInfoContainer from './RequestInfoContainer';
import * as firebase from 'firebase';

const helpCollection = firebase.firestore().collection("HELPS");

function RequestDetail({navigation, route}) {
    const [item, setItem] = useState(route.params?.item);
    const [status, setStatus] = useState(route.params?.status);
    const [refreshing, setRefreshing] = useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const refresh = (callBack) => {
        setRefreshing(true);
        callBack();
        wait(200).then(() => setRefreshing(false));
    }

    const updateItem = newData => {
        const newItem = Object.assign(item, newData);
        refresh(() => setItem(newItem));
    }

    useEffect(() => {
        const docRef = helpCollection.doc(item.helpId);

        return docRef.onSnapshot(docSnapshot => {
                const data = docSnapshot.data();
                updateItem(data);
            },
            err => console.log('Error on listener:', err)
        );

    }, [helpCollection, refresh, updateItem]);

    return (
        <SafeAreaView style={DefaultStyles.screen}>

            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>My request:</Text>
            </View>

            <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
                <RequestInfoContainer
                    item={item}
                    status={status}
                    showButton={false}
                    navigation={navigation}
                />
            </View>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({
    headerTextContainer: {
        marginBottom: '2%',
        justifyContent: 'center',
    },

    headerText: {
        color: Colors.DARK_TEXT,
        fontSize: Fonts.M,
        fontWeight: 'bold',
        paddingBottom: '2%',
        // fontStyle: 'italic',
    },
})

export default RequestDetail;

