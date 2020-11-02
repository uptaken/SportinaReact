import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	FlatList
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'

import SearchCompetition from '../../Components/SearchCompetition'
import Button from '../../Components/Button'

export default class TotalPaid extends Base {
	state = {
    }

	async componentDidMount() {
	}

	render() {
		return (
            <View style={{padding : 16, backgroundColor : 'white', marginTop : 8}}>
                <View style={{flexDirection : 'row'}}>
                    <View style={{flex : 2}}>
                        <Text>Total Remaining to be Paid</Text>
                        <Text style={{color : Style.colors.colorPrimary, fontWeight : 'bold'}}>Rp. </Text>
                    </View>
                    <View style={{flex : 1}}>
                        <Button title={'Payment'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.props.actionBtn()} />
                    </View>
                </View>
            </View>
        );
	}
}