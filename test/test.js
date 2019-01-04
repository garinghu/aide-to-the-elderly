import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base';

export default class Test extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
    constructor(props) {
        super(props);
        this.state = {
            age: 0,
        };
        // console.log(this.props.navigation)
    }

    pressTest = () => {
        console.log(this.props);
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
        // flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
