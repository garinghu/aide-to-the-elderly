import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, DeviceEventEmitter } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header, Right, Button, Text, Body } from 'native-base';
import { Tabs } from '@ant-design/react-native';
import Axios from 'axios';

class PostHeader extends React.Component {
    
    constructor(props) {
        super(props);
    }

    showNewPost = () => {
        const navigation = this.props.navigation;
        navigation.navigate('NewPost');
    }

    changeTab = (tab, index) => {
        DeviceEventEmitter.emit('changeMessageType', tab.type)
    }

    render() {
        const tabs = [{
            title: '推荐',
            type: 'normal',
        }, {
            title: '好友动态',
            type: 'friend',
        }]
        const state = this.state;
        return (
            <View style={styles.container}>
                <Header>
                    <Tabs tabs={tabs}
                    tabBarBackgroundColor="#f8f8f8"
                    tabBarUnderlineStyle={{ backgroundColor: '#ed6560' }}
                    tabBarActiveTextColor="#ed6560"
                    onChange={this.changeTab}>
                    </Tabs>
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
