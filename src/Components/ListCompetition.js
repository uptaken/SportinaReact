import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

export default class ListCompetition extends Base {
	state = {
	};

	render() {
        const {data} = this.props
		return (
            <TouchableHighlight onPress={()=>this.props.onPressList()} underlayColor={'transparent'}>
                <View >
                    <View style={{borderColor : Style.colors.gray_ea, borderWidth : 1, backgroundColor : 'white'}}>
                        <View style={{alignItems : 'center'}}>
                            <Image source={data.image_display} style={{height : 'auto', width : '100%', resizeMode : 'cover', aspectRatio : 1}} />
                        </View>
                        <View style={{padding : 8, alignItems : 'center'}}>
                            <Text style={{textTransform : 'capitalize', textAlign : 'center'}}>{data.name}</Text>
                            <Text style={{textAlign : 'center'}}>{data.dateCompetition}</Text>
                            {/* <Text style={{textTransform : 'capitalize'}}>{data.place}</Text> */}
                            <Text style={{textTransform : 'capitalize', textAlign : 'center'}}>{data.placeCompetition}</Text>
                        </View>
                    </View>
                </View>
                </TouchableHighlight>
		);
	}
}