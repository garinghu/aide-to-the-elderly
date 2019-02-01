import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Text, Icon, Button } from 'native-base';

import { storage } from '../../storage';
import Config from '../../config';

export default class Home extends React.Component {
    
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        try {
            storage.load('userInfo', res => {
                if(res.userid) {
                    navigation.navigate('PostBar');
                }
            })
        } catch (error) {
            console.log(error)
        }
        // navigation.navigate('PostBar');
    }

    toRegist = () => {
        const { navigation } = this.props;
        navigation.navigate('Regist');
    }

    toLogin = () => {
        const { navigation } = this.props;
        navigation.navigate('Login');
    }
    

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={styles.logoContainer}>
                        <View style={styles.logo}>
                            <Icon theme={{ iconFamily: 'Entypo' }} name='clock' 
                            style={{ color: '#fff', fontSize: 70 }}/>
                        </View>
                        <Text style={{ paddingTop: 50, fontSize: 14,}}>{Config.loginTitle}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button block style={styles.registButton}
                        onPress={() => this.toRegist()}>
                            <Text style={{ color: '#fff' }}>注册</Text>
                        </Button>
                        <Button bordered style={styles.loginButton}
                        onPress={() => this.toLogin()}>
                            <Text style={{ color: '#ed655f' }}>登录</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#f5f5f5',
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        height: 300,
    },
    logo: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e05d57',
        borderRadius: 15,
        marginTop: 100,
    },
    buttonsContainer: {
        flex: 1,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    registButton: {
        width: 150,
        marginRight: 15,
        backgroundColor: '#ed655f',
    },
    loginButton: {
        width: 150,
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ed655f',
    }
});
