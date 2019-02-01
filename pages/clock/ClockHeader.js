import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';
import Axios from 'axios';

class ClockHeader extends React.Component {
    
    constructor(props) {
        super(props);
    }

    showNewPost = () => {
        const navigation = this.props.navigation;
        navigation.navigate('AlarmClockDetail', { mode: 'new' });
    }

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                <Header>
                    <Right>
                        <Button transparent onPress={() => this.showNewPost()}>
                            <Text note style={{ fontSize: 16, color: '#ed6560' }}>新建</Text>
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

export default withNavigation(ClockHeader);
