import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableHighlight,
	Keyboard
} from 'react-native';

import Base from '../../../Base';
import Style from '../../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'

import SearchBar from '../../../Components/SearchCompetition'
import HeadTitle from '../../../Components/HeadTitle'
import Button from '../../../Components/Button'

export default class HotelPickRoom extends Base {
	state = {
    }

	async componentDidMount() {
    }

    async toNext(){
    }

    async pickRoom(){

    }

    
	render() {
		return (
            <View style={{flex: 1, backgroundColor : Style.colors.bgBase}}>
				<HeadTitle title={'Name Competition'} position={'center'} />

                <View style={{padding : 16, backgroundColor : 'white'}}>
                    <SearchBar />
                </View>

				<ScrollView>

                    <View style={{padding : 16}}>

                        <View style={{backgroundColor : 'white'}}>
                            <View style={{flexDirection : 'row', padding : 16, borderBottomColor : Style.colors.gray_ea, borderBottomWidth : 1}}>
                                <View>
                                    <Image source={this.hotel} style={{height : 80, aspectRatio : 1}} />
                                </View>
                                <View style={{padding : 8, marginLeft : 8}}>
                                    <Text style={{fontWeight : 'bold'}}>Room Name</Text>
                                    <Text>Capacity</Text>
                                    <Text>Available Room</Text>
                                </View>
                            </View>
                            <View style={{flexDirection : 'row', padding : 16}}>
                                <View style={{flex : 2}}>
                                    <Text style={{fontWeight : 'bold', color : Style.colors.colorPrimary}}>Rp. </Text>
                                    <Text>per room/night</Text>
                                </View>
                                <View style={{justifyContent : 'center', flex : 1}}>
                                    {/* <Text style={{textAlign : 'center'}}>Sorry! This room already full</Text> */}
                                    <Button title={'Pick'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.pickRoom()} />
                                </View>
                            </View>
                        </View>

                    </View>
					
				</ScrollView>

			</View>
		);
	}
}