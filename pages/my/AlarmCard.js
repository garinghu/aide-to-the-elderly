import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, CheckBox, Switch, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';

import { storage } from '../../storage';
class AlarmCard extends React.Component {

    constructor(props) {
        super(props);
        const { data, key } = this.props;
        const { choose } = data;
        this.state = {
            choose,
            data,
        }
    }

    changeSwitchValue = () => {
        const { choose } = this.state;
        const { id } = this.props.data;
        storage.load('alarmInfo', res => {
            const alarm = [...res];
            alarm[id].choose = !choose;
            let hasChoosed = false;
            for(let i in alarm) {
                if(alarm[i].choose) {
                    hasChoosed = true
                }
            }
            if(hasChoosed) {
                this.setState({ choose : !choose });
                storage.save('alarmInfo',  alarm);
            }else {
                Alert.alert('请至少预留一个紧急联系人');
            }
        })
    }

    toDetail = () => {
        const { data } = this.state;
        const navigation = this.props.navigation;
        navigation.navigate('AlarmDetail', { data });
    }

    render() {
        const { choose, data } = this.state;
        const { name, phone, text } = data;
        return (
            <ListItem thumbnail>
                <Body>
                    <TouchableOpacity onPress={() => this.toDetail()}>
                        <Text style={{ fontSize: 30 }}>{name}</Text>
                        <Text style={{ fontSize: 14, marginTop: 5 }} note>{text}</Text>
                    </TouchableOpacity>
                </Body>
                <Right>
                    <Switch value={choose}
                    onValueChange={() => this.changeSwitchValue()}/>
                </Right>
            </ListItem>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
export default withNavigation(AlarmCard);
