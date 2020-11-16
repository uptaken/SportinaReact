import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableHighlight,
	TouchableWithoutFeedback,
	Button,
	FlatList,
	AsyncStorage,
	BackHandler,
	Modal,
	Alert,
	Linking
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'
import SwiperFlatList from 'react-native-swiper-flatlist'

import SearchCompetition from '../Components/SearchCompetition'
import ListCompetition from '../Components/ListCompetition'
import NoDataFound from '../Components/NoData'

import DeviceInfo from 'react-native-device-info'

export default class Schedule extends Base {
	state = {
		token : '',
		optionsAxios : {
			timeout: this.axiosTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		data_arr : [],
		banner_arr : [
			{id : 1}, {id : 2}, {id : 3},
		],
		search : '',
		is_modal_loading : false,
	};

	async componentDidMount() {
		var token = await AsyncStorage.getItem('token')
		var optionsAxios = this.state.optionsAxios
		optionsAxios.headers['Authorization'] = token
		await this.setState({token : token, optionsAxios : optionsAxios})
		if(token == null){
			this.props.navigation.navigate("Auth", {screen : 'Login'})
		}
		else{
			await this.get_auth()
			await this.get_app_version()
		}
	}

	async get_app_version(){
		try {
			var response = await this.axios.get(this.url + '/app-version/check?version=' + DeviceInfo.getVersion(), this.state.optionsAxios);
			
			if (response.data.need_update) {
				Alert.alert(
					'Peringatan',
					'Maaf, anda perlu melakukan pembaruan versi aplikasi. Terima Kasih',
					[
					  {
						text: 'OK',
						onPress: () => this.toPlayStore()
					  },
					],
					{cancelable: false},
				);
				await AsyncStorage.clear()
				await this.setState({token: null})
			}
			else{
				await this.get_data()
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	async toPlayStore(){
		Linking.openURL('https://play.google.com/store/apps/details?id=com.sport.ina')
	}

	async get_auth(){
		try {
			var response = await this.axios.get(this.url + '/auth/profile', this.state.optionsAxios);
		
			if (response.data.status !== 'success') {
				await AsyncStorage.clear()
				await this.setState({token: null})
				this.props.navigation.navigate("Auth", {screen : 'Login'})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	async get_data(){
		try {
			console.log(this.state.search)
			await this.setState({is_modal_loading : true})
			var url = this.url + '/competition?id=&type=mobile'
			if(this.state.search !== ''){
				url += '&search=' + this.state.search
			}

			var response = await this.axios.get(url, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				var data = response.data.data.data

				for(var x in data){
					data[x].dateCompetition = this.moment(data[x].start_date).format('DD MMM YYYY')
					data[x].placeCompetition = data[x].city.name
					data[x].image_display = this.no_image

					if(data[x].file_name != null){
						data[x].image_display = {uri : this.url_image + '/competition?file_name=' + data[x].file_name + '&random=' + new Date().getTime()}
					}
				}

				await this.setState({is_modal_loading : false})
				await this.setState({data_arr : data})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	async changeInput(value){
		await this.setState({search : value})
	}

	async toDetail(index){
		this.props.navigation.navigate('CompetitionDetail', {id : this.state.data_arr[index].id})
	}

	async searchCompetitionBtn(){
		await this.get_data()
	}

	render() {
		const {
			data_arr,
			is_modal_loading
		} = this.state
		return (
            <View style={{flex : 1}}>

				{/* <Image
					source={this.hotel_1}
					style={{height : 'auto', width : '100%', resizeMode : 'cover', aspectRatio : 360/195}}
					/> */}

				<View style={{padding : 16, backgroundColor : Style.colors.bgBase}}>
					<SearchCompetition ChangeInput={(value)=>this.changeInput(value)} searchBtn={()=>this.searchCompetitionBtn()} />
				</View>

				<FlatList
					data={data_arr}
					renderItem={({item, index}) => (
						<View style={{flex : 1/2, paddingLeft : index % 2 == 0 ? 0 : 4, paddingRight : index % 2 == 0 ? 4 : 0, marginBottom : 8, paddingBottom : index+1 == data_arr.length ? 20 : 0 }} key={index}>
							<ListCompetition key={index} onPressList={()=>this.toDetail(index)} data={item} />
						</View>
					)}
					keyExtractor={(item, index) => index}
					scrollEnabled={true}
					ListEmptyComponent={()=>(
						<NoDataFound />
					)}
					numColumns={2}
					style={{padding : 16, marginBottom : 8}}
					/>

				<Modal
					transparent={true}
					visible={is_modal_loading}
					animationType="fade">
					<View style={{backgroundColor : '#000000B3', flex : 1, justifyContent : 'center'}}>
						<View style={{margin : 16 * 1.5, backgroundColor : 'white', radius : 4, padding : 16}}>
							<View>
								<Text style={{fontWeight : 'bold', fontSize : 16}}>Harap Tunggu...</Text>
							</View>
						</View>
					</View>
				</Modal>

			</View>
		);
	}
}