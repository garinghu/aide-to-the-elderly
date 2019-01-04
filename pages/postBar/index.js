import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createStackNavigator } from "react-navigation";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

import CardList from './CardList';

export default createStackNavigator({
    CardList: {
        screen: CardList,
    },
})
