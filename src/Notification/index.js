import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableHighlight,
	TouchableWithoutFeedback,
	Button,
	FlatList
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'

import HeadTitle from '../Components/HeadTitle'
import NoDataFound from '../Components/NoData'

export default class Notification extends Base {
	state = {
		data_arr : [
			// {id : 1}, {id : 2}, {id : 3},
			// {id : 4}, {id : 5}, {id : 6},
			// {id : 7}
		]
	};

	async componentDidMount() {
	}

	render() {
		return (
            <View style={{flex : 1}}>
            
                <HeadTitle title={'Notifications'} />

                <ScrollView>
                    <View style={{padding : 16, marginBottom : 4}}>

                        {
                            this.state.data_arr.map((data, index)=>(
                                <View style={{marginTop : index == 0 ? 0 : 4}} key={index}>
                                    <ListNotification />
                                </View>
                            ))
                        }

                    </View>
                </ScrollView>

				
			</View>
		);
	}
}

class ListNotification extends Base {
    render() {
        return (
            <View style={{padding : 8, backgroundColor : 'white', borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                <View style={{flexDirection : 'row'}}>
                    <View style={{justifyContent : 'center'}}>
                        <Icon name={'error'} color={Style.colors.colorPrimary} size={16} />
                    </View>
                    <View style={{justifyContent : 'center', marginLeft : 8}}>
                        <Text>09 September 2020 | 11:11</Text>
                    </View>
                </View>
                <View style={{marginTop : 8}}>
                    <Text style={{fontWeight : 'bold', fontSize : 18}}>Notification</Text>
                    <Text style={{marginTop : 4}}>Detail</Text>
                </View>
            </View>
        );
    }
}