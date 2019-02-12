import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon, Switch } from 'native-base';

import { storage } from '../../storage';
import Config from '../../config';

export default class Home extends React.Component {
    
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            userid: '',
            username: '',
            headImg: '',
            phone: '',
        };
    }

    componentDidMount() {
        this.refreshData();
        this.refreshInfoData = DeviceEventEmitter.addListener('refreshInfoListener', this.refreshData)
    }

    refreshData = () => {
        storage.load('userInfo', res => {
            const { userid, username, headImg, phone } = res;
            this.setState({
                userid, username, headImg, phone,
            })
        })
    }

    toChangeUserInfo = () => {
        const { navigation } = this.props;
        navigation.navigate('ChangeUserInfo');
    }

    toAlarm = () => {
        const { navigation } = this.props;
        navigation.navigate('Alarm');
    }

    toHealth = () => {
        const { navigation } = this.props;
        navigation.navigate('HealthHome');
    }
    

    render() {
        const { userid, username, headImg, phone } = this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <List>
                        <ListItem itemDivider thumbnail  style={{ backgroundColor: '#fff' }}>
                            <Left>
                                <Thumbnail square source={headImg ? { uri: headImg } : require('../../assets/splash.png')}/>
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 18 }}>{username}</Text>
                                <Text></Text>
                                <Text note numberOfLines={1}>手机号：{phone}</Text>
                            </Body>
                            <Right>
                                <Button transparent onPress={() => this.toChangeUserInfo()}>
                                <Text>修改</Text>
                                </Button>
                            </Right>
                        </ListItem>

                        <ListItem itemDivider icon  style={{ backgroundColor: "#fff", marginTop: 20 }}>
                            <Left>
                                <Button style={{ backgroundColor: "#e53d33" }}>
                                    <Icon active name="ios-notifications" />
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 14 }}>报警设置</Text>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => this.toAlarm()}>
                                    <Icon active name="arrow-forward" />
                                </TouchableOpacity>
                            </Right>
                        </ListItem>

                        <ListItem itemDivider icon  style={{ backgroundColor: "#fff", marginTop: 2 }}>
                            <Left>
                                <Button style={{ backgroundColor: "#64c957" }}>
                                    <Icon active name="md-flower" />
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 14 }}>健康管理</Text>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => this.toHealth()}>
                                    <Icon active name="arrow-forward" />
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#f2f2f2',
    },
    
});
