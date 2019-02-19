import React from 'react';
import { createStackNavigator } from "react-navigation";

import Home from './Home';
import ChangeUserInfo from './ChangeUserInfo';
import Alarm from './AlarmSetting';
import AlarmDetail from './AlarmDetail';
import HealthHome from './HealthHome';
import HealthChart from './HealthChart';

export default createStackNavigator({
    Home: {
        screen: Home,
    },
    ChangeUserInfo: {
        screen: ChangeUserInfo,
        navigationOptions: {
            header: null,
        }
    },
    Alarm: {
        screen: Alarm,
        navigationOptions: {
            header: null,
        }
    },
    AlarmDetail: {
        screen: AlarmDetail,
        navigationOptions: {
            header: null,
        }
    },
    HealthHome: {
        screen: HealthHome,
        navigationOptions: {
            header: null,
        }
    },
    HealthChart: {
        screen: HealthChart,
        navigationOptions: {
            header: null,
        }
    },
}, {
    navigationOptions: {
        gesturesEnabled: false
    }
})
