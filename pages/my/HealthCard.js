import React from 'react';
import { StyleSheet, View, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Text , Card, CardItem, Body } from 'native-base';

import { storage } from '../../storage';
import { getDateYYMMDD } from '../../common/setting';
import Config from '../../config';

const { healthTitles } = Config;
const maxDate = getDateYYMMDD();

export default class HealthCard extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const { item, showModal } = this.props;
        return (
            <View>
                {
                    healthTitles.map((i, index) => item[i.key] && <View style={styles.healthCard} key={index}>
                        <View style={{ marginTop: 5, marginLeft: 5 }}>
                            <Text style={{ color: '#fff', fontSize: 20 }}>{i.title}</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={{ color: '#fff', fontSize: 45 }}>{item[i.key]}</Text>
                            <Text style={{ color: '#fff', fontSize: 15 }}>{i.unit}</Text>
                        </View>
                    </View>)
                }
                {
                    item.date == maxDate && <TouchableOpacity
                    onPress={showModal}>
                        <View style={styles.emptyDate}>
                            <Text style={{ color: '#fff' }}>修改数据</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#f2f2f2',
    },
    healthCard: {
        flex: 1, 
        height: 80, 
        backgroundColor: '#ed6560', 
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        flexDirection: 'row',
    },
    cardRight: {
        marginTop: 5, 
        marginLeft: 5, 
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 5,
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
});
