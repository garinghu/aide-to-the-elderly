import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Container, Text , Card, CardItem, Body } from 'native-base';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Tabs } from '@ant-design/react-native';

import { storage } from '../../storage';
import Config from '../../config';
import { getDateYYMMDD } from '../../common/setting';
import { monthNames, dayNames, dayNamesShort } from '../../common/local';
import MyHeader from '../../common/MyHeader';
import HealthCard from './HealthCard';

LocaleConfig.locales['fr'] = {
    monthNames,
    monthNamesShort: monthNames,
    dayNames,
    dayNamesShort,
};

LocaleConfig.defaultLocale = 'fr';

const maxDate = getDateYYMMDD();

export default class HealthHome extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            items: {}
        };
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
    }

    loadItems(day) {
        setTimeout(() => {
            storage.load('healthInfo', res => {
                // for (let i = -15; i < 1; i++) {
                //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                //     const strTime = this.timeToString(time);
                //     this.state.items[strTime] = res[strTime] || [{
                //         name: '暂无记录',
                //         height: 50,
                //     }]
                // }
                // const newItems = {};
                // Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
                // this.setState({
                //     items: newItems
                // });
                const time = day.timestamp;
                const strTime = this.timeToString(time);
                const newItems = {};
                newItems[strTime] = [res[strTime]] || [];
                this.setState({
                    items: newItems
                });
            })
        }, 1000);
    }

    renderItem(item) {
        return (
            <HealthCard item={item}/>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text style={{ color: '#fff' }}>暂无数据</Text></View>
        );
    }
    
    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
    
    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
    

    render() {
        const tabs = [{
            title: '今天',
        }, {
            title: '健康数据',
        }]
        return (
            <Container style={styles.container}>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                }}/>
                    <View style={{ flex: 1 }}>
                        <Tabs tabs={tabs}
                        tabBarBackgroundColor="#f8f8f8"
                        tabBarUnderlineStyle={{ backgroundColor: '#ed6560' }}
                        tabBarActiveTextColor="#ed6560"
                        onChange={this.changeTab}>
                            <Agenda
                                items={this.state.items}
                                loadItemsForMonth={this.loadItems.bind(this)}
                                selected={getDateYYMMDD()}
                                maxDate={maxDate}
                                renderItem={this.renderItem.bind(this)}
                                renderEmptyDate={this.renderEmptyDate.bind(this)}
                                rowHasChanged={this.rowHasChanged.bind(this)}
                                theme={{ 
                                    agendaKnobColor: '#ed6560',
                                    selectedDayBackgroundColor: '#ed6560', 
                                    dotColor: '#ed6560',
                                    textSectionTitleColor: '#ed6560',
                                    agendaDayTextColor: '#ed6560',
                                    agendaDayNumColor: '#ed6560',
                                    agendaTodayColor: '#ed6560',
                                    agendaKnobColor: '#ed6560'
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text>asd</Text>
                            </View>
                        </Tabs>
                    </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#f2f2f2',
    },
    emptyDate: {
        flex: 1, 
        height: 80, 
        backgroundColor: '#ed6560', 
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
