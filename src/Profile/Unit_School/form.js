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
	Button,
	AsyncStorage
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import ProfileHead from '../../Components/HeadTitle'

import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class FormUnitSchool extends Base {
	state = {
		token : '',
		optionsAxios : {
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		data_unit : {
			id : '',
			name : '', address : '',
			country : {id : ''}, province : {id : ''},
			city : {province : {id : ''}, id : ''},
		},
		country_arr : [],
		province_arr : [],
		city_arr : [],
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
		var token = await AsyncStorage.getItem('token')
		var optionsAxios = this.state.optionsAxios
		optionsAxios.headers['Authorization'] = token
		await this.setState({token : token, optionsAxios : optionsAxios})

		await this.get_place('country', '')

		if(this.props.route.params.id != null){
			await this.get_data()
		}

	}

	async get_data(){
		try {
			var response = await this.axios.get(this.url + '/unit?id=' + this.props.route.params.id, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				var data = response.data.data
				data.country = data.city.province.country
				data.province = data.city.province

				await this.get_place('province', data.country.id)
				await this.get_place('city', data.province.id)
				
				await this.setState({data_unit : data})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	async get_place(type, id){
        try {
            var url = this.url + '/'

            if(type == 'country'){
                url += type + '/all'
            }
            else if(type == 'province'){
                url += type + '?country_id=' + id
            }
            else if(type == 'city'){
                url += type + '?province_id=' + id
            }
            
            var response = await this.axios.get(url, this.state.optionsAxios);

            if(response.data.status === 'success'){
				var data = response.data.data
                if(type == 'country'){
                    await this.setState({country_arr : data})
                }
                else if(type == 'province'){
                    await this.setState({province_arr : data.data})
                }
                else if(type == 'city'){
                    await this.setState({city_arr : data.data})
                }
            }
        } 
        catch (e) {
            await this.alertSnackbar(e.message)
        }
    }

	async ChangeInput(value, type){
		var data_unit = this.state.data_unit
		data_unit[type] = value
		if(type === 'country'){
			data_unit[type] = {id : value}
            await this.get_place('province', value)
            data_unit.province = {id : ''}
            data_unit.city = {id : ''}
        }
        else if(type === 'province'){
			data_unit[type] = {id : value}
            await this.get_place('city', value)
            data_unit.city = {id : ''}
		}
		else if(type === 'city'){
			data_unit[type] = {id : value}
        }
        await this.setState({data_unit : data_unit})
	}

	async actionBtn(type){
		if(type === 'save'){
			var data = this.state.data_unit
			if(data.name === ''){
				await this.alertSnackbar('Nama tidak boleh kosong')
			}
			else if(data.country.id === ''){
				await this.alertSnackbar('Negara tidak boleh kosong')
			}
			else if(data.province.id === ''){
				await this.alertSnackbar('Provinsi tidak boleh kosong')
			}
			else if(data.city.id === ''){
				await this.alertSnackbar('Kota tidak boleh kosong')
			}
			else if(data.address === ''){
				await this.alertSnackbar('Alamat tidak boleh kosong')
			}
			else{
				try {	
					var response = ''
					var url = this.url + '/unit'
					var message = ''

					if(data.id === ''){
						response = await this.axios.post(url, data, this.state.optionsAxios);
						message = 'Unit/School Berhasil ditambahkan'
					}
					else if(data.id !== ''){
						response = await this.axios.put(url, data, this.state.optionsAxios);
						message = 'Unit/School Berhasil diperbarui'
					}
				
					if (response.data.status == 'success') {
						this.alertSnackbar(message)
						this.props.route.params.onData()
						this.props.navigation.goBack()
					}
		
				} catch (e) {
					this.alertSnackbar(e.message)
				}
			}
		}
	}


	render() {
		const {
			country_arr,
			province_arr,
			city_arr,
			data_unit,
		} = this.state
		return (
            <View style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>

				<ProfileHead title={'Add Unit / School'} />

                <ScrollView>
                <View style={{padding : 16}}>
					<View>
						<Text>Name Unit / School</Text>
						<TextInput
							value={data_unit.name}
							onChangeText={text => this.ChangeInput(text, 'name')}
							style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
							placeholder={'Name Unit / School'}
							returnKeyType={"next"}
							editable={true}
							ref={(input) => { this.name = input }}
							onSubmitEditing={() => null } />
					</View>

					<View style={{marginTop : 8}}>
						<Text>Country</Text>
							<View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
								<Picker
									selectedValue={data_unit.country.id}
									onValueChange={(itemValue, itemIndex) =>
										this.ChangeInput(itemValue, 'country')
									}>
									<Picker.Item label={'Pilih Negara'} value={''} />
									{
										country_arr.map((data, index)=>(
										<Picker.Item label={data.name} value={data.id} key={index} />
										))
									}
								</Picker>
							</View>
					</View>
					<View style={{marginTop : 8}}>
						<Text>Province</Text>
							<View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
								<Picker
									selectedValue={data_unit.province.id}
									onValueChange={(itemValue, itemIndex) =>
										this.ChangeInput(itemValue, 'province')
									}>
									<Picker.Item label={'Pilih Provinsi'} value={''} />
									{
										province_arr.map((data, index)=>(
										<Picker.Item label={data.name} value={data.id} key={index} />
										))
									}
								</Picker>
							</View>
					</View>
					<View style={{marginTop : 8}}>
						<Text>City</Text>
							<View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
								<Picker
									selectedValue={data_unit.city.id}
									onValueChange={(itemValue, itemIndex) =>
										this.ChangeInput(itemValue, 'city')
									}>
									<Picker.Item label={'Pilih Kota'} value={''} />
									{
										city_arr.map((data, index)=>(
										<Picker.Item label={data.name} value={data.id} key={index} />
										))
									}
								</Picker>
							</View>
					</View>
					
					<View style={{marginTop : 8}}>
						<Text>Address</Text>
						<TextInput
							value={data_unit.address}
							onChangeText={text => this.ChangeInput(text, 'address')}
							style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
							placeholder={'Address'}
							returnKeyType={"done"}
							editable={true}
							ref={(input) => { this.address = input }}
							multiline={true} />
					</View>

					<View style={{marginTop : 16}}>
						<View>
							<TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('white', false)} onPress={()=>this.actionBtn('save')}>
								<View style={{backgroundColor : Style.colors.colorPrimary, padding : 12, alignItems : 'center', borderRadius : 4}}>
									<Text style={{color : 'white', textTransform: 'uppercase'}}>Save</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{marginTop : 8}}>
							<TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('white', false)} onPress={()=>this.actionBtn('cancel')}>
								<View style={{backgroundColor : '#cc0000ff', padding : 12, alignItems : 'center', borderRadius : 4}}>
									<Text style={{color : 'white', textTransform: 'uppercase'}}>Cancel</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
					
                </View>
				</ScrollView>

            </View>			
		);
	}
}