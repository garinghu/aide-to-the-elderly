import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import Echarts from 'native-echarts';

export default class HealthDetailChart extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const { type, unit, xData, yData } = this.props;
        const option = {
            title: {
                text: type
            },
            tooltip: {},
            legend: {
                data:[unit]
            },
            xAxis: {
                data: xData,
            },
            yAxis: {
            },
            series: [{
                name: unit,
                type: 'bar',
                data: yData,
            }]
        };
        return (
            <Echarts option={option} height={400}/>
        );
    }
}

const styles = StyleSheet.create({
    
});
