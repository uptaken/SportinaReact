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
	FlatList,
    Picker
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'
import Button from '../Components/Button'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'
// import {Picker} from '@react-native-community/picker';

import SearchCompetition from '../Components/SearchCompetition'
import HeadTitle from '../Components/HeadTitle'

import {NavigationContainer, StackActions} from '@react-navigation/native'

export default class RegisterPayoutComplete extends Base {
	state = {
    }

	async componentDidMount(){

    }
    
    async backToCompetition(){
        var competition = this.props.route.params.competition_data
        competition = JSON.parse(competition)
        if(this.props.route.params.navigateFrom === 'register'){
            this.props.navigation.navigate('CompetitionDetail', {id : competition.id})
        }
        else if(this.props.route.params.navigateFrom === 'payment'){
            this.props.navigation.dispatch(
                StackActions.replace('Index', {screen : 'PaymentTab'}),
            );
        }
    }

	render() {
		return (
            <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>

                <Icon name={'check-circle'} size={64} />
                <View style={{marginTop : 16, alignItems : 'center'}}>
                    <Text>Thank You</Text>
                    <Text>for The Registration</Text>
                </View>

                <View style={{marginTop : 32, alignItems : 'center'}}>
                    <Button title={this.props.route.params.navigateFrom === 'payment' ? 'Back To Payment' : 'Back To Competition'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.backToCompetition()} />
                </View>

            </View>
        );
	}
}