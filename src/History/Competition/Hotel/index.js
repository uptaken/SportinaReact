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

import HeadCompetitionInfo from '../../../Components/CompetitionDetail/HeadCompetitionInfo'
import TotalList from '../../../Components/CompetitionDetail/TotalList'
import ClubList from '../../../Components/CompetitionDetail/ClubList'

export default class CompetitionHotelHistory extends Base {
	state = {
        data_arr : [
            {id : 1},
            {id : 2},
            {id : 3},
            {id : 4},
            {id : 5},
            {id : 6},
        ],
        info_data : [],
		info_data1 : [],
		list_registered_arr : [
			{title : 'Athlete'},
			{title : 'Coach'}
		]
    }

	async componentDidMount() {
        console.log('detail')
        var info_data = [
            {title : 'Date', value : 'test'},
            {title : 'Status', value : 'test'},
        ]
        var info_data1 = [
            {title : 'Date 1st Registered', value : 'test'},
            {title : 'Athelete Registered', value : 'test'},
            {title : 'Coach Registered', value : 'test'},
        ]

        await this.setState({info_data : info_data, info_data1 : info_data1})
	}

	async toListRegistered(index){
		this.props.navigation.navigate('ListRegisteredHistory')
    }
    
    async toPayment(){
        this.props.navigation.navigate("PaymentDetail")
    }

	render() {
		return (                
            <View style={{flex : 1, backgroundColor : Style.colors.bgBase}}>

                <View style={{padding : 16}}>
                    <View style={{flexDirection : 'row'}}>

                        <View style={{justifyContent : 'space-between'}}>
                            <Image style={{height : 134, aspectRatio : 1}} source={this.competition_example} />
                        </View>
                        <View style={{marginLeft : 16, flex : 1}}>
                            <HeadCompetitionInfo name={'Competition'} info={'info'} />
                            
                            <View style={{marginTop : 8}}>
                            {
                                this.state.info_data.map((data, index)=>(
                                    <View style={{marginBottom : 4, flexDirection : 'row'}} key={index}>
                                        <View style={{flex : 1}}>
                                            <Text>{data.title}</Text>
                                        </View>
                                        <View style={{flex : 2}}>
                                            <Text> : {data.value}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                            </View>
                        </View>

                    </View>
                </View>

                <View style={{flex : 1, marginBottom : 8}}>
                    <ScrollView>
                        <View style={{padding : 16, paddingTop : 0}}>
                            {
                                this.state.data_arr.map((data, index)=>(
                                    <View style={{marginTop : index == 0 ? 0 : 8}} key={index}>
                                        <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.toPayment()}>
                                            <ListHotel />
                                        </TouchableHighlight>
                                    </View>
                                ))
                            }

                        </View>
                    </ScrollView>
                </View>

            </View>
                
		);
	}
}

class ListHotel extends Base {
    render() {
        return (
            <View style={{backgroundColor : 'white', borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                <View style={{flexDirection : "row", padding : 16}}>
                    <View>
                        <Image source={this.hotel_1} style={{aspectRatio : 1, height : 80}} />
                    </View>
                    <View style={{paddingHorizontal : 16}}>
                        <Text style={{fontWeight : 'bold'}}>Hotel Name</Text>
                        <Text style={{marginTop : 4}}>2 Room | 3 Guest</Text>
                    </View>
                </View>
                <View style={{padding : 16, borderTopWidth : 1, borderTopColor : Style.colors.gray_ea, flexDirection : 'row'}}>
                    <Text>Total Payment</Text>
                    <Text style={{fontWeight : 'bold', color : Style.colors.colorPrimary, marginLeft : 16}}>Rp. </Text>
                </View>
            </View>
        );
    }
}