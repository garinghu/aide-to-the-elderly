import React from 'react';
import { createBottomTabNavigator } from "react-navigation";
import { Icon } from 'native-base';

import Login from './pages/loginRegist';
import Config from './config';
import PostBar from './pages/postBar';
import Chat from './pages/chat';
import My from './pages/my';
import Clock from './pages/clock';
import Footer from './common/Footer';

const AppNavigator = createBottomTabNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      tabBarVisible: false,
    }
  },
  PostBar: {
    screen: PostBar,
    navigationOptions: {
      title: '发现',
      tabBarIcon: ({ focused, horizontal, tintColor, }) => 
            <Icon theme={{ iconFamily: 'AntDesign' }} name='star' 
            style={{ color: tintColor }} size={horizontal ? 20 : 25}/>,
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: '聊天',
      tabBarIcon: ({ focused, horizontal, tintColor, }) => 
            <Icon theme={{ iconFamily: 'AntDesign' }} name='eye' 
            style={{ color: tintColor }} size={horizontal ? 20 : 25}/>,
    },
  },
  Clock: {
    screen: Clock,
    navigationOptions: {
      title: '提醒',
      tabBarIcon: ({ focused, horizontal, tintColor, }) => 
            <Icon theme={{ iconFamily: 'Entypo' }} name='clock' 
            style={{ color: tintColor }} size={horizontal ? 20 : 25}/>,
    },
  },
  My: {
    screen: My,
  },
}, {
  tabBarComponent: props => <Footer {...props}/>,
  tabBarOptions: Config.tabBarOptions,
});

export default AppNavigator;