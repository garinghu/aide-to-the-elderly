import React from 'react';
import { createStackNavigator } from "react-navigation";

import ClockHeader from './ClockHeader';
import AlarmClockCardList from './AlarmClockList';
import AlarmClockDetail from './AlarmClockDetail';
import ChatDetail from '../chat/ChatDetail';

export default createStackNavigator({
    AlarmClockCardList: {
        screen: AlarmClockCardList,
        navigationOptions: {
            headerTitle: <ClockHeader />,
        }
    },
    AlarmClockDetail: {
        screen: AlarmClockDetail,
        navigationOptions: {
            header: null,
        }
    },
    ChatDetail: {
        screen: ChatDetail,
    }
}, {
   
})
