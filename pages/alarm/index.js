import React from 'react';
import { createStackNavigator } from "react-navigation";

import Home from './Home';
import AlarmSetting from './AlarmSetting';
import AlarmHeader from './AlarmHeader';

export default createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        }
    },
    AlarmSetting: {
        screen: AlarmSetting,
        navigationOptions: {
            headerTitle: <AlarmHeader />,
        }
    },
})
