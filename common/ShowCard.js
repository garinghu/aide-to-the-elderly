import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

export default class CardList extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const { cardContent } = props;
        return (
            <Card style={{flex: 0}}>
                <CardItem>
                <Left>
                    <Thumbnail source={{uri: `${cardContent.headImg}`}} />
                    <Body>
                    <Text>{cardContent.name}</Text>
                    <Text note>{cardContent.time}</Text>
                    </Body>
                </Left>
                </CardItem>
                <CardItem>
                <Body>
                    <Image source={{uri: `${cardContent.bodyImg}`}} style={{height: 200, width: 200, flex: 1}}/>
                    <Text>
                    //Your text here
                    </Text>
                </Body>
                </CardItem>
                <CardItem>
                <Left>
                    <Button transparent textStyle={{color: '#87838B'}}>
                    <Icon name="logo-github" />
                    <Text>{cardContent.goods}</Text>
                    </Button>
                </Left>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
