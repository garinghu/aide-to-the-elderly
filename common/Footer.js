import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge, View } from 'native-base';
import { BottomNavigation } from 'react-native-material-ui';
import SocketIOClient from 'socket.io-client';

import { storage } from '../storage';
import Config from '../config';
import IconTip from './IconTip';
import Axios from 'axios';

const SCOKET_SERVER = Config.socketServer;
const DELETE_HAS_REQUEST_BY_ID = `${Config.proxy}/deletehasrequestbyid`;
const horizontal = true;
const TabNavigator={
    PostBar: {
        navigationOptions: {
            title: '发现',
            tabBarIcon: <View><Icon theme={{ iconFamily: 'AntDesign' }} name='md-star' 
            style={{ color: '#ed6560' }} size={horizontal ? 20 : 25}/></View>,
        },
    },
    Chat: {
        navigationOptions: {
            title: '聊天',
            tabBarIcon: <View>
            <Icon theme={{ iconFamily: 'AntDesign' }} name='ios-eye' 
            style={{ color: '#ed6560' }} size={horizontal ? 20 : 25}/>
            <View style={{position: 'absolute', right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#f00'}}></View>
            </View>,
        },
    },
    My: {
        navigationOptions: {
            title: '我的',
            tabBarIcon: <View><Icon theme={{ iconFamily: 'AntDesign' }} name='md-people' 
            style={{ color: '#ed6560' }} size={horizontal ? 20 : 25}/></View>,
        },
    },
    Clock: {
        navigationOptions: {
            title: '提醒',
            tabBarIcon: <View><Icon theme={{ iconFamily: 'Entypo' }} name='ios-alarm' 
            style={{ color: '#ed6560' }} size={horizontal ? 20 : 25}/></View>,
        },
    },
}

export default class NavFooter extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.socket = SocketIOClient(SCOKET_SERVER);
        let tabs = Object.keys(navigation.router.childRouters);
        tabs.splice(tabs.indexOf('Login'), 1);
        this.socket.on('notInRoomTip', this.onReceivedTip);
        this.socket.on('addFriends', this.onReceivedFriends);
        this.socket.on('getFriendReq', this.onReceivedNewFriends);
        this.state = {
            show: true,
            tabs,
            active: '0',
            showChatTip: false,
        }
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('changeNavTabs', this.changeTabs)
        this.subscriptionShow = DeviceEventEmitter.addListener('changeShowMode', this.changeShowMode)
        this.subscriptionShowChatTip = DeviceEventEmitter.addListener('changeShowMode', this.removeChatTip)
        let showChatTip = false;
        storage.load('chatInfo', (data) => {
            let chatRooms = [...data]
            // merge
            for(let i in chatRooms) {
                if(chatRooms[i].messages > 0) {
                    showChatTip = true;
                }
            }
            if(!showChatTip) {
                storage.load('friendInfo', (indata) => {
                   if(indata.length > 0) {
                    showChatTip = true
                   }
                })
            }
            this.setState({ showChatTip })
        })

    }

    onReceivedNewFriends = (info) => {
        storage.load('userInfo', res => {
            const { userid } = res;
            if(info.info.userid == userid) {
                Axios.post(DELETE_HAS_REQUEST_BY_ID, { id: info.info.id })
                .then(res => {
                    
                })
            }
        })
    }

    removeChatTip = () => {
        this.setState({ showChatTip: false, })
    }

    onPress = (tab, active) => {
        const { navigation } = this.props;
        navigation.navigate(tab)
        this.setState({ active: `${active}` });
        if(tab == 'Chat') {
            this.setState({ showChatTip: false, })
        }
    }

    changeTabs = (active) => {
        const { tabs } = this.state;
        this.setState({ active: `${tabs.indexOf(active)}` });
    }

    changeShowMode = (show) => {
        this.setState({ show })
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
            storage.save('chatInfo',  chatRooms);
        })

        this.setState({ showChatTip: true });
    }

    onReceivedFriends = (info) => {
        storage.load('userInfo', res => {
            const { userid } = res;
            const { userInfo, to, text, date } = info.info;
            if(userid == to) {
                let alreadyIn = false;
                this.state.friendsTipNumber++;
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
                        this.setState({ showChatTip: true });
                    }
                })
            }
        })
    }

    render() {
        const { show, tabs, active, showChatTip } = this.state;
        return (
            <View>
                { show && <BottomNavigation active={active} hidden={false}
                style={{
                    container: {
                        height: 60,
                    },
                    iconActive: {
                        color: '#f00'
                    }
                    
                }}>
                    {tabs.map((item, index) =><BottomNavigation.Action
                        style={{
                            container: {
                                height: 50,
                            },
                            icon: {
                                color: '#dcdcda'
                            },
                            iconActive: {
                                color: '#f00'
                            },
                            labelActive: {
                                color: '#ed6560'
                            }
                        }}
                        key={`${index}`}
                        icon={item == 'Chat' ?  
                        <View>
                            <Icon theme={{ iconFamily: 'AntDesign' }} name='ios-eye' 
                            style={{ color: '#ed6560' }} size={horizontal ? 20 : 25}/>
                            {
                                showChatTip && <View style={{position: 'absolute', right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#f00'}}></View>
                            }
                        </View>: 
                        TabNavigator[item].navigationOptions.tabBarIcon}
                        label={TabNavigator[item].navigationOptions.title}
                        onPress={() => this.onPress(item, index)}
                    />)}
                </BottomNavigation> }
            </View>
        );
    }
}
