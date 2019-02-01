import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';
import Axios from 'axios';

class MyHeader extends React.Component {
    
    constructor(props) {
        super(props);
    }

    goBack = () => {
        const { navigation, callBack } = this.props;
        navigation.goBack(null);
        callBack && callBack();
    }

    render() {
        const { navigation } = this.props;
        return (
            <Header>
                <Left>
                    <Button transparent onPress={() => this.goBack()}>
                        <Icon name='arrow-back' style={{ color: '#ed6560' }}/>
                    </Button>
                </Left>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
    },
});

export default withNavigation(MyHeader);
