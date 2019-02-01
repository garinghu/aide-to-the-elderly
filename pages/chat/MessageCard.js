import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, DeviceEventEmitter, TouchableOpacity, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, List, ListItem, Right, Text, Row, } from 'native-base';

import { storage } from '../../storage';

class MessageCard extends React.Component {
    
    constructor(props) {
        super(props);
        const { detail } = this.props;
        const { userid, chatid, username, headImg, messages, lastMessage, lastMessageTime } = detail;
        this.state = { userid, chatid, username, headImg, messages, lastMessage, lastMessageTime }
    }

    toDetail = (userid) => {
        this.cancelMessages();
        const navigation = this.props.navigation;
        navigation.navigate('ChatDetail', { cardWritterId: userid });
    }

    cancelMessages = () => {
        const { chatid } = this.state;
        storage.load('chatInfo', (data) => {
            const newData = [...data];
            for(let i in newData) {
                if(newData[i].chatid == chatid) {
                    newData[i].messages = 0
                }
            }
            storage.save('chatInfo',  newData);
        })

        this.setState({ messages: 0 })
        DeviceEventEmitter.emit('refreshMessageTips');
    }

    render() {
        const { userid, username, headImg, messages, lastMessage, lastMessageTime } = this.state;
        const { onDelete, toTop } = this.props;
        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail source={{ uri: headImg }} />
                </Left>
                <Body>
                    <TouchableOpacity onPress={() => this.toDetail(userid)}>
                        <Text>{username}</Text>
                        <Text note>{lastMessage}</Text>
                        <Text></Text>
                    </TouchableOpacity>
                </Body>
                <Right>
                    <Text note>{lastMessageTime}</Text>
                    <Text></Text>
                    <View style={{flex: 1, flexDirection:'row',}}>
                        <Button onPress={toTop}
                        small bordered
                        style={{ height: 25, lineHeight: 25, marginRight: 5}}>
                            <Icon theme={{ iconFamily: 'AntDesign' }} name='arrow-up' style={{ fontSize: 14 }}/>
                        </Button>
                        <Button onPress={onDelete}
                        small bordered danger
                        style={{ height: 25, lineHeight: 25, marginRight: 5}}>
                            <Icon theme={{ iconFamily: 'AntDesign' }} name='close' style={{ fontSize: 14 }}/>
                        </Button>
                        { messages == 0 ||  <Button onPress = {() => this.cancelMessages()}
                        rounded small style={{ height: 25, lineHeight: 25, backgroundColor: '#ed6560'}}>
                            <Text style={{color: '#fff'}}>{messages}</Text>
                        </Button> }
                    </View>
                </Right>
            </ListItem>      
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    messagesTip: {
        borderRadius: 50,
        backgroundColor: '#ed6560',
        color: '#fff',
    }
});

export default withNavigation(MessageCard);