import React from 'react';
import {
    View,
    Image,
    Text,
	TouchableOpacity,
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class ClubList extends Base {
	state = {
	};

	render() {
        const {data_arr} = this.props
		return (
            <View style={{borderColor : Style.colors.gray_ea, borderWidth : 1, padding : 12, borderRadius : 4}}>

                {
                    data_arr.map((data, index)=>(
                        <View style={{flexDirection : 'row', marginTop : (index==0) ? 0 : 16}} key={index}>
                            <View style={{flex : 2}}>
                                <View style={{flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'center'}}>
                                        <Icon name={'explore'} size={24} color={Style.colors.green_sportina} />
                                    </View>
                                    <View style={{marginLeft : 8, justifyContent : 'center'}}>
                                        <Text>{data.team.name}</Text>
                                        {/* <Text>{data.team.city.name} - {data.team.city.province.name}</Text> */}
                                    </View>
                                </View>
                            </View>
                            <View style={{flex : 1, justifyContent : 'center'}}>
                                <View style={{flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'center'}}>
                                        <Icon name={'person'} size={24} />
                                    </View>
                                    <View style={{justifyContent : 'center', flex : 1, alignItems : 'flex-end'}}>
                                        <Text>{data.total_athlete} / {data.estimate_athlete}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View>
		);
	}
}