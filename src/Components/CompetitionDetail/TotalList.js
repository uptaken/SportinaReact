import React from 'react';
import {
    View,
    Image,
    Text,
	TouchableOpacity,
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'

export default class TotalList extends Base {
	state = {
	};

	render() {
		return (
            <View style={{alignItems : 'center'}}>
                <Text style={{fontWeight : 'bold'}}>{this.props.title}</Text>
                <Text style={{fontWeight : 'bold'}}>{this.props.value}</Text>
            </View>
		);
	}
}