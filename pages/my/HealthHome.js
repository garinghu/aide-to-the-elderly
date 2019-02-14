import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Text , Card, CardItem, Body } from 'native-base';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Tabs } from '@ant-design/react-native';

import { storage } from '../../storage';
import Config from '../../config';
import { getDateYYMMDD } from '../../common/setting';
import { monthNames, dayNames, dayNamesShort } from '../../common/local';
import MyHeader from '../../common/MyHeader';
import HealthCard from './HealthCard';
import HealthAddModal from './HealthAddModal';

LocaleConfig.locales['fr'] = {
    monthNames,
    monthNamesShort: monthNames,
    dayNames,
    dayNamesShort,
};

LocaleConfig.defaultLocale = 'fr';

const maxDate = getDateYYMMDD();
const { healthTitles } = Config;

export default class HealthHome extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            showModal: false,
        };
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
    }

    loadItems(day) {
        setTimeout(() => {
            storage.load('healthInfo', res => {
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

    refreshData = (data) => {
        const newData = {};
        newData[maxDate] = [data];
        // agenda在修改选择日期的时候才会刷新，固出此下策
        this.setState({
            items: {},
        }, () => {
            this.setState({
                items: newData
            })
        });
        
    }

    renderItem(item) {
        return (
            <HealthCard item={item} showModal={() => this.setState({ showModal: true })}/>
        );
    }

    renderEmptyDate(day) {
        return (
            this.timeToString(day) == maxDate ? <TouchableOpacity
            onPress={() => this.setState({ showModal: true })}>
                <View style={styles.emptyDate}>
                    <Text style={{ color: '#fff' }}>添加数据</Text>
                </View>
            </TouchableOpacity> : <View style={styles.emptyDate}>
                <Text style={{ color: '#fff' }}>暂无数据</Text>
            </View>
        );
    }
    
    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
    
    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    toHealthChart = (date, type, unit) => {
        const { navigation } = this.props;
        navigation.navigate('HealthChart', { date, type, unit});
    }
    

    render() {
        const tabs = [{
            title: '今天',
        }, {
            title: '健康数据',
        }]
        const { showModal } = this.state;
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
                                <View style={styles.healthCardContainer}>
                                    {
                                        healthTitles.map((i, index) => <TouchableOpacity key={index} 
                                        onPress={() => this.toHealthChart(maxDate, i.key, i.unit)}>
                                            <View style={styles.healthCard}>
                                                <Text style={{ color: '#fff' }}>{i.title}</Text>
                                            </View>
                                        </TouchableOpacity>)
                                    }
                                </View>
                            </View>
                        </Tabs>
                    </View>
                    <HealthAddModal show={showModal}
                    refreshData={(data) => this.refreshData(data)}
                    date={maxDate} closeModal={() => this.setState({ showModal: false })}/>
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
    },
    healthCardContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 5,
    },
    healthCard: {
        width: (Dimensions.get('window').width  * 0.33 - 2),
        height: 100,
        marginLeft: 2,
        marginTop: 2,
        borderRadius: 5,
        backgroundColor: '#ed6560',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
