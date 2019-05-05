import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Container, Content, Text , List, ListItem, Left, Body, Right, Icon } from 'native-base';
import { Tabs } from '@ant-design/react-native';
import Echarts from 'native-echarts';

import MyHeader from '../../common/MyHeader';
import HealthDetailChart from './HealthDetailChart';
import { storage } from '../../storage';
import { getDateYYMMDD, getTheWeekDaysYYMMDD, getLastDate, getNextDate, getTheMounthDaysYYMMDD } from '../../common/setting';
import Config from '../../config';

const { healthTitles } = Config;

export default class HealthChart extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: {
                title: '周',
                cycle: 7,
            },
            selectDate: '',
            thisWeek: [],
            thisMounth: '',
            thisYear: '',
            selectDateText: '',
            currentX: [],
            currentY: [],
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        const date = getDateYYMMDD()
        const year = date.split('-')[0];
        const mounth = date.split('-')[1];
        const day = date.split('-')[2];
        const weeks = getTheWeekDaysYYMMDD(year, mounth - 1, day);
        this.setState({
            thisYear: year,
            thisMounth: getTheMounthDaysYYMMDD(year, mounth, day),
            thisWeek: weeks,
            selectDateText: `${weeks[0]}至${weeks[weeks.length - 1]}`,
            currentX: this.formatWeeks(weeks),
        })
        this.getCurrentY(this.formatWeeks(weeks), type)
    }

    formatWeeks = (weeks) => {
        return weeks.map((item) => {
            const year = item.split('-')[0];
            let mounth = item.split('-')[1];
            let day = item.split('-')[2];
            if(mounth.length < 2) {
                mounth = `0${mounth}`
            }

            if(day.length < 2) {
                day = `0${day}`
            }
            return `${year}-${mounth}-${day}`
        })
    }

    getCurrentY = (currentX, type) => {
        const data = [];
        storage.load('healthInfo', res => {
            for(let i in currentX) {
                console.log(currentX[i], type, res[currentX[i]])
                if(res[currentX[i]]) {
                    data.push(res[currentX[i]][type] || 0)
                } else {
                    data.push(0)
                }
            }
            this.setState({ currentY: data })
        })
    }

    changeTab = (e) => {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        this.setState({ selectedTab: e });
        if(e.cycle == 7) {
            const { thisWeek } = this.state;
            this.setState({
                selectDateText: `${thisWeek[0]}至${thisWeek[thisWeek.length - 1]}`,
                currentX: thisWeek
            })
            this.getCurrentY(thisWeek, type)
        } else if(e.cycle == 30) {
            const { thisMounth } = this.state;
            const year = thisMounth[0].split('-')[0];
            const mounth = thisMounth[0].split('-')[1];
            this.setState({
                selectDateText: `${year}-${mounth}`,
                currentX: thisMounth,
            })
            this.getCurrentY(thisMounth, type)
        }
    }

    getSelectDate = () => {
        const { selectTab } = this.state;

    }

    getHealthTitleByKey = (key) => {
        let title = '';
        for(let i in healthTitles) {
            title = healthTitles[i].key == key ? healthTitles[i].title : title;
        }
        return title
    }

    toNextCycle = () => {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        const { selectedTab } = this.state;
        if(selectedTab.cycle == 7) {
            const { thisWeek } = this.state;
            const year = thisWeek[thisWeek.length - 1].split('-')[0];
            const mounth = thisWeek[thisWeek.length - 1].split('-')[1];
            const day = thisWeek[thisWeek.length - 1].split('-')[2];
            const nextDate = getNextDate(year, mounth - 1, day);
            const nextYear = nextDate.split('-')[0];
            const nextMounth = nextDate.split('-')[1];
            const nextDay = nextDate.split('-')[2];
            const nextWeeks = getTheWeekDaysYYMMDD(nextYear, nextMounth - 1, nextDay);
            this.setState({
                thisWeek: nextWeeks,
                selectDateText: `${nextWeeks[0]}至${nextWeeks[nextWeeks.length - 1]}`,
                currentX: this.formatWeeks(nextWeeks),
            })
            this.getCurrentY(this.formatWeeks(nextWeeks), type)
        } else if(selectedTab.cycle == 30) {
            const { thisMounth } = this.state;
            const year = thisMounth[thisMounth.length - 1].split('-')[0];
            const mounth = thisMounth[thisMounth.length - 1].split('-')[1];
            const day = thisMounth[thisMounth.length - 1].split('-')[2];
            const nextMounth = getTheMounthDaysYYMMDD(mounth*1 + 1 == 13 ? year*1 + 1 : year, mounth*1 + 1 == 13 ? 1 : mounth*1 + 1, day);
            this.setState({
                thisMounth: nextMounth,
                selectDateText: `${mounth*1 + 1 == 13 ? year*1 + 1 : year}-${mounth*1 + 1 == 13 ? 1 : mounth*1 + 1}`,
                currentX: nextMounth,
            })
            this.getCurrentY(nextMounth, type)
        }
    }

    toLastCycle = () => {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        const { selectedTab } = this.state;
        if(selectedTab.cycle == 7) {
            const { thisWeek } = this.state;
            const year = thisWeek[0].split('-')[0];
            const mounth = thisWeek[0].split('-')[1];
            const day = thisWeek[0].split('-')[2];
            const LastDate = getLastDate(year, mounth - 1, day);
            const lastYear = LastDate.split('-')[0];
            const lastMounth = LastDate.split('-')[1];
            const lastDay = LastDate.split('-')[2];
            const lastWeeks = getTheWeekDaysYYMMDD(lastYear, lastMounth - 1, lastDay);
            this.setState({
                thisWeek: lastWeeks,
                selectDateText: `${lastWeeks[0]}至${lastWeeks[lastWeeks.length - 1]}`,
                currentX: this.formatWeeks(lastWeeks),
            })
            this.getCurrentY(this.formatWeeks(nextWeeks), type)
        } else if(selectedTab.cycle == 30) {
            const { thisMounth } = this.state;
            const year = thisMounth[thisMounth.length - 1].split('-')[0];
            const mounth = thisMounth[thisMounth.length - 1].split('-')[1];
            const day = thisMounth[thisMounth.length - 1].split('-')[2];
            const lastMounth = getTheMounthDaysYYMMDD(mounth*1 - 1 == 0 ? year*1 - 1 : year, mounth*1 - 1 == 0 ? 12 : mounth*1 - 1, day);
            this.setState({
                thisMounth: lastMounth,
                selectDateText: `${mounth*1 - 1 == 0 ? year*1 - 1 : year}-${mounth*1 - 1 == 0 ? 12 : mounth*1 - 1}`,
                currentX: lastMounth,
            })
            this.getCurrentY(lastMounth, type)
        }
    }

    render() {
        const { navigation } = this.props;
        const { selectDateText, currentX, currentY } = this.state;
        const type = navigation.getParam('type');
        const unit = navigation.getParam('unit');
        const tabs = [{
            title: '周',
            cycle: 7,
        }, {
            title: '月',
            cycle: 30,
        }, 
        // {
        //     title: '年',
        //     cycle: 12,
        // }
        ];
        return (
            <Container style={styles.container}>
                <MyHeader/>
                <Content>
                    <View style={{ flex: 1 }}>
                        <Tabs tabs={tabs}
                        tabBarBackgroundColor="#f8f8f8"
                        tabBarUnderlineStyle={{ backgroundColor: '#ed6560' }}
                        tabBarActiveTextColor="#ed6560"
                        onChange={(e) => this.changeTab(e)}>
                        </Tabs>
                    </View>
                    <List>
                        <ListItem style={{ backgroundColor: '#fff' }} itemHeader first>
                            <Left style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => this.toLastCycle()}>
                                    <Icon name="arrow-back" style={{ color: '#ed6560' }}/>
                                </TouchableOpacity>
                            </Left>
                            <Body style={styles.selectDateContainer}>
                                <Text style={{ color: '#ed6560' }}>{selectDateText}</Text>
                            </Body>
                            <Right style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => this.toNextCycle()}>
                                    <Icon name="arrow-forward" style={{ color: '#ed6560' }}/>
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                    <HealthDetailChart 
                    type={this.getHealthTitleByKey(type)}
                    unit={unit}
                    xData={currentX}
                    yData={currentY}/>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
    },
    selectDateContainer: {
        flex: 4, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});
