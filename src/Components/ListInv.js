import React from 'react';
import {
    View,
    Image,
    Text,
	TouchableOpacity,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

export default class ListInv extends Base {
	state = {
	};

	render() {
		return (
            <View style={{flexDirection : 'row'}}>
                <View>
                    <Text>{this.props.title}</Text>
                    {
                        this.props.subTitle != null ?
                        <Text>{this.props.subTitle}</Text>
                        : <></>
                    }
                </View>
                <View style={{flex : 1, alignItems : 'flex-end', justifyContent : 'center'}}>
                    <Text>Rp. {this.props.price}</Text>
                </View>
            </View>
		);
	}
}