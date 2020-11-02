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
    AsyncStorage
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import ProfileHead from '../../Components/HeadTitle'

import Button from '../../Components/Button'

import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-picker';

export default class ChangeProfile extends Base {
    inputs = {}
	state = {
        token : '',
        optionsAxios : {
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		auth_data : {
			name : '', head_coach : '', phone : '', email : '', address : '',
            country : {id : ''}, province : {id : ''},
            city : {province : {id : ''}, id : ''},
            image : {
                image_display : '',
                image : '',
                original_rotation : 0,
                type : 'old'
            }
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
		await this.get_auth()
    }

    async get_auth(){
		try {
			var response = await this.axios.get(this.url + '/auth/profile', this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				var data = response.data.data
                data.image = {
                    image_display : this.no_profile_picture,
                    image : '',
                    original_rotation : 0,
                    type : 'old'
                }


				if(data.file_name != null){
                    data.image = {
                        image_display : {
                            uri : this.url_image + '/team?file_name=' + data.file_name 
                            + '&random=' + new Date().getTime()
                        },
                        image : '',
                        original_rotation : 0,
                        type : 'old'
                    }
                }
                data.province = data.city.province
                data.country = data.city.province.country

                await this.get_place('province', data.country.id)
                await this.get_place('city', data.province.id)

				await this.setState({auth_data : data})
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
        var auth_data = this.state.auth_data

        auth_data[type] = value
        if(type === 'country'){
            auth_data[type] = {id : value}
            await this.get_place('province', value)
            auth_data.province = {id : ''}
            auth_data.city = {id : ''}
        }
        else if(type === 'province'){
            auth_data[type] = {id : value}
            await this.get_place('city', value)
            auth_data.city = {id : ''}
        }
        else if(type === 'city'){
            auth_data[type] = {id : value}
        }
        await this.setState({auth_data : auth_data})
    }

    async selectImage(){
        ImagePicker.showImagePicker(async response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              var auth_data = this.state.auth_data;
              auth_data.image = {
                image_display : {uri: response.uri},
                image : response.data,
                original_rotation : 0,
                type : 'new'
            }
      
              await this.setState({auth_data : auth_data})
            }
        });
    }

    async saveBtn(){
        var data = this.state.auth_data

        if(data.name === ''){
            await this.alertSnackbar('Nama tidak boleh kosong')
            this.name.focus()
        }
        else if(data.head_coach === ''){
            await this.alertSnackbar('Nama Head Coach tidak boleh kosong')
            this.name_coach.focus()
        }
        else if(data.phone === ''){
            await this.alertSnackbar('No. Telpon tidak boleh kosong')
            this.phone.focus()
        }
        else if(isNaN(data.phone)){
            await this.alertSnackbar('No. Telpon tidak boleh mengandung huruf')
            this.phone.focus()
        }
        else if(data.address === ''){
            await this.alertSnackbar('Alamat tidak boleh kosong')
            this.address.focus()
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
        else{
            try {
                var dataPost = JSON.stringify(data)
                dataPost = dataPost = JSON.parse(dataPost)

                var response = await this.axios.put(this.url + '/auth/change-profile', dataPost, this.state.optionsAxios);
            
                if (response.data.status == 'success') {
                    if(dataPost.image.type === 'new'){
                        await this.changeProfilePicture()
                    }
                    else{
                        this.alertSnackbar('Profil Berhasil diperbarui')
                        this.props.route.params.onData()
                        this.props.navigation.goBack()
                    }
                }
    
            } catch (e) {
                this.alertSnackbar(e.message)
            }
        }
    }

    async changeProfilePicture(){
        var data = this.state.auth_data
        try {
            var dataPost = {}
            dataPost.image = data.image
            
            var response = await this.axios.put(this.url + '/auth/change-profile-picture', dataPost, this.state.optionsAxios);
        
            if (response.data.status == 'success') {
                this.alertSnackbar('Profil Berhasil diperbarui')
                this.props.route.params.onData()
                this.props.navigation.goBack()
            }

        } catch (e) {
            this.alertSnackbar(e.message)
        }
    }

	render() {
        const {
            auth_data,
            country_arr, province_arr, city_arr
        } = this.state
		return (
            <View style={{backgroundColor : Style.colors.bgBase, flex : 1}}>
            
                <ProfileHead title={'Change Profile'} />

                <View style={{flex : 1}}>
                    <ScrollView>
                        <View style={{alignItems : 'center', padding : 16}}>
                            <TouchableHighlight onPress={()=>this.selectImage()} style={{borderRadius : 120/2}}>
                                <Image style={{width : 120, height : 120, borderRadius : 120/2}} source={auth_data.image.image_display} />
                            </TouchableHighlight>
                        </View>
                        <View style={{padding : 16}}>

                            <View style={{marginTop : 16}}>
                                <Text>Name of Club</Text>
                                <TextInput 
                                    value={auth_data.name}
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                    placeholder={'Name of Club'}
                                    returnKeyType={"next"}
                                    editable={true}
                                    onChangeText={text => this.ChangeInput(text, 'name')}
                                    ref={(input) => { this.name = input }}
                                    onSubmitEditing={() => { this.name_coach.focus() }} />
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>Name of Head of Coach</Text>
                                <TextInput 
                                    value={auth_data.head_coach}
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                    placeholder={'Name of Head of Coach'}
                                    returnKeyType={"next"}
                                    editable={true}
                                    onChangeText={text => this.ChangeInput(text, 'head_coach')}
                                    ref={(input) => { this.name_coach = input }}
                                    onSubmitEditing={() => { this.phone.focus() }} />
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>No. Phone</Text>
                                <TextInput
                                    value={auth_data.phone}
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                    placeholder={'No. Phone'}
                                    returnKeyType={"next"}
                                    editable={true}
                                    onChangeText={text => this.ChangeInput(text, 'phone')}
                                    ref={(input) => { this.phone = input }}
                                    onSubmitEditing={() => { this.email.focus() }}
                                    keyboardType={'phone-pad'} />
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>Email</Text>
                                <TextInput
                                    value={auth_data.email}
                                    style={{padding : 8, backgroundColor : Style.colors.gray_ea, borderRadius : 4, marginTop : 8, color : 'black'}} 
                                    placeholder={'Email'}
                                    returnKeyType={"next"}
                                    editable={false}
                                    onChangeText={text => this.ChangeInput(text, 'email')}
                                    ref={(input) => { this.email = input }}
                                    onSubmitEditing={() => { this.email.focus() }}
                                    keyboardType={'email-address'} />
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>Address</Text>
                                <TextInput
                                    value={auth_data.address}
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                    placeholder={'Address'}
                                    returnKeyType={"next"}
                                    editable={true}
                                    onChangeText={text => this.ChangeInput(text, 'address')}
                                    ref={(input) => { this.address = input }}
                                    onSubmitEditing={() => { this.name_coach.focus() }} />
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>Country</Text>
                                <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                                    <Picker
                                        selectedValue={auth_data.country.id}
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
                                        selectedValue={auth_data.province.id}
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
                                        selectedValue={auth_data.city.id}
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
                            
                            
                        </View>
                    </ScrollView>

                    <View style={{padding : 16}}>
                        <Button title={'Save'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.saveBtn()} />
                    </View>
                </View>

            </View>			
		);
	}
}