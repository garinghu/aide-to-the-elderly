import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createStackNavigator } from "react-navigation";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

import CardList from './CardListTest';
import CardDetail from './CardDetail';
import PostHeader from './PostHeader';
import NewPost from './newPost';
import WritterList from './WritterList';

export default createStackNavigator({
    CardList: {
        screen: CardList,
        navigationOptions: {
            headerTitle: <PostHeader />,
        }
    },
    CardDetail: {
        screen: CardDetail,
        navigationOptions: {
            header: null,
        }
    },
    NewPost: {
        screen: NewPost,
        navigationOptions: {
            header: null,
        }
    },
    WritterList: {
        screen: WritterList,
        navigationOptions: {
            header: null,
        }
    },
}, {
    navigationOptions: {
        gesturesEnabled: false
    }
})
