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

import Base from '../../../Base';
import Style from '../../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'

import SearchCompetition from '../../../Components/SearchCompetition'
import HeadCompetitionInfo from '../../../Components/CompetitionDetail/HeadCompetitionInfo'
import TotalPaid from '../totalPaid'

export default class HotelCompetition extends Base {
	state = {
        data_arr : []
    }

	async componentDidMount() {
        console.log('hotel')
    }

    async toNext(){
		this.props.navigation.navigate('RegisterPayout')
    }
    
    async toFindRoom(){
        this.props.navigation.navigate('HotelFindRoom')
    }
    
	render() {
		return (
            <View style={{flex: 1, backgroundColor : Style.colors.bgBase}}>
				<View style={{padding : 16}}>
                    <HeadCompetitionInfo name={'Competition'} info={'info'} />
				</View>

				<ScrollView>
			
					<View style={{paddingHorizontal : 16}}>

						<ListHotel findRoom={()=>this.toFindRoom()} />

					</View>
					
				</ScrollView>

                <TotalPaid actionBtn={()=>this.toNext()} />
				
			</View>
		);
	}
}

class ListHotel extends Base {
    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.findRoom()}>
            <View style={{marginBottom : 8}}>
                <View>
                    <Image source={this.hotel_1} style={{height : 'auto', width : '100%', resizeMode : 'cover', aspectRatio : 328/176, borderTopLeftRadius : 4, borderTopRightRadius : 4}} />
                </View>
                <View style={{flexDirection : 'row'}}>
                    <View style={{backgroundColor : 'white', padding : 16, flex : 1}}>
                        <Text style={{fontWeight : 'bold'}}>Hotel Name</Text>
                        <Text>Rp. / night</Text>
                    </View>
                    <View style={{backgroundColor : Style.colors.green_hotel, padding : 16, justifyContent : 'center'}}>
                        <Text style={{fontWeight : 'bold', color : 'white'}}>Open Book</Text>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}