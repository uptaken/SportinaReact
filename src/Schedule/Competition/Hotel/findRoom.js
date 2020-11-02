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

import HeadTitle from '../../../Components/HeadTitle'
import Button from '../../../Components/Button'

export default class HotelFindRoom extends Base {
	state = {
        data_room : {checkin_date : '', checkout_date : ''},
        datepicker : {checkin : false, checkout : false},
        date_val : {checkin : new Date(), checkout : new Date()},
    }

	async componentDidMount() {
        console.log('hotel')
    }

    async toNext(){
		this.props.navigation.navigate('HotelPickRoom')
    }
    
    async showDatePicker(type){
        var datepicker = this.state.datepicker
        datepicker[type] = !datepicker[type]
        await this.setState({datepicker : datepicker})
    }

    async changeInput(value, type){
        console.log(value)
        var data = this.state.data_room
        data[type] = value
        await this.setState({datepicker : {checkin : false, checkout : false, data_room : data}})
    }
    
	render() {
		return (
            <View style={{flex: 1, backgroundColor : Style.colors.bgBase}}>
				<HeadTitle title={'Name Competition'} position={'center'} />

				<ScrollView>

                    <View style={{position : 'relative'}}>
                        <Image source={this.hotel_1} style={{height : 'auto', width : '100%', resizeMode : 'cover', aspectRatio : 360/195}} />
                        <View style={{position : 'absolute', bottom : 0, padding : 8, backgroundColor : Style.colors.black40p, width : '100%'}}>
                            <Text style={{fontWeight : 'bold', color : 'white'}}>Hotel Name</Text>
                            <Text style={{color : 'white'}}>Rp. </Text>
                        </View>
                    </View>
			
					<View style={{padding : 16}}>

                        <View style={{flexDirection : 'row'}}>

                            <View style={{flex : 1, paddingRight : 8}}>
                                <Text>Check-In</Text>
                                <TextInput 
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                    placeholder={'Check-In'}
                                    returnKeyType={"next"}
                                    value={this.state.checkin_date}
                                    onFocus={() => Keyboard.dismiss() || this.showDatePicker('checkin')}
                                    editable={true}
                                    onChangeText={text => console.log(text)}
                                    ref={(input) => { this.check_in = input }} />
                                {this.state.datepicker.checkin ? (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        timeZoneOffsetInMinutes={0}
                                        value={this.state.date_val.checkin}
                                        mode={'date'}
                                        maximumDate={new Date()}
                                        display="spinner"
                                        onChange={(event, selectedDate) =>
                                        this.changeInput(selectedDate, 'checkin_date')
                                        }
                                    />
                                ) : <></>}
                            </View>

                            <View style={{flex : 1, paddingLeft : 8}}>
                            <Text>Check-Out</Text>
                            <TextInput 
                                style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                placeholder={'Check-Out'}
                                returnKeyType={"next"}
                                value={this.state.checkout_date}
                                onFocus={() => Keyboard.dismiss() || this.showDatePicker('checkout')}
                                editable={true}
                                onChangeText={text => console.log(text)}
                                ref={(input) => { this.check_out = input }} />
                            {this.state.datepicker.checkout ? (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    timeZoneOffsetInMinutes={0}
                                    value={this.state.date_val.checkout}
                                    mode={'date'}
                                    maximumDate={new Date()}
                                    display="spinner"
                                    onChange={(event, selectedDate) =>
                                    this.changeInput(selectedDate, 'checkout_date')
                                    }
                                />
                            ) : <></>}
                        </View>
                        
                        </View>

                        <View style={{marginTop : 16}}>
                            <Text>Room</Text>
                            <TextInput 
                                style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                placeholder={'Room'}
                                returnKeyType={"done"}
                                editable={true}
                                onChangeText={text => this.ChangeInput(text, 'room')}
                                ref={(input) => { this.room = input }}
                                keyboardType={'number-pad'} />
                        </View>


					</View>
					
				</ScrollView>
                <View style={{padding : 16, backgroundColor : 'white'}}>
                    <Button title={'Check Room Availability'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.toNext()} />
                </View>
				
			</View>
		);
	}
}