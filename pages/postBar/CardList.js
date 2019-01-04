import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

import ShowCard from '../../common/ShowCard';

import Data from './data';

export default class PostBar extends React.Component {
    static navigationOptions = {
        tabBarLabel: '问答',
        tabBarIcon: ({ focused, horizontal, tintColor, }) => 
            <FontAwesome name='chrome' size={horizontal ? 20 : 25} color={tintColor}/>,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            cardList: [],
        };
    }

    componentDidMount() {
        this.setState({
            cardList: Data,
        })
    }

    render() {
        const state = this.state;
        return (
            <Container>
                <Content>
                    {
                        state.cardList.map(item => <ShowCard key={item.id} cardContent={item}/>)
                    } 
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
