import React from 'react';
import {
    View,
    Text,
    TouchableNativeFeedback
} from 'react-native';

import Base from '../Base';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class Button extends Base {
    render() {
        const {
            is_disabled,
        } = this.props
		return (
            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('white', false)} onPress={()=>this.props.actionBtnPress()} disabled={is_disabled != null ? is_disabled : false}>
                <View style={{backgroundColor : this.props.color, padding : 12, borderRadius : 4, alignItems : 'center'}}>
                    <Text style={{color : this.props.textColor != null ? this.props.textColor : 'white', textTransform: 'uppercase'}}>{this.props.title}</Text>
                </View>
            </TouchableNativeFeedback>
		);
	}
}