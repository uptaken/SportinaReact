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
	FlatList
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'

import SearchCompetition from '../../Components/SearchCompetition'

import HeadCompetitionInfo from '../../Components/CompetitionDetail/HeadCompetitionInfo'
import TotalList from '../../Components/CompetitionDetail/TotalList'
import ClubList from '../../Components/CompetitionDetail/ClubList'

export default class CompetitionDetailHistory extends Base {
	state = {
        data_arr : [],
        info_data : [],
        info_data1 : [],
        total_data : [],

        class_data : [
            {title : 'Cadet 10-15'}, {title : 'Cadet 4-6'}
        ],
    }

	async componentDidMount() {
        var info_data = [
            {title : 'Date', value : 'test'},
            {title : 'Status', value : 'test'},
        ]
        var info_data1 = [
            {title : 'Type Competition', value : 'test'},
            {title : 'Venue', value : 'test'},
            {title : 'Close Registration', value : 'test'},
            {title : 'Cost per Athlete', value : 'test'},
        ]

        var total_data = [
            {title : 'Team', value : '123'},
            {title : 'Book', value : '123'},
            {title : 'Athlete', value : '123'},
            {title : 'Coach', value : '123'},
        ]

        await this.setState({info_data : info_data, total_data : total_data, info_data1 : info_data1})
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
                                        <View style={{flex : 2}}>
                                            <Text> : {data.value}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>

                    <View style={{flexDirection : 'row', marginTop : 16, backgroundColor : 'white', padding : 10, borderColor : Style.colors.gray_ea, borderWidth : 1}}>
                        {
                            this.state.total_data.map((data, index)=>(
                                <View key={index} style={{flex : 1}}>
                                    <TotalList title={data.title} value={data.value} />
                                </View>
                            ))
                        }
                    </View>

                    <View style={{marginTop : 16}}>
                        <Text>Beginner</Text>

                        <View style={{marginTop : 8}}>

                        <View style={{flexDirection : 'row'}}>
                        <View style={{flex : 1/4, borderColor : Style.colors.gray_ea, borderWidth : 1, width : '25%'}}>
                            <View style={{flexDirection : 'row'}}>
                                <View style={{padding : 4, justifyContent : 'center', backgroundColor : Style.colors.genderMale}}>
                                    <FAIcon name={'mars'} size={14} />
                                </View>
                                <View style={{flex : 1, justifyContent : 'center', backgroundColor : Style.colors.colorPrimary}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text>Junior</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{alignItems : 'center', padding : 8}}>
                                <View style={{flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'center'}}>
                                        <Icon name={'person'} size={24} />
                                    </View>
                                    <View style={{justifyContent : 'center', marginLeft : 4}}>
                                        <Text>asd</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex : 1/4, borderColor : Style.colors.gray_ea, borderWidth : 1, width : '25%'}}>
                            <View style={{flexDirection : 'row'}}>
                                <View style={{padding : 4, justifyContent : 'center', backgroundColor : Style.colors.genderMale}}>
                                    <FAIcon name={'mars'} size={14} />
                                </View>
                                <View style={{flex : 1, justifyContent : 'center', backgroundColor : Style.colors.colorPrimary}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text>Junior</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{alignItems : 'center', padding : 8}}>
                                <View style={{flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'center'}}>
                                        <Icon name={'person'} size={24} />
                                    </View>
                                    <View style={{justifyContent : 'center', marginLeft : 4}}>
                                        <Text>asd</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex : 1/4, borderColor : Style.colors.gray_ea, borderWidth : 1, width : '25%'}}>
                            <View style={{flexDirection : 'row'}}>
                                <View style={{padding : 4, justifyContent : 'center', backgroundColor : Style.colors.genderMale}}>
                                    <FAIcon name={'mars'} size={14} />
                                </View>
                                <View style={{flex : 1, justifyContent : 'center', backgroundColor : Style.colors.colorPrimary}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text>Junior</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{alignItems : 'center', padding : 8}}>
                                <View style={{flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'center'}}>
                                        <Icon name={'person'} size={24} />
                                    </View>
                                    <View style={{justifyContent : 'center', marginLeft : 4}}>
                                        <Text>asd</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex : 1/4, borderColor : Style.colors.gray_ea, borderWidth : 1, width : '25%'}}>
                            <View style={{flexDirection : 'row'}}>
                                <View style={{padding : 4, justifyContent : 'center', backgroundColor : Style.colors.genderMale}}>
                                    <FAIcon name={'mars'} size={14} />
                                </View>
                                <View style={{flex : 1, justifyContent : 'center', backgroundColor : Style.colors.colorPrimary}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text>Junior</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{alignItems : 'center', padding : 8}}>
                                <View style={{flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'center'}}>
                                        <Icon name={'person'} size={24} />
                                    </View>
                                    <View style={{justifyContent : 'center', marginLeft : 4}}>
                                        <Text>asd</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        </View>
                        
                        
                        {/* <FlatList
                            data={this.state.class_data}
                            renderItem={({item, index}) => (
                                
                            )}
                            keyExtractor={(item, index) => index}
                            scrollEnabled={false}
                            numColumns={4}
                            /> */}
                        </View>
                    </View>

                    <View style={{marginTop : 16}}>
                        <Text>Club</Text>

                        <View style={{marginTop : 8, backgroundColor : 'white'}}>

                            <ClubList />
                            
                        </View>

                    </View>

                    

                </View>
                
            </ScrollView>
		);
	}
}