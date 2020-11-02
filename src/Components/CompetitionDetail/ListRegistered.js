import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class ListRegistered extends Base {
	state = {
	};

	render() {
        const {
            data,
            auth_data
        } = this.props
		return (
            <View style={{backgroundColor : 'white', padding : 16, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                <View style={{flexDirection : 'row'}}>

                    <View style={{justifyContent : 'space-between'}}>
                        <Image style={{width : 64, height : 64, borderRadius : 96/2}} source={data.image_display} />
                        <View style={{marginTop : 8, alignItems : 'center'}}>
                            <Text style={{textTransform : 'capitalize'}}>{data.type}</Text>
                        </View>
                    </View>
                    <View style={{flex : 1, marginLeft : 16}}>
                        <Text style={{fontWeight : 'bold', textTransform : 'capitalize'}}>{data.name}</Text>
                        <Text style={{textTransform : 'capitalize'}}>{data.unit != null ? data.unit.name : auth_data.name}</Text>
                        

                        {
                            data.type === 'athlete' ?
                            <View style={{marginTop : 8, flexDirection : 'row'}}>
                                <Text>{this.moment(data.birth_date).format('DD MMM YYYY')}</Text>
                                <View style={{flex : 1, alignItems : 'flex-end'}}>
                                    <Text>{data.weight}kg / {data.height}cm</Text>
                                </View>
                            </View>
                            :
                            <Text style={{marginTop : 8}}>{data.phone}</Text>
                        }

                        <View style={{marginTop : 8, flexDirection : 'row'}}>
                            <Text style={{textTransform : 'capitalize'}}>{data.type === 'athlete' ? data.class.division.name + '/' + data.class.name : data.grade.grade}</Text>
                            <View style={{flex : 1, alignItems : 'flex-end'}}>
                                <Text style={{
                                    color : data.status_registration === 'registered' ? Style.colors.green_sportina : 
                                    data.status_registration === 'canceled' ? Style.colors.red70p : Style.colors.colorPrimaryDark,
                                    fontWeight : 'bold',
                                    textTransform : 'capitalize'}}>
                                        {data.status_registration}
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
            
		);
	}
}