import React, { Component } from 'react';
import { StyleSheet, View, Image, CheckBox, Switch, DeviceEventEmitter, Alert } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Form, Item, Picker, Icon, Label, Input } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import Config from '../../config';
import { debounce, randomNum } from '../../common/setting';
import MyHeader from '../../common/MyHeader';

const SEND_TIME = 60;
const SEND_SMS = `${Config.proxy}/sendsms`;

export default class AlarmDetail extends Component {
    constructor(props){
        super(props)
        const { navigation } = this.props;
        const mode = navigation.getParam('mode') || '';
        const detail = mode == 'new' ? {} : navigation.getParam('data');
        this.state = {
            mode,
            showCode: mode ? true: false,
            showSendButton: true,
            sendTime: SEND_TIME,
            name: '',
            phone: '',
            text: '',
            verificationCode: '',
            sendCode: '',
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const mode = navigation.getParam('mode') || '';
        const data = mode == 'new' ? {} : navigation.getParam('data');
        const { id } = data;
        if(mode !== 'new') {
            storage.load('alarmInfo', res => {
                const alarm = [...res];
                const { name, phone, text } = alarm[id];
                this.setState({ name, phone, text, id })
            })
        }
    }

    sendVerificationCode = () => {
        let { sendTime, phone } = this.state;
        if(!(/^1[34578]\d{9}$/.test(phone))) {
            Alert.alert('请输入正确的手机号')
        }else {
            this.setState({ showSendButton: false })
            let timer = setInterval(() => {
                this.setState({ sendTime: sendTime-- })
                if(sendTime == 0) {
                    clearInterval(timer);
                    this.setState({ sendTime: SEND_TIME, showSendButton: true })
                }
            },1000)
            const sendCode = randomNum(1000, 9999)
            console.log(sendCode);
            Axios.post(SEND_SMS, { phone, random: sendCode })
            .then(res => {
                this.setState({ sendCode });
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    submitClock = () => {
        const { mode, id, name, phone, text, sendCode, verificationCode } = this.state;
        const navigation = this.props.navigation;
        if(mode) {
            (sendCode == verificationCode ) ? 
            storage.load('alarmInfo', res => {
                const alarm = [...res];
                if(mode == 'new') {
                    alarm.push({
                        id: alarm.length,
                        name, phone, text,
                        choose: true,
                    })
                }
                storage.save('alarmInfo',  alarm);
                DeviceEventEmitter.emit('refreshAlarm', '待传参数');
                if(mode == 'new') {
                    navigation.navigate('Alarm');
                }
            }) : Alert.alert('验证码不正确'); 
        } else {
            storage.load('alarmInfo', res => {
                const alarm = [...res];
                alarm[id] = {
                    id, name, phone, text
                }
                storage.save('alarmInfo',  alarm);
                DeviceEventEmitter.emit('refreshAlarm', '待传参数');
            })
        }
    }

    deleteAlarm = () => {
        const { navigation } = this.props;
        const { id } = this.state;
        storage.load('alarmInfo', res => {
            const alarm = [...res];
            alarm.splice(id, 1)
            storage.save('alarmInfo',  alarm);
            DeviceEventEmitter.emit('refreshAlarm', '待传参数');
            navigation.navigate('Alarm');
        })
    }

    render(){
        const { mode, name, phone, text, showSendButton, sendTime, showCode } = this.state;
        return (
            <Container>
                <MyHeader />
                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>联系人名称</Label>
                            <Input value={name} onChangeText={e => debounce(500)(this.setState({ name: e }))}/>
                        </Item>
                        <Item stackedLabel disabled={mode ? false : true}>
                            <Label>联系人手机号</Label>
                            <Input disabled={mode ? false : true}  value={phone} onChangeText={e => debounce(500)(this.setState({ phone: e }))}/>
                        </Item>
                        <Item stackedLabel last>
                            <Label>联系人备注</Label>
                            <Input value={text} onChangeText={e => debounce(500)(this.setState({ text: e }))}/>
                        </Item>

                        {
                            showCode && <Item fixedLabel style={{ marginTop: 20 }}>
                                <Input placeholder='输入验证码'
                                onChangeText={e => debounce(500)(this.setState({ verificationCode: e }))}/>
                                {
                                    showSendButton ? <Button style={{ backgroundColor: '#f5c0be', marginRight: 5 }}
                                    onPress={() => this.sendVerificationCode()}>
                                        <Text>获取验证码</Text>
                                    </Button> : <Button style={{ marginRight: 5 }} disabled>
                                        <Text>{sendTime}s后重新发送</Text>
                                    </Button>
                                }
                            </Item>
                        }
                    </Form>
                    <Button full style={{ backgroundColor: 'rgba(237, 101, 96, 0.5)', marginTop: 20, }}
                        onPress = {() => this.submitClock()}>
                            <Text style={{ color: '#fff' }}>确定</Text>
                    </Button>

                    {
                        !mode ? <Button full style={{ backgroundColor: '#fff', marginTop: 20 }}
                        onPress = {() => this.deleteAlarm()}>
                            <Text style={{ color: '#f00', fontSize: 14 }}>删除联系人</Text>
                        </Button> : null
                    }
                </Content>
            </Container>
        )
    }
}