import React, { Component } from 'react';
import { StyleSheet, View, Image, CheckBox, Switch, DeviceEventEmitter, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Form, Item, Picker, Icon, Label, Input } from 'native-base';

import { storage } from '../../storage';
import Config from '../../config';
import { debounce } from '../../common/setting';
import MyHeader from '../../common/MyHeader';


const NO_TIME_NO_TEXT = '请选择时间和提示文案';
const timeZones = ["上午", "下午"];

export default class AlarmClockDetail extends Component {
    constructor(props){
        super(props)
        const { navigation } = this.props;
        const mode = navigation.getParam('mode') || '';
        const detail = mode == 'new' ? {} : navigation.getParam('detail');
        this.state = {
            mode,
            time: '',
            timeZone: '',
            frequency: 0,
            text: '',
        }
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
        const { navigation } = this.props;
        const mode = navigation.getParam('mode') || '';
        const detail = mode == 'new' ? {} : navigation.getParam('detail');
        const { index } = detail;
        if(mode !== 'new') {
            storage.load('clocks', res => {
                const clocks = [...res];
                const { time, timeZone, frequency, text, } = clocks[index];
                this.setState({ time, timeZone, frequency, text })
            })
        }
    }

    changeTime = (time) => {
        let hour = time.split(':')[0];
        let timeZone = '';
        const minute = time.split(':')[1];
        if(hour*1 >= 12) {
            hour = `${hour*1 - 12}`;
            timeZone = timeZones[1]
        } else {
            timeZone = timeZones[0]
        }
        this.setState({
            time: `${hour}:${minute}`,
            timeZone,
        });
    }

    changeFrequency = (value) => {
        this.setState({
            frequency: value
        });
    }

    changeText = (e) => {
        this.setState({ text: e });
    }

    submitClock = () => {
        const { mode, time, timeZone, frequency, text, index } = this.state;
        const navigation = this.props.navigation;
        (time && text) ? 
        storage.load('clocks', res => {
            const clocks = [...res];
            if(mode == 'new') {
                clocks.push({
                    id: clocks.length,
                    time, timeZone, frequency, text,
                    switchValue: true,
                })
            }else {
                clocks.splice(index, 1, {
                    id: clocks.length,
                    time, timeZone, frequency, text,
                    switchValue: true,
                })
            }
            storage.save('clocks',  clocks);
            DeviceEventEmitter.emit('refreshClocks', '待传参数');
            if(mode == 'new') {
                DeviceEventEmitter.emit('changeShowMode', true);
                navigation.navigate('AlarmClockCardList');
            }
        }) : Alert.alert(NO_TIME_NO_TEXT); 
        
    }

    deleteClock = () => {
        const { navigation } = this.props;
        const detail = navigation.getParam('detail');
        const { index } = detail;
        storage.load('clocks', res => {
            const clocks = [...res];
            clocks.splice(index, 1)
            storage.save('clocks',  clocks);
            DeviceEventEmitter.emit('refreshClocks', '待传参数');
            navigation.navigate('AlarmClockCardList');
        })
    }

    render(){
        const { mode, time, timeZone, frequency, text } = this.state;
        return (
            <Container>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                }}/>
                <Content>
                    <List>
                        <ListItem thumbnail>
                            <Left>
                                <Text style={{ fontSize: 20 }}>{timeZone}</Text>
                            </Left>
                            <Body>
                                <DatePicker
                                style={{flex: 1}}
                                date={time}
                                mode="time"
                                placeholder="请选择时间"
                                format="HH:mm"
                                confirmBtnText="确认"
                                cancelBtnText="取消"
                                showIcon={false}
                                customStyles={{
                                    dateIcon: {
                                        width: 0,
                                    },
                                    dateInput: {
                                        flex: 1,
                                        borderWidth: '0',
                                        
                                    },
                                    btnTextConfirm: {
                                        color: '#ed6560',
                                    },
                                    dateText: {
                                        fontSize: 40,
                                    }
                                }}
                                onDateChange={(date) => {this.changeTime(date)}}/>
                            </Body>
                            <Right>
                            </Right>
                        </ListItem>
                    </List>
                    <View >
                        <Form>
                            <Item picker>
                                <Label style={{ marginLeft: 20 }}>重复类型</Label>
                                <Picker
                                    mode="dropdown"
                                    style={{ flex: 1 }}
                                    placeholder="选择重复类型"
                                    headerBackButtonText="返回"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={frequency}
                                    onValueChange={(value) => this.changeFrequency(value)}
                                >
                                    {
                                        Config.clockRepeat.map((item, index) => 
                                        <Picker.Item label={item} value={index} key={index}/>)
                                    }
                                    
                                </Picker>
                            </Item>
                            <Item picker>
                                <Label style={{ marginLeft: 20 }}>提示文案</Label>
                                <Input value={text} onChangeText={e => debounce(500)(this.changeText(e))}/>
                            </Item>
                        </Form>
                    </View>
                    <Button full style={{ backgroundColor: 'rgba(237, 101, 96, 0.5)', marginTop: 20, }}
                    onPress = {() => this.submitClock()}>
                        <Text style={{ color: '#fff' }}>确定</Text>
                    </Button>
                    {
                        mode == 'new' || <Button full style={{ backgroundColor: '#fff', marginTop: 20 }}
                        onPress = {() => this.deleteClock()}>
                            <Text style={{ color: '#f00', fontSize: 14 }}>删除闹钟</Text>
                        </Button>
                    }
                </Content>
            </Container>
        )
    }
}