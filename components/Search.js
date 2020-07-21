import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, Button, View, ScrollView, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Filter from './Filter';
import {addHistory, clearHistory, getHistory} from '../api/SearchHistoryLogic';

import {Colors, DefaultStyles, Fonts} from '../constants';


function Search({navigation}) {
    const [searchString, setSearchString] = useState('');
    const [searchHist, setSearchHist] = useState(getHistory());

    const [isFilterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState([]);
    const [filterNames, setFilterNames] = useState([]);

    const searchInputHandler = (inputStr) => {
        setSearchString(inputStr);
    }

    const searchHandler = () => {
        if (isValidString(searchString)) {
            console.log("Searching for: " + searchString);
            addSearchHistHandler();
            setSearchString('');

            console.log("Active filters:", filters);
            navigation.navigate('Search Results',
                {
                    searchKey: searchString,
                    filters: filters,
                    filterNames: filterNames
                }
            );
        }
        // else ignore the search string
    }

    const filterHandler = () => {
        setFilterVisible(true);
    }

    const isValidString = str => str.length > 0 && str.trim().length > 0;
    // checks if string is valid

    const addSearchHistHandler = () => {
        addHistory(searchString);
        setSearchHist(getHistory());
    };

    const clearSearchHistHandler = () => {
        clearHistory();
        setSearchHist(getHistory());
    }


    const getKey = objType => objType + "_" + Math.floor(Math.random() * 10000);
    // creates key for object


    return (

        <View style={DefaultStyles.screen}>

            <View style={DefaultStyles.contentContainer}>

                <Modal animationType="slide"
                       transparent={false}
                       visible={isFilterVisible}>
                    <Filter filters={filters}
                            filterNames={filterNames}
                            setFilters={setFilters}
                            setFilterNames={setFilterNames}
                            setVisible={setFilterVisible}
                    />
                </Modal>

                <View style={styles.searchBar}>

                    <View style={styles.inputContainer}>

                        <TextInput style={styles.inputText}
                                   placeholder="What do you wanna eat?"
                                   onChangeText={searchInputHandler}
                                   value={searchString}
                        />

                    </View>

                    <View style={styles.searchButton}>
                        <Button
                            icon={
                                <Icon
                                    name="search"
                                    size={15}
                                    color={Colors.BUTTON}
                                />
                            }
                            title='Find'
                            color={Colors.BUTTON}
                            onPress={searchHandler}
                        />
                    </View>

                    <View style={styles.filterButton}>
                        <Button
                            icon={
                                <Icon
                                    name="filter"
                                    size={15}
                                    color={Colors.BUTTON}
                                />
                            }
                            title="Filters"
                            color={Colors.BUTTON}
                            onPress={filterHandler}
                        />
                    </View>


                </View>


                <View style={styles.searchHistoryOverallContainer}>

                    <View style={styles.searchHistoryTitle}>
                        <Text style={styles.searchHistoryTitleText}>
                            Search History
                        </Text>
                    </View>

                    <View style={styles.searchHistoryContainer}>
                        <ScrollView>
                            {searchHist.map(item => (

                                <TouchableOpacity
                                    key={getKey("touchable_opacity")}
                                    onPress={() => searchInputHandler(item)}>

                                    <View style={styles.searchHistoryTextContainer}>
                                        <Text style={styles.searchHistoryText}
                                              key={getKey("search_hist")}>
                                            {item}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>


                </View>

                <View style={styles.searchHistoryClearButton}>
                    <Button title="Clear search history"
                            color={Colors.BUTTON}
                            onPress={clearSearchHistHandler}
                    />
                </View>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    searchBar: {
        flex: 2,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    filterButton: {
        flex: 3,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    searchButton: {
        flex: 3,
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },

    inputContainer: {
        flex: 9,
        // borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.BORDER,
        borderRadius: 0,
        paddingHorizontal: 8,
        paddingVertical: 8,
    },

    inputText: {
        fontSize: Fonts.XS,
    },

    searchHistoryOverallContainer: {
        flex: 18,
        // paddingTop: 10,
    },

    searchHistoryContainer: {
        flex: 18,
        paddingTop: 10,
        justifyContent: 'space-around'
    },

    searchHistoryTitle: {
        flex: 1,
        marginTop: 25,
    },

    searchHistoryTitleText: {
        flex: 8,
        color: Colors.DARK_TEXT,
        fontSize: Fonts.S,
        fontWeight: 'bold',
    },


    searchHistoryText: {
        fontSize: Fonts.XS,
        color: Colors.TEXT,
    },

    searchHistoryTextContainer: {
        marginVertical: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.LIGHT_BORDER,
        borderRadius: 4,
        width: '97%',
        color: Colors.TEXT,
    },

    searchHistoryClearButton: {
        flex: 4,
        paddingTop: 25,
        justifyContent: 'center',
    }
});


export default Search;
