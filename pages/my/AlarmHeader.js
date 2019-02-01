import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, DeviceEventEmitter } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';
import Axios from 'axios';

class ClockHeader extends React.Component {
    
    constructor(props) {
        super(props);
    }

    showNewPost = () => {
        const navigation = this.props.navigation;
        navigation.navigate('AlarmDetail', { mode: 'new' });
    }

    goBack = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        DeviceEventEmitter.emit('changeShowMode', true);
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
                <Right>
                    <Button transparent onPress={() => this.showNewPost()}>
                        <Text note style={{ fontSize: 16, color: '#ed6560' }}>新建</Text>
                    </Button>
                </Right>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
    },
});

export default withNavigation(ClockHeader);
