import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Footer, FooterTab, Button } from 'native-base';

export default class PostBar extends React.Component {
    static navigationOptions = {
        tabBarLabel: '问答',
        tabBarIcon: ({ focused, horizontal, tintColor, }) => 
            <FontAwesome name='chrome' size={horizontal ? 20 : 25} color={tintColor}/>,
    };
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header />
                <Content />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
