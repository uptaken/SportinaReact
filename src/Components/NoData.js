import React from 'react';
import {
    View,
    Image,
    Text,
	TouchableOpacity,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

export default class NoData extends Base {
	state = {
	};

	render() {
		return (
            <View>
                <Text style={{alignSelf : 'center'}}>No Data Found</Text>
            </View>
		);
	}
}