import React from 'react';
import { Permissions, Notifications } from 'expo';
import { StyleSheet, View, Image, CheckBox, Switch, Alert, DeviceEventEmitter, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import AlarmClockCard from './AlarmClockCard';
import data from './data';
import Config from '../../config';

const GET_USER_TOKEN = `${Config.proxy}/getusertoken`;

export default class AlarmClockList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            switchValue: false,
            notification: {},
            clocks: [],
        }
    }

    async componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('refreshClocks', this.refreshData)
        this.refreshData();
        // 获取推送权限
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        console.log(existingStatus)
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        // 获取expoToken
        Axios.post(GET_USER_TOKEN, { expoToken: token, userid: 1 })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err)
        })
        // Notifications.presentLocalNotificationAsync({
        //     title: '123',
        //     body: '123',
        //     data: {
        //         test: 123,
        //     }
        // });
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notification) => {
        this.setState({notification: notification});
    };

    refreshData = () => {
        storage.load('clocks', res => {
            this.setState({ clocks: res })
        })
    }

    componentWillUnmount() {
        this.subscription.remove();
    };

    changeSwitchValue = () => {
        const { switchValue } = this.state;
        this.setState({ switchValue: !switchValue });
    }

    render() {
        const { switchValue, clocks } = this.state;
        return (
            <Container>
                <Content>
                <List>
                    {clocks.map((item, index) => <AlarmClockCard key={index} detail={{...item, index}}/>)}
                </List>
                </Content>
                {
                    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    //     <Text>Origin: {this.state.notification.origin}</Text>
                    //     <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
                    // </View>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
