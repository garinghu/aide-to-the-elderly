import React from 'react';
import { StyleSheet, Modal, TouchableHighlight, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Item, Input, Content, Text, Tab, Tabs, TabHeading, List, ListItem, Thumbnail } from 'native-base';

class ChangeInfoModal extends React.Component {
    
    constructor(props) {
        super(props);
        const { value } = this.props;
        console.log(value);
        this.state = {
            text: value, 
        }
    }

    render() {
        const { show, closeModal, title, onOk } = this.props;
        const { text } = this.state;
        return (
            <Modal
            animationType={"slide"}
            transparent={false}
            visible={show}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
                <Container>
                    <Header style={{ backgroundColor: '#fff'}}>
                        <Left>
                            <Button transparent onPress={closeModal}>
                                <Text style={{ color: '#ed6560', fontSize: 16 }}>取消</Text>
                            </Button>
                        </Left>
                        <Body>
                            <Text>设置{title}</Text>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => onOk(text)}>
                                <Text style={{ color: '#ed6560', fontSize: 16 }}>完成</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <Item>
                            <Input value={text} onChangeText={(e) => this.setState({ text: e })}/>
                        </Item>
                    </Content>
                </Container>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
       marginBottom: 30,
    },
});

export default withNavigation(ChangeInfoModal);

