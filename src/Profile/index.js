import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TouchableHighlight,
	Button,
	AsyncStorage,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'
import NoDataFound from '../Components/NoData'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class Profile extends Base {
	state = {
		token : '',
		optionsAxios : {
			timeout: this.axiosTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		auth_data : {
			name : '', phone : '', email : '',
			city : {province : {name : ''}, name : ''},
		},
		profile_menu : [
			{title : 'Unit / School', icon : 'add', nav : 'FormUnitSchool'},
			{title : 'Settings', icon : 'settings', nav : 'ProfileSetting'}
		],
		unit_school_arr : []
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
		var token = await AsyncStorage.getItem('token')
		var optionsAxios = this.state.optionsAxios
		optionsAxios.headers['Authorization'] = token
		await this.setState({token : token, optionsAxios : optionsAxios})
		
		await this.get_auth()
	}

	async get_auth(){
		try {
			var response = await this.axios.get(this.url + '/auth/profile', this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				var data = response.data.data
				data.image_display = this.no_profile_picture
				if(data.file_name != null){
					data.image_display = {
						uri : this.url_image + '/team?file_name=' + data.file_name 
						+ '&random=' + new Date().getTime()
					}
				}

				await this.setState({auth_data : data, unit_school_arr : data.unit})
			}
			else{
				await AsyncStorage.clear()
				await this.setState({token: null})
				this.props.navigation.navigate("Auth", {screen : 'Login'})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	async menuSelected(index){
		this.props.navigation.navigate(
			this.state.profile_menu[index].nav,
			{onData : () => this.onGetData(), id : ''}
		)
	}

	async onGetData(){
		await this.get_auth()
	}

	async editUnitSchool(index){
		this.props.navigation.navigate('FormUnitSchool', {id : this.state.unit_school_arr[index].id, onData : ()=>this.onGetData()})
	}


	render() {
		const {auth_data} = this.state
		return (
            <View style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>

				<View style={{backgroundColor : Style.colors.colorPrimary, padding : 16}}>
					<View style={{flexDirection : 'row'}}>

						<View style={{justifyContent : 'space-between'}}>
							<Image style={{width : 96, height : 96, borderRadius : 96/2}} source={auth_data.image_display} />
						</View>
						<View style={{flex : 1, marginLeft : 16}}>
							<Text style={{textTransform : 'capitalize'}}>{auth_data.name}</Text>
							<Text style={{textTransform : 'capitalize'}}>{auth_data.city.name} - {auth_data.city.province.name}</Text>

							<View style={{marginTop : 8}}>
								<Text style={{textTransform : 'capitalize'}}>{auth_data.head_coach}</Text>
								<Text>{auth_data.phone}</Text>
								<Text>{auth_data.email}</Text>
							</View>
						</View>

					</View>
				</View>

				<View style={{flexDirection : 'row'}}>
					{
						this.state.profile_menu.map((data, index)=>(
							<TouchableHighlight style={{flex : 1}} onPress={()=>this.menuSelected(index)} key={index} underlayColor={'transparent'}>
								<View style={{backgroundColor : Style.colors.black70p_hex, padding : 16, alignItems : 'center'}} key={index}>
									<View style={{flexDirection : 'row'}}>
										<View style={{justifyContent : 'center'}}>
											<Icon name={data.icon} size={24} color={'white'} />
										</View>
										<View style={{justifyContent : 'center', marginLeft : 8}}>
											<Text style={{color : 'white'}}>{data.title}</Text>
										</View>
									</View>
								</View>
							</TouchableHighlight>
						))
					}
				</View>

				<View style={{padding : 16}}>
					
					{
						this.state.unit_school_arr.map((data, index)=>(
							<View style={{marginBottom : 8}} key={index}>
							<TouchableHighlight underlayColor={'white'} activeOpacity={0.6} onPress={()=>this.editUnitSchool(index)}>
								<View style={{padding : 16, backgroundColor : Style.colors.gray_ea, borderRadius : 4}}>
									<Text style={{textTransform : 'capitalize'}}>{data.name}</Text>

									<Text style={{marginTop : 8, textTransform : 'capitalize'}}>Alamat : {data.address}</Text>
									<Text>{data.city.name} - {data.city.province.name}</Text>
								</View>
							</TouchableHighlight>
							</View>
						))
					}

					{
						this.state.unit_school_arr.length == 0 ?
						<NoDataFound /> 
						: <></>
					}
				</View>

            </View>			
		);
	}
}