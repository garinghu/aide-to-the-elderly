import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Form, Item, Input, Text, Button } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import { debounce } from '../../common/setting';
import Config from '../../config';

const LOGIN = `${Config.proxy}/login`;

export default class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            phone: '',
            password: '',
        }
    }

    login = () => {
        const { phone, password } = this.state;
        const { navigation } = this.props;
        if(!(/^1[34578]\d{9}$/.test(phone))) {
            Alert.alert('请输入正确的手机号')
        }else {
            if(!password) {
                Alert.alert('请输入密码')
            }else {
                Axios.post(LOGIN, { phone, password })
                .then(res => {
                    if(res.data.errno) {
                        Alert.alert(res.data.errText);
                    }else {
                        storage.save('userInfo',  {
                            userid: res.data.data.Id,
                            username: res.data.data.username,
                            headImg: res.data.data.head,
                            phone: res.data.data.phone,
                        });
                        storage.save('chatInfo', []);
                        storage.save('clockes', []);
                        navigation.navigate('PostBar');
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <Form style={{ marginTop: 50, }}>
                        <Item inlineLabel>
                            <Input placeholder='输入手机号'
                            onChangeText={e => debounce(500)(this.setState({ phone: e }))}/>
                        </Item>
                        <Item fixedLabel>
                            <Input placeholder='输入密码' type='password'
                            onChangeText={e => debounce(500)(this.setState({ password: e }))}/>
                        </Item>
                    </Form>
                    <Button full light 
                    style={{ marginTop: 50, backgroundColor: '#ed655f' }}
                    onPress={() => this.login()}>
                        <Text style={{ color: '#fff' }}>登录</Text>
                    </Button>

                    <View style={styles.noAccountContainer}>
                        <Text note>还没有账号？</Text>
                        <TouchableOpacity>
                            <Text note 
                            style={{ color: '#ed655f' }}>立即注册</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    noAccountContainer: {
        marginTop: 200,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
