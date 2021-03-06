import React from 'react';
import { Permissions, Notifications } from 'expo';
import { StyleSheet, View, Image, DeviceEventEmitter, ListView, ActivityIndicator, FlatList } from 'react-native';
import {PullList} from 'react-native-pull';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Drawer, Text, Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import BottomFab from '../../common/BottomFab';
import ShowCard from '../../common/ShowCard';
import SearchModal from './SearchModal';
import Config from '../../config';
import Data from './data';

import PostHeader from './PostHeader';

const GET_ALL_MESSAGE = `${Config.proxy}/getallmessage`;
const SEARCH_MESSAGES_BY_FRIENDS = `${Config.proxy}/searchmessagesbyfriends`;

export default class PostBar extends React.Component {
    constructor(props) {
        super(props);
        this.dataSource = [];
        this.friendDataSource = [];
        this.state = {
            cardList: [],
            cardFriendList: [],
            requestTime: 0,
            requestFriendTime: 0,
            hasAll: false,
            friendHasAll: false,
            showModal: false,
            messagesType: 'normal',
            firstLoad: true,
            refreshing: false,
            enableLoadMore: true,
        };
    }

    async componentDidMount() {
        // 测试环境偶尔失效，要重新save
        // const userInfo = {
        //     userid: 1,
        //     username: 'garinghu',
        //     headImg: '',
        // };
        const chatInfo = [];
        const searchList = [];
        const AlarmInfo = [{
            id: 0,
            name: '胡家麟',
            phone: '18845893435',
            text: '老年助手开发者',
            choose: true,
        }]
        const friendInfo = [];
        // storage.save('userInfo',  {});
        // storage.save('alarmInfo',  AlarmInfo);
        // storage.save('chatInfo',  chatInfo);
        storage.save('clocks', []);
        // storage.save('searchList', searchList);
        // storage.save('friendInfo', friendInfo);
        storage.save('healthInfo', {
            '2019-02-12': {
                weight: 145,
                sleep: 10,
                hBloodPressure: 140,
                lBloodPressure: 60,
                pulse: 40,
                date: '2019-02-12',
            }
        });
        this.subscription = DeviceEventEmitter.addListener('Key', this.loadMore)
        this.subscriptionShowModal = DeviceEventEmitter.addListener('showModal', this.showModal)
        this.subscriptionCloseModal = DeviceEventEmitter.addListener('closeModal', this.closeModal)
        this.subscriptionChangeMessageType = DeviceEventEmitter.addListener('changeMessageType', this.changeMessageType)

        // 获取定位权限
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.LOCATION
        );
        this.loadMore();
    }

    componentWillUnmount() {
        this.subscription.remove();
    };

    changeMessageType = (type) => {
        this.setState({ messagesType: type }, () => { this.loadMore(); })
    }

    refreshData = () => {
        const { messagesType } = this.state;
        if(messagesType == 'normal') {
            this.setState({
                cardList: [], 
                refreshing: true,
                requestTime: 0,
            }, () => {
                storage.load('userInfo', (data) => {
                    const { userid } = data;
                    Axios.post(GET_ALL_MESSAGE, { userid, requestTime: 1 }).then(res => {
                        if(res.data == 'all') {
                            this.setState({ hasAll: true});
                        } else {
                            this.setState({
                                cardList: res.data,
                                hasAll: false,
                                refreshing: false,
                                requestTime: 1,
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                })
            })
        } else {
            this.setState({
                cardFriendList: [], 
                refreshing: true,
                requestFriendTime: 0
            }, () => {
                storage.load('userInfo', (data) => {
                    const { userid } = data;
                    Axios.post(SEARCH_MESSAGES_BY_FRIENDS, { userid, requestTime: 1 }).then(res => {
                        if(res.data == 'all') {
                            this.setState({ hasAll: true});
                        } else {
                            this.setState({
                                cardFriendList: res.data,
                                hasAll: false,
                                refreshing: false,
                                requestFriendTime: 1,
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                })
            })
        }
    }

    cardPress = item => {
        const navigation = this.props.navigation;
        navigation.navigate('CardDetail', {
            detail: item,
        });
    }

    onPullRelease = () => {
        this.refreshData();
    }

    loadMore = () => {
        const { requestTime, messagesType, requestFriendTime, firstLoad, enableLoadMore  } = this.state;
        storage.load('userInfo', (data) => {
            const { userid } = data;
            if(messagesType == 'normal') {
                Axios.post(GET_ALL_MESSAGE, { userid, requestTime: this.state.requestTime + 1 }).then(res => {
                    if(res.data == 'all') {
                        this.setState({ hasAll: true });
                    } else {
                        this.dataSource = [...this.state.cardList, ...res.data];
                        this.setState({
                            cardList: this.dataSource,
                            requestTime: this.state.requestTime + 1,
                            hasAll: false,
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                Axios.post(SEARCH_MESSAGES_BY_FRIENDS, { userid, requestTime: this.state.requestFriendTime + 1 }).then(res => {
                    console.log(res.data);
                    if(res.data == 'all') {
                        this.setState({ friendHasAll: true });
                    } else {
                        this.dataSource = [...this.state.cardFriendList, ...res.data];
                        this.setState({
                            cardFriendList: this.dataSource,
                            requestFriendTime: this.state.requestFriendTime + 1,
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }

    topIndicatorRender = (pulling, pullok, pullrelease) => {
        const hide = {position: 'absolute', left: -10000};
        const show = {position: 'relative', left: 0};
        setTimeout(() => {
            if (pulling) {
                this.txtPulling && this.txtPulling.setNativeProps({style: show});
                this.txtPullok && this.txtPullok.setNativeProps({style: hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide});
            } else if (pullok) {
                this.txtPulling && this.txtPulling.setNativeProps({style: hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: show});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide});
            } else if (pullrelease) {
                this.txtPulling && this.txtPulling.setNativeProps({style: hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: show});
            }
        }, 1);
		return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
                <ActivityIndicator size="small" color="#ed6560"/>
                <Text ref={(c) => {this.txtPulling = c;}} style={{ color: '#ed6560' }}>正在刷新...</Text>
                <Text ref={(c) => {this.txtPullok = c;}} style={{ color: '#ed6560' }}>正在刷新...</Text>
                <Text ref={(c) => {this.txtPullrelease = c;}} style={{ color: '#ed6560' }}>正在刷新...</Text>
    		</View>
        );
    }

    renderFooter = () => {
        const { messagesType, hasAll, friendHasAll } = this.state;
        if((messagesType == 'normal' && hasAll) || (messagesType != 'normal' && friendHasAll)) {
            return <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
                <Text style={{ color: '#ed6560' }}>暂时没有最新的动态了...</Text>
            </View>;
        }
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
                <ActivityIndicator  size="small" color="#ed6560" />
            </View>
        );
    }

    renderRow = (item) => {
        return <ShowCard key={item.item.id} cardContent={item.item} cardPress={() => this.cardPress(item.item)}/>
    }

    showModal = () => {
        this.setState({ showModal: true })
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    render() {
        const { cardList, showModal, cardFriendList, messagesType, refreshing } = this.state;
        return (
            <Container>
                    <FlatList
                        style={{}}
                        onRefresh={() => this.onPullRelease()}
                        refreshing={refreshing}
                        topIndicatorRender={this.topIndicatorRender} 
                        topIndicatorHeight={60}
                        data={messagesType == 'normal' ? cardList : cardFriendList}
                        pageSize={5}
                        initialListSize={5}
                        renderItem={this.renderRow}
                        onEndReached={() => this.loadMore()}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={this.renderFooter}
                    />
                <BottomFab />
                <SearchModal show={showModal} closeModal={() => this.setState({ showModal: false })}/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
