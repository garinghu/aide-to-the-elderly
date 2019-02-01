import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, DeviceEventEmitter } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Item, Input } from 'native-base';
import Axios from 'axios';

class PostHeader extends React.Component {
    
    constructor(props) {
        super(props);
    }

    showNewPost = () => {
        const navigation = this.props.navigation;
        navigation.navigate('NewPost');
    }

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                <Header>
                    <Left>
                        <Item rounded 
                        style={{ height: 30, width: 280, borderColor: '#ed6560', backgroundColor: '#fff' }}>
                            <Input style={{color: '#ed6560'}} placeholder='发现新内容...'/>
                        </Item>
                    </Left>
                    <Right>
                        <Button transparent onPress={() => DeviceEventEmitter.emit('showModal')}>
                            <FontAwesome name='search' style={{ fontSize: 18, fontWeight: 'lighter', color: '#ed6560' }}/>
                        </Button>
                        <Button transparent onPress={() => this.showNewPost()}>
                            <FontAwesome name='plus' style={{ fontSize: 20, fontWeight: 'lighter', color: '#ed6560' }}/>
                        </Button>
                    </Right>
                </Header>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
       marginBottom: 30,
    },
});

export default withNavigation(PostHeader);
