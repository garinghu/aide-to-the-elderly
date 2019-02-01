import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Text, Icon, Button } from 'native-base';

import { storage } from '../../storage';
import Config from '../../config';

export default class Home extends React.Component {
    
    constructor(props) {
        super(props);
        const { navigation } = this.props;
    }

    toRegist = () => {
        const { navigation } = this.props;
        navigation.navigate('AlarmSetting');
        // 贼坑
        // navigation.goBack(null);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={styles.logoContainer}>
                        <View style={styles.logo}>
                            <Icon theme={{ iconFamily: 'Entypo' }} name='ios-heart' 
                            style={{ color: '#fff', fontSize: 70 }}/>
                        </View>
                        <Text style={{ paddingTop: 50, fontSize: 14,}}>{Config.alarmTitle}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button block style={styles.registButton}
                        onPress={() => this.toRegist()}>
                            <Text style={{ color: '#fff' }}>前往设置</Text>
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
        backgroundColor: '#ed655f',
    },
});
