import React from 'react';
import { createStackNavigator } from "react-navigation";

import Home from './Home';
import Login from './Login';
import Regist from './Regist';

export default createStackNavigator({
    Home: {
        screen: Home,
    },
    Login: {
        screen: Login,
    },
    Regist: {
        screen: Regist,
    }
})
