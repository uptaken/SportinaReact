import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableHighlight,
	FlatList,
} from 'react-native';

import Base from '../../../Base';
import Style from '../../../Style/theme'
import Button from '../../../Components/Button'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'

import SearchCompetition from '../../../Components/SearchCompetition'
import HeadCompetitionInfo from '../../../Components/CompetitionDetail/HeadCompetitionInfo'
import ListRegistered from '../../../Components/CompetitionDetail/ListRegistered'
import TotalPaid from '../totalPaid'

import NoData from '../../../Components/NoData'

export default class RegisterCompetition extends Base {
	state = {
		data_arr : [],
		buttonAction : ['coach', 'athlete'],
	}
	
	render() {
		const {
			data,
			participant_arr,
			auth_data,
			participantDetail,
			addButton,
			totalPriceRegister,
			paymentBtn,
			is_close_regis,
			end_competition
		} = this.props
		return (
            <View style={{flex: 1}}>
				<View style={{padding : 16}}>

					<HeadCompetitionInfo name={data.name} info={data.description} />

					<View style={{marginTop : 16}}>
						{
							!is_close_regis ?
							<>
							{
							this.state.buttonAction.map((data, index)=>(
								<View style={{marginBottom : 8}} key={index}>
									<TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(Style.colors.colorPrimaryDark, false)} disabled={is_close_regis} onPress={()=>addButton(data)}>
										<View style={{backgroundColor : Style.colors.colorPrimary, padding : 8, alignItems : 'center'}} key={index}>
											<View style={{flexDirection : 'row'}}>
												<View style={{justifyContent : 'center'}}>
													<Icon name={'add'} size={24} color={'white'} />
												</View>
												<View style={{justifyContent : 'center'}}>
													<Text style={{color : 'white', textTransform : 'uppercase'}}>{data}</Text>
												</View>
											</View>
										</View>
									</TouchableNativeFeedback>
								</View>
							))
							}
							</>
							:<></>
						}

						<View style={{marginTop : 12}}>
							<SearchCompetition ChangeInput={(value)=>this.changeInput(value)} />
						</View>
					</View>
				</View>

				<ScrollView>
			
					<View style={{paddingHorizontal : 16}}>

						<View>
							{
								participant_arr.map((data, index)=>(
									<TouchableHighlight key={index} onPress={()=>participantDetail(index)} underlayColor={'transparent'} style={{marginTop : index === 0 ? 0 : 8}}>
										<ListRegistered data={data} auth_data={auth_data} />
									</TouchableHighlight>
								))
							}
						</View>
						{
							participant_arr.length === 0 ?
							<NoData />
							: <></>
						}

					</View>
					
				</ScrollView>

				<TotalPaid totalPriceRegister={totalPriceRegister} actionBtn={()=>paymentBtn()} end_competition={end_competition} />
				
			</View>
		);
	}
}