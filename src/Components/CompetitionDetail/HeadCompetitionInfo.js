import React from 'react';
import {
    View,
    Image,
    Text,
	TouchableOpacity,
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'

export default class HeadCompetitionInfo extends Base {
	state = {
	};

	render() {
		return (
            <View>
                <Text style={{fontWeight : 'bold', textTransform : 'capitalize'}}>{this.props.name}</Text>
                <Text style={{textTransform : 'capitalize'}}>{this.props.info}</Text>
            </View>
		);
	}
}