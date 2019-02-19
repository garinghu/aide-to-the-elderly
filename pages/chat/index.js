import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createStackNavigator } from "react-navigation";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import FriendDetail from '../postBar/WritterList';

export default createStackNavigator({
    ChatList: {
        screen: ChatList,
        navigationOptions: {
            header: null,
        },
    },
    ChatDetail: {
        screen: ChatDetail,
        navigationOptions: {
            tabBarVisible: false,
            header: null,
        },
    },
    FriendDetail: {
        screen: FriendDetail,
        navigationOptions: {
            header: null,
        }
    },
}, {
    navigationOptions: {
        gesturesEnabled: false
    }
})
