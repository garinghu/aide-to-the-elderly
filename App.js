import React from 'react';
import { createBottomTabNavigator } from "react-navigation";
import Config from './config';
import PostBar from './pages/postBar';
import Test from './test/test';
import Chat from './pages/chat';
import My from './pages/my';

const AppNavigator = createBottomTabNavigator({
  PostBar: {
    screen: PostBar,
  },
  Chat: {
    screen: Chat,
  },
  My: {
    screen: My,
  },
}, {
  tabBarOptions: Config.tabBarOptions,
});

export default AppNavigator;