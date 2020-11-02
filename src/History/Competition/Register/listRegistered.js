import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
	Button,
	FlatList
} from 'react-native';

import Base from '../../../Base';
import Style from '../../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'

import SearchCompetition from '../../../Components/SearchCompetition'
import HeadTitle from '../../../Components/HeadTitle'
import ListRegistered from '../../../Components/CompetitionDetail/ListRegistered'

export default class ListRegisteredHistory extends Base {
	state = {
        data_arr : [],
        info_data : [],
		info_data1 : [],
		list_registered_arr : [
			{title : 'Athlete'},
			{title : 'Coach'}
		]
    }

	async componentDidMount() {
	}

	async toListRegistered(index){

	}

	render() {
		return (
            <View style={{flex : 1, backgroundColor : Style.colors.bgBase}}>
                <HeadTitle title={'Competition'} subTitle={'info'} />
                
                    <View style={{padding : 16}}>
                        <SearchCompetition />
                    </View>
                    
                    <ScrollView style={{marginBottom : 8}}>
                        <View style={{padding : 16, paddingTop : 0, paddingBottom : 8}}>
                            <ListRegistered />
                        </View>
                    </ScrollView>

            </View>
		);
	}
}