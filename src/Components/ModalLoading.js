import React from 'react';
import {
    View,
    Image,
    Text,
    Modal
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

export default class ListPayment extends Base {
	state = {
	};

	render() {
        const {
            is_modal_loading
        } = this.props
		return (
            <Modal
                transparent={true}
                visible={is_modal_loading}
                animationType="fade">
                <View style={{backgroundColor : '#000000B3', flex : 1, justifyContent : 'center'}}>
                    <View style={{margin : 16 * 1.5, backgroundColor : 'white', radius : 4, padding : 16}}>
                        <View>
                            <Text style={{fontWeight : 'bold', fontSize : 16}}>Harap Tunggu...</Text>
                        </View>
                    </View>
                </View>
            </Modal>
		);
	}
}