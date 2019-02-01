import React from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Footer, FooterTab, Button } from 'native-base';
import WS from 'react-native-websocket';
import SocketIOClient from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';
import Axios from 'axios';

import { storage } from '../../storage';
import Config from '../../config';
import { Base64 } from '../../common/setting';
import MyHeader from '../../common/MyHeader';

const SCOKET_SERVER = Config.socketServer;
const GET_CHAT_ROOM_ID_BY_USERS = `${Config.proxy}/getchatroombyusers`;
const STORE_MESSAGES_BY_CHAT_COOM_ID = `${Config.proxy}/storemessagesbychatroomid`;
const GET_USERINFO_BY_ID = `${Config.proxy}/getuserinfobyid`;
const b = new Base64();

export default class ChatDetail extends React.Component {
    constructor(props) {
        super(props);
        this.socket = SocketIOClient(SCOKET_SERVER);
        this.socket.on('message', this.onReceivedMessage);
        const { navigation } = this.props;
        const withWhom = navigation.getParam('cardWritterId');
        this.state = {
            withWhom,
            messages: [],
            userId: '',
            chatId: '',
        }
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
        const { userId, withWhom } = this.state;
        storage.load('userInfo', (data) => {
            this.setState({
                userId: data.userid,
            }, () => {
                Axios.post(GET_CHAT_ROOM_ID_BY_USERS, { 
                    userId: data.userid, withWhom,
                })
                .then(res => {
                    const { chatId, messages } = res.data;
                    this.setState({
                        chatId, 
                        messages: JSON.parse(b.decode(messages))
                    })
                    this.socket.emit('userJoined', {
                        userId: data.userid,
                        chatId,
                    });
                    storage.load('chatInfo', (data) => {
                        alreadyInStore = false;
                        for(let i in data) {
                            if(data[i].chatid == chatId) {
                                alreadyInStore = true;
                            }
                        }
                        if(!alreadyInStore) {
                            const newData = [...data];
                            Axios.post(GET_USERINFO_BY_ID, { 
                                userid: withWhom,
                            })
                            .then(res => {
                                const { Id, username, head } = res.data
                                newData.unshift({
                                    userid: withWhom,
                                    chatid: chatId,
                                    username,
                                    headImg: head,
                                    messages: 0,
                                    lastMessage: '',
                                    lastMessageTime: '',
                                })
                                console.log(withWhom)
                                storage.save('chatInfo',  newData);
                                DeviceEventEmitter.emit('refreshChatList', '待传参数');
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        }
                    });
                })
                .catch(err => {
                    console.log(err)
                })
            })
        })
    }

    onSend = (messages) => {
        const { chatId } = this.state;
        storage.load('userInfo', (data) => {
            this.socket.emit('message', { 
                message: messages[0],
                userInfo: data,
                chatId,
            });
            this._storeMessages(messages);
        })
    }

    onReceivedMessage = (messages) => {
        this._storeMessages(messages);
    }

    _storeMessages(messages) {
        const { chatId } = this.state;
        this.setState((previousState) => {
            Axios.post(STORE_MESSAGES_BY_CHAT_COOM_ID, { 
                chatId, messages: GiftedChat.append(previousState.messages, messages),
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        }, () => {
            
        });
    }

    render() {
        const { messages, userId } = this.state;
        const user = { _id: userId || -1 };
        return (
            <View style={{ flex: 1 }}>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                }}/>
                <GiftedChat
                messages={this.state.messages}
                onSend={this.onSend}
                user={user}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
