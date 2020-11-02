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

export default class CompetitionRegisterHistory extends Base {
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

	render() {
		return (
            <ScrollView style={{backgroundColor : Style.colors.bgBase}}>
                
                <View style={{padding : 16}}>

                    <View>
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
                        <View style={{marginTop : 8}}>
                            {
                                this.state.info_data1.map((data, index)=>(
                                    <View style={{marginBottom : 4, flexDirection : 'row'}} key={index}>
                                        <View style={{flex : 1}}>
                                            <Text>{data.title}</Text>
                                        </View>
                                        <View style={{flex : 1}}>
                                            <Text> : {data.value}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>

						<View style={{marginTop : 8}}>
                            {
                                this.state.list_registered_arr.map((data, index)=>(
									<TouchableHighlight underlayColor={'transparent'} activeOpacity={0.6} onPress={()=>this.toListRegistered(index)}>
									<View style={{padding : 16, backgroundColor : 'white', borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4, marginTop : index == 0 ? 0 : 8}}>
										<View style={{flexDirection : 'row'}}>
											<View>
												<Text>List {data.title} Registered</Text>
											</View>
											<View style={{flex : 1, alignItems : 'flex-end', justifyContent : 'center'}}>
												<Icon name={'chevron-right'} size={18} />
											</View>
										</View>
									</View>
									</TouchableHighlight>
                                ))
                            }
                        </View>
                    </View>

                </View>
                
            </ScrollView>
		);
	}
}