import React from 'react';
import { Permissions, Notifications } from 'expo';
import { StyleSheet, View, Image, DeviceEventEmitter, ListView, ActivityIndicator,} from 'react-native';
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

export default class PostBar extends React.Component {
    constructor(props) {
        super(props);
        this.dataSource = []
        this.state = {
            cardList: (new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})),
            requestTime: 1,
            hasAll: false,
            showModal: false,
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
        // storage.save('clocks', []);
        // storage.save('searchList', searchList);
        // storage.save('friendInfo', friendInfo);
        // storage.load('userInfo', res => {
        //     console.log(res);
        // })
        this.subscription = DeviceEventEmitter.addListener('Key', this.refreshData)
        this.subscriptionShowModal = DeviceEventEmitter.addListener('showModal', this.showModal)
        this.subscriptionCloseModal = DeviceEventEmitter.addListener('closeModal', this.closeModal)
        // this.refreshData();

        // 获取定位权限
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.LOCATION
        );
        console.log(existingStatus)
    }

    componentWillUnmount() {
        this.subscription.remove();
    };

    refreshData = () => {
        storage.load('userInfo', (data) => {
            const { userid } = data;
            Axios.post(GET_ALL_MESSAGE, { userid, requestTime: 1 }).then(res => {
                this.setState({
                    cardList: this.state.cardList.cloneWithRows(res.data),
                    hasAll: false,
                })
            }).catch(err => {
                console.log(err);
            })
        })
    }

    cardPress = item => {
        const navigation = this.props.navigation;
        navigation.navigate('CardDetail', {
            detail: item,
        });
    }

    onPullRelease = (resolve) => {
        this.refreshData();
		setTimeout(() => {
            resolve();
        }, 1000);
    }

    loadMore = () => {
        const { requestTime } = this.state;
        storage.load('userInfo', (data) => {
            const { userid } = data;
            Axios.post(GET_ALL_MESSAGE, { userid, requestTime }).then(res => {
                if(res.data == 'all') {
                    this.setState({ hasAll: true });
                } else {
                    this.dataSource = [...this.dataSource, ...res.data];
                    this.setState({
                        cardList: this.state.cardList.cloneWithRows(this.dataSource),
                        requestTime: this.state.requestTime + 1,
                    })
                }
            }).catch(err => {
                console.log(err);
            })
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
        if(this.state.hasAll) {
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

    renderRow = (item) => <ShowCard key={item.id} cardContent={item} cardPress={() => this.cardPress(item)}/>

    showModal = () => {
        this.setState({ showModal: true })
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    render() {
        const { cardList, showModal } = this.state;
        return (
            <Container>
                    
                    {
                        // state.cardList.map(item => <ShowCard key={item.id} 
                        //     cardContent={item} 
                        //     cardPress={() => this.cardPress(item)}/>)
                    } 
                    <PullList
                        style={{}}
                        onPullRelease={(resolve) => this.onPullRelease(resolve)}
                        topIndicatorRender={this.topIndicatorRender} 
                        topIndicatorHeight={60}
                        dataSource={cardList}
                        pageSize={5}
                        initialListSize={5}
                        renderRow={this.renderRow}
                        onEndReached={(resolve) => this.loadMore(resolve)}
                        renderFooter={this.renderFooter}
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
