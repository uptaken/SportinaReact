import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

export default class ListPayment extends Base {
	state = {
	};

	render() {
        const {
            data,
            toDetail
        } = this.props
		return (
            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('white', false)} onPress={()=>toDetail()}>
            <View style={{overflow : 'hidden', backgroundColor : 'white', marginBottom : 8, borderColor : Style.colors.gray_ea, borderWidth : 1}}>

                    <View style={{flexDirection : 'row', padding : 8}}>
                        <View style={{justifyContent : 'space-between'}}>
                            <Image style={{width : 112, height : 112}} source={data.image_display} />
                        </View>
                        <View style={{flex : 1, marginLeft : 16}}>
                            <Text style={{textTransform : 'capitalize'}}>{data.type}</Text>
                            <Text style={{textTransform : 'capitalize'}}>{data.competition.name}</Text>
                            <Text style={{textTransform : 'capitalize'}}>{data.competition.description}</Text>
                            <View style={{flexDirection : 'row', marginVertical : 8}}>
                                <Text style={{flex : 1}}>Athlete : {data.athlete_registration.length}</Text>
                                <Text style={{alignItems : 'flex-end'}}>Rp. {data.total_price.toLocaleString(this.priceFormat)}</Text>
                            </View>
                            <Text>Deadline : {data.due_date_format}</Text>
                        </View>
                    </View>
                    
            </View>
            </TouchableNativeFeedback>
		);
	}
}