import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Form, Item, Input, Text, Button } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import { debounce, randomNum } from '../../common/setting';
import Config from '../../config';

const SEND_TIME = 60;
const REGIST = `${Config.proxy}/regist`;
const SEND_SMS = `${Config.proxy}/sendsms`;

export default class Regist extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            phone: '',
            password: '',
            verificationCode: '',
            showSendButton: true,
            sendTime: SEND_TIME,
            sendCode: '',
        }
    }

    sendVerificationCode = () => {
        let { sendTime, phone } = this.state;
        this.setState({ showSendButton: false })
        if(!(/^1[34578]\d{9}$/.test(phone))) {
            Alert.alert('请输入正确的手机号')
        }else {
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
                this.setState(sendCode);
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    regist = () => {
        const { phone, verificationCode, password } = this.state;
        const { navigation } = this.props;
        if(!(/^1[34578]\d{9}$/.test(phone))) {
            Alert.alert('请输入正确的手机号')
        }else {
            if(!(verificationCode || password)) {
                Alert.alert('请输入验证码或密码')
            }else {
                Axios.post(REGIST, { phone, password })
                .then(res => {
                    if(res.data.errno) {
                        Alert.alert(res.data.errText);
                    }else {
                        storage.save('userInfo',  {
                            userid: res.data.data.Id,
                            username: res.data.data.username,
                            headImg: res.data.data.head,
                        });
                        storage.save('chatInfo', []);
                        storage.save('clockes', []);
                        navigation.navigate('PostBar')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        }
    }

    render() {
        const { showSendButton, sendTime } = this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={styles.headerContainer}>
                        <Text style={{ fontSize: 20 }}>注册账号，加入我们</Text>
                    </View>
                    <Form style={{ marginTop: 50 }}>
                        <Item inlineLabel>
                        <View 
                        style={{ borderRightColor: '#000', borderRightWidth: 1, marginRight: 10 }}>
                            <Text style={{ marginRight: 5 }}>+86</Text>
                        </View>
                            <Input placeholder='输入手机号'
                            onChangeText={e => debounce(500)(this.setState({ phone: e }))}/>
                        </Item>
                        <Item fixedLabel style={{ marginTop: 20 }}>
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
                        <Item inlineLabel
                        style={{ marginTop: 10 }}>
                            <Input placeholder='输入密码'
                            onChangeText={e => debounce(500)(this.setState({ password: e }))}/>
                        </Item>
                    </Form>
                    <Button full light 
                    style={{ marginTop: 50, backgroundColor: '#ed655f' }}
                    onPress={() => this.regist()}>
                        <Text style={{ color: '#fff' }}>注册</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    headerContainer: {
        flex: 1,
        marginTop: 50,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
