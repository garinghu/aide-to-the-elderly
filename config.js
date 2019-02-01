export default config = {
    tabBarOptions: {
        //当前选中的tab bar的文本颜色和图标颜色
        activeTintColor: '#ed6560',
        //当前未选中的tab bar的文本颜色和图标颜色
        inactiveTintColor: '#cdcdcd',
        //是否显示tab bar的图标，默认是false
        showIcon: true,
        //showLabel - 是否显示tab bar的文本，默认是true
        showLabel: true,
        //是否将文本转换为大小，默认是true
        upperCaseLabel: false,
        //material design中的波纹颜色(仅支持Android >= 5.0)
        pressColor: '#788493',
        //按下tab bar时的不透明度(仅支持iOS和Android < 5.0).
        pressOpacity: 0.8,
        //tab bar的样式
        style: {
            backgroundColor: '#fff',
            paddingBottom: 1,
            borderTopWidth: 0.2,
            paddingTop: 1,
            borderTopColor: '#ccc',
        },
        //tab bar的文本样式
        labelStyle: {
            fontSize: 11,
            margin: 1
        },
        tabStyle: {
            height: 45
        },
        //tab 页指示符的样式 (tab页下面的一条线).
        indicatorStyle: {height: 0},
    },
    // proxy: 'http://188.131.233.116:3000',
    proxy: 'http://localhost:3000',
    socketServer: 'http://localhost:8088',
    postTypes: ['测试', '类别1', '类别2'],
    buttonStyles: ['#2463f6', '#67aa56', '#e0a051', '#bf4744'],
    clockRepeat: ['永不','星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
    loginTitle: '唯愿贤明身后在，不悔须臾做先锋',
    alarmTitle: '没有人是孤独的',
}