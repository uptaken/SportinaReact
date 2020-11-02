import React from 'react';
import {
    View,
    Image,
    Text,
	TouchableOpacity,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

export default class ProfileHead extends Base {
	state = {
	};

	render() {
		return (
            <View style={{backgroundColor : Style.colors.colorPrimary}}>
                <View style={{backgroundColor : Style.colors.black70p, paddingVertical : 8, paddingHorizontal : 16, alignItems : this.props.position != null ? this.props.position : 'flex-start'}}>
                    <Text style={{color : 'white', fontWeight : 'bold', textTransform : 'capitalize'}}>{this.props.title}</Text>
                    {
                        this.props.subTitle != null ?
                        <Text style={{color : 'white', textTransform : 'capitalize'}}>{this.props.subTitle}</Text>
                        : <></>
                    }
                </View>
            </View>
		);
	}
}