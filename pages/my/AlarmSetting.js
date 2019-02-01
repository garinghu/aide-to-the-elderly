import React from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Text, Icon, Button, List } from 'native-base';

import { storage } from '../../storage';
import Config from '../../config';
import AlarmHeader from './AlarmHeader';
import AlarmCard from './AlarmCard';

export default class AlarmSetting extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            alarmInfo: [],
        }
    }

    componentDidMount() {
        try {
            storage.load('alarmInfo', res => {
                this.setState({ alarmInfo: res })
            })
        } catch (error) {
           storage.save('alarmInfo', [])
        }
        this.subscription = DeviceEventEmitter.addListener('refreshAlarm', this.refreshAlarm);
        DeviceEventEmitter.emit('changeShowMode', false);
    }

    refreshAlarm = () => {
        storage.load('alarmInfo', res => {
            this.setState({ alarmInfo: res })
        })
    }
    

    render() {
        const { alarmInfo } = this.state;
        return (
            <Container style={styles.container}>
                <AlarmHeader />
                <Content>
                    <List>
                        {alarmInfo.map((item, index) => 
                            <AlarmCard key={index} data={item}/>
                        )}
                    </List>
                </Content>
                {
                    // <Button iconLeft style={styles.setText}>
                    //     <Icon name='ios-notifications' />
                    //     <Text>编辑报警模版</Text>
                    // </Button>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    setText: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        backgroundColor: '#ed6560',
    }
});
