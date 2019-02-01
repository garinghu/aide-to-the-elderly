import React from 'react';
import { Icon, View } from 'native-base';

const horizontal = true;

export default class IconTip extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { icon, showTip } = this.props;
        return (
            <View>
                <Icon theme={{ iconFamily: 'AntDesign' }} name={icon}
                style={{ color: '#ed6560' }} size={horizontal ? 20 : 25}/>
                {showTip && <View style={{position: 'absolute', right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#f00'}} />}
            </View>
        );
    }
}
