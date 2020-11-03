import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	Button,
    FlatList,
    AsyncStorage,
    Linking,
    TouchableHighlight
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'

import SearchCompetition from '../../Components/SearchCompetition'
import HeadCompetitionInfo from '../../Components/CompetitionDetail/HeadCompetitionInfo'
import TotalList from '../../Components/CompetitionDetail/TotalList'
import ClubList from '../../Components/CompetitionDetail/ClubList'

export default class DetailCompetition extends Base {
	state = {
        token : '',
		optionsAxios : {
			timeout: this.axiosTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
        data_competition : {},
        info_data : [],
        total_data : [],

        class_data : [
            {title : 'Cadet 10-15'}, {title : 'Cadet 4-6'}
        ],
        athlete_arr : [],
        coach_arr : [],
        survey_arr : [],
        competition_id : ''
    }

	async componentDidMount() {
    }

	render() {
        const {
            data,
            info_data,
            total_data,
            downloadProposal,
            survey_arr,
            division_regis_arr,
            divisionClassDetail
        } = this.props
		return (
            <ScrollView>
                
                <View style={{padding : 16}}>

                    <HeadCompetitionInfo name={data.name} info={data.description} />

                    <View style={{flexDirection : 'row', marginTop : 16}}>

                        <View style={{justifyContent : 'space-between', flex : 1}}>
                            <Image source={data.image_display} style={{height : 160, aspectRatio : 1}} />
                        </View>
                        <View style={{flex : 1, marginLeft : 16}}>
                            {
                                info_data.map((data, index)=>(
                                    <View style={{marginBottom : 8}} key={index}>
                                        <Text>{data.title}</Text>
                                        <Text style={{textTransform : 'capitalize'}}>{data.value}</Text>
                                    </View>
                                ))
                            }
                        </View>

                    </View>

                    <View style={{flexDirection : 'row', marginTop : 16, backgroundColor : 'white', padding : 10, borderColor : Style.colors.gray_ea, borderWidth : 1}}>
                        {
                            total_data.map((data, index)=>(
                                <View key={index} style={{flex : 1}}>
                                    <TotalList title={data.title} value={data.value} />
                                </View>
                            ))
                        }
                    </View>

                    <View style={{marginTop : 16}}>
                        <Text>Proposal</Text>

                        <View style={{padding : 16, marginTop : 8, backgroundColor : 'white', borderColor : Style.colors.gray_ea, borderWidth : 1}}>
                            <TouchableOpacity onPress={()=>downloadProposal()}>
                                <View style={{flexDirection : "row", alignSelf : 'center'}}>
                                    <Icon name={'vertical-align-bottom'} size={24} color={Style.colors.green_sportina} />
                                    <Text style={{marginLeft : 8}}>Download Proposal</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{marginTop : 16}}>
                        {
                            division_regis_arr.map((data, index)=>(
                            <View key={index}>

                                <Text>{data.name}</Text>

                                <View style={{marginTop : 8}}>

                                        {
                                            data.data_class_arr.map((class_arr, index1)=>(
                                            <View style={{flexDirection : 'row'}} key={index1}>
                                                {
                                                    class_arr.map((data_class, index2)=>(
                                                    <TouchableHighlight style={{flex : 1/4}} onPress={()=>this.props.divisionClassDetail(index, index1, index2)} underlayColor={'transparent'} key={index2}>
                                                    <View style={{borderColor : Style.colors.gray_ea, borderWidth : 1}} key={index2}>
                                                        <View style={{flexDirection : 'row'}}>
                                                            <View style={{padding : 4, justifyContent : 'center', backgroundColor : (data_class.gender === 1 ? Style.colors.genderMale : Style.colors.genderFemale)}}>
                                                                <FAIcon name={(data_class.gender === 1 ? 'mars' : 'venus')} size={14} />
                                                            </View>
                                                            <View style={{flex : 1, justifyContent : 'center', backgroundColor : Style.colors.colorPrimary}}>
                                                                <View style={{alignItems: 'center'}}>
                                                                    <Text>{data_class.name}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{alignItems : 'center', padding : 8}}>
                                                            <View style={{flexDirection : 'row'}}>
                                                                <View style={{justifyContent : 'center'}}>
                                                                    <Icon name={'person'} size={24} />
                                                                </View>
                                                                <View style={{justifyContent : 'center', marginLeft : 4}}>
                                                                    <Text>{data_class.athlete_registration.length}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    </TouchableHighlight>
                                                    )) 
                                                }
                                            </View>
                                            ))
                                        }
                                    
                                    </View>

                            </View>
                            ))
                        }
                    </View>

                    <View style={{marginTop : 16}}>
                        <Text>Club</Text>

                        <View style={{marginTop : 8, backgroundColor : 'white'}}>

                            <ClubList data_arr={survey_arr} />
                            
                        </View>

                    </View>

                </View>
                
            </ScrollView>
		);
	}
}