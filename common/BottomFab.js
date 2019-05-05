import React from 'react';
import { Constants, Location, Permissions } from 'expo';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Image, DeviceEventEmitter, TouchableOpacity, } from 'react-native';
import Axios from 'axios';

import { storage } from '../storage';
import Config from '../config';

const GET_GEO_BY_COORDS = `${Config.proxy}/getgeobycoords`;
const SEND_LOCATE_SMS = `${Config.proxy}/sendlocatesms`;

export default class BottomFab extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            latitude: '', 
            longitude: '',
        }
    }

    async componentDidMount() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
    
        let { coords: { latitude, longitude, } } = await Location.getCurrentPositionAsync({});

        this.setState({ latitude, longitude, });
    }

    toAlarm = () => {
        storage.load('alarmInfo', res => {
            const alarm = [...res];
            let hasChoosed = false;
            let choosedPhones = [];
            for(let i in alarm) {
                if(alarm[i].choose) {
                    hasChoosed = true
                    choosedPhones.push(alarm[i].phone)
                }
            }
            if(!hasChoosed) {
                Alert.alert('请在我的->报警设置页面设置联系人');
            }else {
                const { latitude, longitude, } = this.state;
                Axios.post(GET_GEO_BY_COORDS, {
                    latitude, longitude,
                }).then(res => {
                    const { address } = res.data;
                    Axios.post(SEND_LOCATE_SMS, { address, phone: choosedPhones[0] }).then(res => {
                        if(res.code == 0) {
                            Alert.alert('报警信息已发送');
                        }
                    })
                })
                .catch(err => { console.log(err) })
            }
        })
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
    
        let location = await Location.getCurrentPositionAsync({});
        return location
    };

    
    render() {
        return (
            <View style={styles.helper}>
                <TouchableOpacity onPress={() => this.toAlarm()}>
                    <Text style={{ padding: 10, color: '#fff' }}>{'一键报警'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    helper: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 50,
        width: 50,
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#ed6560',
    }
});
