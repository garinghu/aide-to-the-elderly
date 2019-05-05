import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Tab, Tabs, Thumbnail, Text, ScrollableTab, Footer, FooterTab, Button } from 'native-base';
import Axios from 'axios';
import SocketIOClient from 'socket.io-client';

import { storage } from '../../storage';
import Config from '../../config';
import MyHeader from '../../common/MyHeader';
import ShowCard from '../../common/ShowCard';

const SCOKET_SERVER = Config.socketServer;
const GET_ALL_BY_USERID = `${Config.proxy}/getallbyuserid`;
const GET_FRIEND_BY_USERID = `${Config.proxy}/getfriendsbyuserid`;
const DELETE_FRIEND_BY_USER_ID = `${Config.proxy}/deletefriendbyuserid`;
const tabs = ['发帖', '点赞', '收藏'];

export default class WritterList extends React.Component {
    
    constructor(props) {
        super(props);
        this.socket = SocketIOClient(SCOKET_SERVER);
        const { navigation } = this.props;
        const writterId = navigation.getParam('cardWritterId');
        const fromSearch = navigation.getParam('fromSearch');
        const alreadyFriend = navigation.getParam('alreadyFriend');
        this.state = {
            isMe: false, 
            writterId,
            alreadyFriend: false,
            userInfo: {},
            messages: [],
            goods: [],
            collections: [],
            fromSearch, 
        }
    }

    componentDidMount() {
        const { writterId } = this.state;
        DeviceEventEmitter.emit('changeShowMode', false);
        Axios.post(GET_ALL_BY_USERID, { userid: writterId })
        .then(res => {
            const { userInfo, messages, goods, collections } = res.data;
            this.setState({ userInfo, messages, goods, collections })
        })
        storage.load('userInfo', (data) => {
            Axios.post(GET_FRIEND_BY_USERID, { userid: data.userid })
            .then(res => {
                for(let i in res.data) {
                    if(res.data[i].withWhomInfo.Id == writterId) {
                        this.setState({ alreadyFriend: true })
                    }
                }
            })
            if(writterId == data.userid) {
                this.setState({ isMe: true });
            }
        })
    }

    toAddFriends = () => {
        const { writterId } = this.state;
        storage.load('userInfo', (data) => {
            this.socket.emit('addFriends', {
                userInfo: data,
                to: writterId,
            })
        })
        Alert.alert('已发送申请')
    }

    toDeleteFriends = () => {
        const { writterId } = this.state;
        storage.load('userInfo', (data) => {
            Axios.post(DELETE_FRIEND_BY_USER_ID, { userid: data.userid, withWhom: writterId })
            .then(res => {
                console.log(res.data);
            })
        })
        DeviceEventEmitter.emit('refreshFriends');
    }

    toChatDetail = () => {
        const { userInfo } = this.state;
        const navigation = this.props.navigation;
        navigation.navigate('ChatDetail', { cardWritterId: userInfo.Id });
        DeviceEventEmitter.emit('changeNavTabs', 'Chat');
    }
    

    render() {
        const { userInfo, messages, goods, collections, alreadyFriend, isMe, fromSearch } = this.state;
        return (
            <Container style={styles.container}>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                    fromSearch && DeviceEventEmitter.emit('showModal');
                }}/>
                <Content>
                    <View style={styles.userInFoContainer}> 
                        <Thumbnail source={{uri: userInfo.head}} style={{ marginTop: 20 }}/>
                        <Text style={{ color: '#fff', marginTop: 10 }}>{userInfo.username}</Text>
                        <Text style={{ color: '#fff', marginTop: 10 }} note>签名：{userInfo.signature}</Text>
                    </View>
                    <Tabs renderTabBar={()=> <ScrollableTab />}>
                        <Tab heading="发帖">
                           {messages.map((item, index) => <ShowCard 
                            key={`send-${index}`}
                            cardContent={item}/>)} 
                        </Tab>
                        <Tab heading="点赞">
                            {goods.map((item, index) => <ShowCard 
                            key={`send-${index}`}
                            cardContent={item.messageInfo}/>)}
                        </Tab>
                        <Tab heading="收藏">
                            {collections.map((item, index) => <ShowCard 
                            key={`send-${index}`}
                            cardContent={item.messageInfo}/>)}
                        </Tab>
                    </Tabs>
                </Content>
                {isMe || <Footer>
                    <FooterTab>
                        {alreadyFriend ? <Button vertical onPress={() => this.toDeleteFriends()}>
                            <Text style={{ color: '#ed6560' }}>删除好友</Text>
                        </Button> : <Button vertical onPress={() => this.toAddFriends()}>
                            <Text>添加好友</Text>
                        </Button>}
                        <Button vertical onPress={() => this.toChatDetail()}>
                            <Text>发消息</Text>
                        </Button>
                    </FooterTab>    
                </Footer>}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#f2f2f2',
    },
    userInFoContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
        height: 150,
        backgroundColor: '#ed6560',
    }
});
