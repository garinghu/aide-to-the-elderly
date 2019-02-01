import React from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, List, ListItem, Thumbnail, Text, Left, Right, Icon } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import Config from '../../config';
import MyHeader from '../../common/MyHeader';
import ChangeInfoModal from './ChangeInfoModal';
import ChangeImgModal from './ChangeImgModal';

const CHANGE_NAME = `${Config.proxy}/changename`;

export default class ChangeUserInfo extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            username: '',
            headImg: '',
            phone: '',
            show: false,
            showImgModal: false,
            infoModalHeadTitle: '',
            infoValue: '',
            onOK: {},
        };
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
        storage.load('userInfo', res => {
            const { userid, username, headImg, phone } = res;
            this.setState({
                userid, username, headImg, phone,
            })
        })
        this.refreshInfoData = DeviceEventEmitter.addListener('refreshInfoData', this.refreshData)
    }

    refreshData = () => {
        storage.load('userInfo', res => {
            const { userid, username, headImg, phone } = res;
            this.setState({
                userid, username, headImg, phone,
            })
        })
    }

    showModal = (infoModalHeadTitle, infoValue, onOK) => {
        this.setState({ show: true, infoModalHeadTitle, infoValue, onOK })
    }

    closeModal = () => {
        this.setState({ show: false })
    }

    showImgModal = () => {
        this.setState({ showImgModal: true })
    }

    closeImgModal = () => {
        this.setState({ showImgModal: false })
    }

    changeName = (name) => {
        storage.load('userInfo', data => {
            Axios.post(CHANGE_NAME, { name, userid: data.userid })
            .then(res => {
                console.log(res.data);
                data.username = name;
                storage.save('userInfo', data)
                this.closeModal();
                this.refreshData();
                DeviceEventEmitter.emit('refreshInfoData');
            })
        })
    }
    

    render() {
        const { userid, username, headImg, phone, show, showImgModal, infoModalHeadTitle, infoValue, onOK } = this.state;
        return (
            <Container style={styles.container}>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                }}/>
                <Content>
                    <List>
                        <ListItem itemDivider style={{ backgroundColor: '#fff' }}>
                            <Left>
                                <Text>头像</Text>
                            </Left>
                            <Right style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <Thumbnail square source={headImg ? { uri: headImg } : require('../../assets/splash.png')} style={{ height: 40, width: 40 }}/>
                                <Icon name="arrow-forward" style={{ marginLeft: 20 }} onPress={this.showImgModal}/>   
                            </Right>
                        </ListItem>
                        <ListItem itemDivider style={{ backgroundColor: '#fff', marginTop: 2 }}>
                            <Left>
                                <Text>名字</Text>
                            </Left>
                            <Right style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <Text  style={{ color: '#bbb' }}>{username}</Text>
                                <Icon name="arrow-forward" style={{ marginLeft: 20 }} onPress={() => this.showModal('名字', username, this.changeName)}/>
                            </Right>
                        </ListItem>
                        <ListItem itemDivider style={{ backgroundColor: '#fff', marginTop: 2}}>
                            <Left>
                                <Text>绑定手机</Text>
                            </Left>
                            <Text style={{ color: '#bbb' }}>{phone}</Text>
                        </ListItem>
                        <ListItem itemDivider style={{ backgroundColor: '#fff', marginTop: 2 }}>
                            <Left>
                                <Text>更多</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" style={{ marginLeft: 20 }}/>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
                <ChangeInfoModal show={show} closeModal={this.closeModal} title={infoModalHeadTitle} value={infoValue} onOk={onOK}/>
                <ChangeImgModal showImgModal={showImgModal} closeImgModal={this.closeImgModal} imgUri={headImg}/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#f2f2f2',
    },
    
});
