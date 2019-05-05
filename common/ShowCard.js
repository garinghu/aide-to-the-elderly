import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Text  } from 'native-base';
import Axios from 'axios';
import Config from '../config';
import { Base64 } from '../common/setting';
import { storage } from '../storage';

const MESSAGE_ADD_GOODS = `${Config.proxy}/messageaddgoods`;
const MESSAGE_ADD_COLLECTIONS = `${Config.proxy}/messageaddcollections`;
const b = new Base64();

class ShowCard extends React.Component {
    
    constructor(props) {
        super(props);
        const { cardContent } = this.props;
        const { collection, good, hasgood, hascollection, id, userid } = cardContent;
        this.state = {
            collection, good, hasgood, hascollection,
            cardId: id,
            userid: '',
            cardWritterId: userid,
        }
    }

    componentDidMount() {
        storage.load('userInfo', (data) => {
            this.setState({
                userid: data.userid,
            })
        })
    }

    addGood = () => {
        const { hasgood, cardId, userid } = this.state;
        if(!hasgood) {
            this.state.good++;
            this.state.hasgood = 1;
        } else {
            this.state.good--;
            this.state.hasgood = 0;
        }
        Axios.post(MESSAGE_ADD_GOODS, { 
            goods: this.state.good,
            cardId,
            userId: userid,
            hasgood: this.state.hasgood,
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
        this.setState({})
    }

    addCollection = () => {
        const { hascollection, cardId, userid } = this.state;
        if(!hascollection) {
            this.state.collection++;
            this.state.hascollection = 1;
        } else {
            this.state.collection--;
            this.state.hascollection = 0;
        }
        Axios.post(MESSAGE_ADD_COLLECTIONS, {
            collections: this.state.collection,
            cardId,
            userId: userid,
            hascollection: this.state.hascollection,
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
        this.setState({})
    }

    toChatDetail = () => {
        const { cardWritterId } = this.state;
        const { fromSearch } = this.props;
        const navigation = this.props.navigation;
        // navigation.navigate('ChatDetail', { cardWritterId });
        // DeviceEventEmitter.emit('changeNavTabs', 'Chat');
        navigation.navigate('WritterList', { cardWritterId, alreadyFriend: false, fromSearch });
        fromSearch && DeviceEventEmitter.emit('closeModal');
    }

    render() {
        const props = this.props;
        const { cardContent, cardPress } = props;
        const { userName, headImg, time, type,  name } = cardContent;
        const { collection, good, hasgood } = this.state;
        const content = JSON.parse(b.decode(cardContent.content));
        return (
            <Card style={{flex: 0}}>
                <CardItem>
                <Left>  
                    <TouchableOpacity onPress={() => this.toChatDetail()}> 
                        <Thumbnail source={{uri: `${headImg}`}} />
                    </TouchableOpacity>
                    <Body>
                        <Text>{userName}</Text>
                        <Text note>{time}</Text>
                        <View style={styles.typeContainer}>
                            <Text note style={styles.typeTip}>{type}</Text>
                        </View>  
                    </Body>
                </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text  onPress={cardPress}>{name}</Text>
                        <Image source={{uri: `${content.bodyImg}`}} style={{height: 200, width: 200, flex: 1}}/>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent danger onPress={() => this.addGood()}>
                            <Icon name="heart" />
                            <Text>{good}</Text>
                        </Button>
                        <Button transparent warning onPress={() => this.addCollection()}>
                            <Icon name="star" />
                            <Text>{collection}</Text>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    typeContainer: {
        flexDirection: 'row',
    },
    typeTip: {
        backgroundColor: '#ed6560',
        color: '#fff',
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 3,
    }
});

export default withNavigation(ShowCard);