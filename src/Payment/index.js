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
	AsyncStorage,
	TouchableNativeFeedback,
} from 'react-native';

import Style from '../Style/theme'
import SegmentedControl from '@react-native-community/segmented-control'

import Base from '../Base';
import Invoice from './Invoice'
import PaidOff from './PaidOff'

export default class Payment extends Base {
	state = {
		tab_arr : ['Invoice','Paid Off'],
		selectedIndex : 0,
		token : '',
		optionsAxios : {
			timeout: this.axiosTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		data_arr : [],
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
		var token = await AsyncStorage.getItem('token')
		var optionsAxios = this.state.optionsAxios
		optionsAxios.headers['Authorization'] = token
		await this.setState({token : token, optionsAxios : optionsAxios})

		await this.get_invoice('')
	}

	async get_invoice(type){
		try {
			var response = await this.axios.get(this.url + '/invoice/all?type=' + type, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				var data = response.data.data
				for(var x in data){
					data[x].image_display = this.no_image
					if(data[x].competition.file_name != null){
						data[x].image_display = {uri : this.url_image + '/competition?file_name=' + data[x].competition.file_name + '&random=' + new Date().getTime()}
					}
					data[x].due_date_format = this.moment(data[x].due_date).format('DD MMM YYYY')
				}
				await this.setState({data_arr : data})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	async changeTab(index){
		await this.get_invoice(index === 0 ? '' : 'paid')
		await this.setState({selectedIndex : index})
	}

	async toPaymentDetail(index){
		this.props.navigation.navigate("PaymentDetail", {
			id : this.state.data_arr[index].id
		})
	}


	render() {
		const {
			tab_arr,
			selectedIndex,
			data_arr
		} = this.state
		return (
            <View style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>
				<SegmentedControl
				values={tab_arr}
				selectedIndex={selectedIndex}
				onChange={(event)=>this.changeTab(event.nativeEvent.selectedSegmentIndex)}
				tintColor={'white'}
				activeFontStyle={{color : Style.colors.black70p_hex}}
				backgroundColor={Style.colors.black70p_hex}
				style={{borderRadius : 0, height : 16 * 2.5}}
				/>

				{
					selectedIndex === 0 ?
					<Invoice data_arr={data_arr} paymentDetail={(index)=>this.toPaymentDetail(index)} />
					: selectedIndex === 1 ?
					<PaidOff data_arr={data_arr} paymentDetail={(index)=>this.toPaymentDetail(index)} />
					:<></>
				}
			</View>		
		);
	}
}