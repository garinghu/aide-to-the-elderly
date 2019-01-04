import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';

export default class My extends React.Component {
    static navigationOptions = {
        tabBarLabel: '我的',
        tabBarIcon: ({ focused, horizontal, tintColor, }) => 
            <FontAwesome name='user' size={horizontal ? 20 : 25} color={tintColor}/>,
    };
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header />
                <Content>
                    <Card style={{flex: 0}}>
                        <CardItem>
                        <Left>
                            <Thumbnail source={{uri: 'Image URL'}} />
                            <Body>
                            <Text>NativeBase</Text>
                            <Text note>April 15, 2016</Text>
                            </Body>
                        </Left>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Image source={{uri: 'Image URL'}} style={{height: 200, width: 200, flex: 1}}/>
                            <Text>
                            //Your text here
                            </Text>
                        </Body>
                        </CardItem>
                        <CardItem>
                        <Left>
                            <Button transparent textStyle={{color: '#87838B'}}>
                            <Icon name="logo-github" />
                            <Text>1,926 stars</Text>
                            </Button>
                        </Left>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
});
