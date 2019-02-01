import React from 'react';
import { StyleSheet, View, Image, DeviceEventEmitter, TouchableOpacity, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Content, List, Tab, Tabs, Header, ListItem, Thumbnail, Text, Left, Body, Right, Button, TabHeading, Icon } from 'native-base';
import Axios from 'axios';
import SocketIOClient from 'socket.io-client';

import data from './data';
import { storage } from '../../storage';
import Config from '../../config';
import MessageCard from './MessageCard';


const SCOKET_SERVER = Config.socketServer;
const GET_CHAT_ROOMS_BY_USERS = `${Config.proxy}/getchatRoomsbyusers`;
const GET_ALL_BY_CHAT_ROOM_ID = `${Config.proxy}/getallbychatroomid`;
const GET_ALL_BY_CHAT_ROOM_ID_ARR = `${Config.proxy}/getallbychatroomidarr`;
const GET_FRIEND_BY_USER_ID = `${Config.proxy}/getfriendsbyuserid`;
const ADD_FRIEND_BY_USER_ID = `${Config.proxy}/addfriendbyuserid`;

export default class My extends React.Component {
    constructor(props) {
        super(props);
        this.socket = SocketIOClient(SCOKET_SERVER);
        this.socket.on('notInRoomTip', this.onReceivedTip);
        this.socket.on('addFriends', this.onReceivedFriends);
        this.state = {
            userId: '',
            chatRooms: [],
            friends: [],
            newFriends: [],
            messageTipNumbers: 0,
            friendsTipNumbers: 0
        }
    }

    componentDidMount() {
        storage.load('userInfo', (data) => {
            this.setState({
                userId: data.userid,
            }, () => {
                Axios.post(GET_FRIEND_BY_USER_ID, { userid: data.userid, })
                .then(res => {
                    this.setState({ friends: res.data });
                })
                storage.load('chatInfo', (indata) => {
                    let messageTipNumbers = 0;
                    for(let i in indata) {
                        messageTipNumbers += indata[i].messages;
                    }
                    this.setState({ chatRooms: indata, messageTipNumbers });
                })

                storage.load('friendInfo', (indata) => {
                    let friendsTipNumbers = indata.length;
                    this.setState({ newFriends: indata, friendsTipNumbers });
                })
            })
            this.socket.emit('userJoinedAllRoom', {
                userid: data.userid,
            })
        })
        this.subscription = DeviceEventEmitter.addListener('refreshChatList', this.refreshData)
        this.refreshFriends = DeviceEventEmitter.addListener('refreshFriends', this.refreshFriends)
        this.refreshMessageTips = DeviceEventEmitter.addListener('refreshMessageTips', this.refreshMessageTip)
    }

    onReceivedTip = (tip) => {
        storage.load('chatInfo', (data) => {
            let chatRooms = [...data]
            let alreadyIn = false;
            // merge
            for(let i in chatRooms) {
                if(chatRooms[i].chatid == tip.chatid) {
                    chatRooms[i].headImg = tip.headImg;
                    chatRooms[i].lastMessage = tip.lastMessage;
                    chatRooms[i].lastMessageTime = tip.lastMessageTime;
                    chatRooms[i].messages++;
                    alreadyIn = true;
                }
            }
            if(!alreadyIn) {
                chatRooms.unshift({...tip, messages: 1 })
            }
            this.refreshMessageTip();
            this.state.chatRooms = chatRooms;
            storage.save('chatInfo',  chatRooms);
            this.setState({ chatRooms });
        })
    }

    onReceivedFriends = (info) => {
        const { userId, newFriends } = this.state
        const { userInfo, to, text, date } = info.info;
        if(userId == to) {
            let alreadyIn = false;
            storage.load('friendInfo', (indata) => {
                for(let i in indata) {
                    if(indata[i].userid == userInfo.userid) {
                        alreadyIn = true;
                    }
                }
                if(!alreadyIn) {
                    storage.save('friendInfo',  [...indata, {
                        ...userInfo, text, date,
                    }]);
                    this.state.newFriends = [...newFriends, {
                        ...userInfo, text, date,
                    }]
                    this.state.friendsTipNumber++;
                }
            })
        }
        this.setState({});
    }

    onDelete = (chatid) => {
        storage.load('chatInfo', (data) => {
            const newData = [...data];
            let index = 0;
            for(let i in newData) {
                if(newData[i].chatid == chatid) {
                    index = i;
                }
            }
            newData.splice(index, 1);
            this.setState({ chatRooms: newData })
            storage.save('chatInfo',  newData);
        })
    }

    toTop = (chatid) => {
        storage.load('chatInfo', (data) => {
            const newData = [...data];
            let index = 0;
            let toTopMessage = {};
            for(let i in newData) {
                if(newData[i].chatid == chatid) {
                    index = i;
                    toTopMessage = {...newData[i]}
                }
            }
            newData.splice(index, 1);
            newData.unshift(toTopMessage);
            this.setState({ chatRooms: newData })
            storage.save('chatInfo',  newData);
        })
    }

    refreshData = () => {
        storage.load('chatInfo', (data) => {
            this.setState({ chatRooms: data });
        })
    }

    refreshFriends = () => {
        storage.load('userInfo', (data) => {
            Axios.post(GET_FRIEND_BY_USER_ID, { userid: data.userid, })
            .then(res => {
                this.setState({ friends: res.data });
            })
        })
    }

    refreshMessageTip = () => {
        storage.load('chatInfo', (indata) => {
            let messageTipNumbers = 0;
            for(let i in indata) {
                messageTipNumbers += indata[i].messages;
            }
            this.setState({ messageTipNumbers });
        })
    }

    toFriendDetail = (cardWritterId) => {
        const navigation = this.props.navigation;
        navigation.navigate('FriendDetail', { cardWritterId, alreadyFriend: true });
    }

    addFriends = (withWhom, userInfo, index) => {
        const { userId } = this.state;
        Axios.post(ADD_FRIEND_BY_USER_ID, {
            userid: userId,
            withWhom,
        })
        .then(res => {
            this.state.friends.unshift({
                with_whom: userInfo.userid,
                withWhomInfo: {
                    head: userInfo.headImg,
                    username: userInfo.username,
                },
            })
            this.state.newFriends.splice(index, 1);
            this.setState({})
        })
    }

    removeNewFriends = (index) => {
        storage.load('friendInfo', (indata) => {
            let friends = [...indata];
            friends.splice(index, 1)
            storage.save('friendInfo',  friends);
            this.setState({ newFriends: friends, friendsTipNumbers: friends.length });
        })
    }

    render() {
        const { chatRooms, friends, newFriends, messageTipNumbers,  friendsTipNumbers } = this.state;
        return (
            <Container>
                <Header hasTabs style={{ height: 20 }}/>
                <Content>
                    <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ed6560' }}>
                        <Tab heading={ <TabHeading>
                            <Text>消息</Text>
                            {messageTipNumbers == 0 || <View style={styles.tip}>
                                <Text style={{ color: '#fff', fontSize: 10, }}>{ messageTipNumbers }</Text>
                            </View>}
                        </TabHeading>}
                        topTabBarActiveTextColor='#ed6560'>
                            <List>
                                {chatRooms.map((item, index) => <MessageCard 
                                    key={`${item.lastMessageTime}-${item.lastMessage}`} 
                                    detail={item}
                                    onDelete={() => this.onDelete(item.chatid)}
                                    onTop={() => this.toTop(item.chatid)}
                                    />)}
                            </List>
                        </Tab>
                        <Tab heading="联系人">
                            <List>
                                {friends.map((item, index) => <ListItem thumbnail key={`${index}-${item.with_whom}`}>
                                <Left>
                                    <Thumbnail source={{ uri: item.withWhomInfo.head }} />
                                </Left>
                                <Body>
                                    <Text>{item.withWhomInfo.username}</Text>
                                    <Text></Text>
                                </Body>
                                <Right>
                                    <Button transparent onPress={() => this.toFriendDetail(item.with_whom)}>
                                    <Text>查看</Text>
                                    </Button>
                                </Right>
                                </ListItem>)}
                            </List>
                        </Tab>
                        <Tab heading={ <TabHeading>
                            <Text>新朋友</Text>
                            {friendsTipNumbers == 0 || <View style={styles.tip}>
                                <Text style={{ color: '#fff', fontSize: 10, }}>{ friendsTipNumbers }</Text>
                            </View>}
                        </TabHeading>}>
                            <List>
                                {newFriends.map((item, index) => <ListItem thumbnail key={`${index}-${item.userid}`}>
                                    <Left>
                                        <TouchableOpacity onPress={() => this.toFriendDetail(item.userid)}>
                                            <Thumbnail source={{ uri: item.headImg }} />
                                        </TouchableOpacity>
                                    </Left>
                                    <Body>
                                        <Text>{item.username}</Text>
                                        <Text note>申请原因：{item.text}</Text>
                                    </Body>
                                    <Right>
                                        <View style={styles.newFriendButtonContainer}>
                                            <Button transparent onPress={() => this.addFriends(item.userid, item, index)}>
                                                <Text>同意</Text>
                                            </Button>
                                            <Button transparent onPress={() => this.removeNewFriends(index)}>
                                                <Text>忽略</Text>
                                            </Button>
                                        </View>
                                    </Right>
                                </ListItem>)}
                            </List>
                        </Tab>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    tip: {
        width: 20, 
        height: 20, 
        borderRadius: 10, 
        backgroundColor: '#f00', 
        alignItems:'center', 
        justifyContent: 'center',
    },
    newFriendButtonContainer: {
        flex: 1,
        flexDirection: 'row',

    }
});
