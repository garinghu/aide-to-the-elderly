import React from 'react';
import { StyleSheet, Modal, TouchableHighlight, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Right, Button, Content, Text, Form, Item, Input, Label, } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import Config from '../../config';

const { healthTitles } = Config;

class HealthAddModal extends React.Component {
    
    constructor(props) {
        super(props);
        const { date } = this.props;
        this.state = {
            healthData: { date }
        };
    }

    componentDidMount() {
        const { date } = this.props;
        storage.load('healthInfo', res => {
            if(res[date]) {
                this.setState({
                    healthData: res[date],
                })
            }
        })
    }

    changeHealthData = (key, val) => {
        const { healthData } = this.state;
        if(val) {
            healthData[key] = val;
        } else {
            // agenda组件不允许传空属性
            delete healthData[key];
        }
        this.setState({ healthData });
    }

    saveHealthData = () => {
        const { date, closeModal, refreshData } = this.props;
        const { healthData } = this.state;
        storage.load('healthInfo', res => {
            const data = {...res};
            data[date] = healthData;
            refreshData(healthData);
            closeModal();
            storage.save('healthInfo', data);
        })
    }

    render() {
        const { show, closeModal } = this.props;
        const { healthData } = this.state;
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
                        <Right>
                            <Button transparent onPress={() => this.saveHealthData()}>
                                <Text style={{ color: '#ed6560', fontSize: 16 }}>确定</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <Form>
                            {healthTitles.map((item, index) => <Item fixedLabel key={index}>
                                <Label>{item.title}</Label>
                                <Input value={healthData[item.key] || ''} 
                                onChangeText={(e) => this.changeHealthData(item.key, e)}/>
                                <Label>{item.unit}</Label>
                            </Item>)}
                        </Form>
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
    searchContainer: {
        marginTop: 10,
        marginLeft: 10,
        flex: 1,
        flexDirection: 'row',
    },
    searchItem: {
        height: 30, 
        marginLeft: 0, 
        backgroundColor: '#efefef',
        marginRight: 15, 
    }
});

export default withNavigation(HealthAddModal);

