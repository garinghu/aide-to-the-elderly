import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, CheckBox, Switch, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';

import { storage } from '../../storage';
class AlarmClockCard extends React.Component {

    constructor(props) {
        super(props);
        const { detail, key } = this.props;
        const { switchValue } = detail;
        this.state = {
            switchValue,
            detail,
        }
    }

    changeSwitchValue = () => {
        const { switchValue } = this.state;
        const { index } = this.props.detail;
        this.setState({ switchValue: !switchValue });
        storage.load('clocks', res => {
            const clocks = [...res];
            clocks[index].switchValue = !switchValue;
            storage.save('clocks',  clocks);
        })
    }

    toDetail = () => {
        const { detail } = this.state;
        const navigation = this.props.navigation;
        navigation.navigate('AlarmClockDetail', { detail });
    }

    render() {
        const { switchValue, detail } = this.state;
        const { time, timeZone } = detail
        return (
            <ListItem thumbnail>
                <Left>
                    <Text style={{ fontSize: 30, color: 'rgba(237, 101, 96, 0.5)' }}>{timeZone}</Text>
                </Left>
                <Body>
                    <TouchableOpacity onPress={() => this.toDetail()}>
                        <Text style={{ fontSize: 50 }}>{time}</Text>
                    </TouchableOpacity>
                </Body>
                <Right>
                    <Switch value={switchValue}
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
export default withNavigation(AlarmClockCard);
