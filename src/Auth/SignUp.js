import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
    AsyncStorage,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-community/picker';

import Button from '../Components/Button'
import InputPassword from '../Components/inputPassword'

export default class SignUp extends Base {
	state = {
        signup_data : {
            password : {type : 'password', is_show : false, title : 'Password', value : ''},
            confirm_password : {type : 'confirm_password', is_show : false, title : 'Konfirmasi Password', value : ''},
            country : {id : ''},
            province : {id : ''},
            city : {id : ''},
            name : '',
            head_coach : '',
            phone : '',
            email : '',
        },
        optionsAxios : {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        },
        country_arr : [],
        province_arr : [],
        city_arr : [],
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
        await this.get_place('country', '')
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
        console.log(value)
        var signup_data = this.state.signup_data

        if(type === 'country'){
            signup_data[type] = {id : value}
            await this.setState({province_arr : [], city_arr : []})
            if(value != ''){
                await this.get_place('province', value)
            }
            signup_data.province = {id : ''}
            signup_data.city = {id : ''}
        }
        else if(type === 'province'){
            signup_data[type] = {id : value}
            await this.setState({city_arr : []})
            if(value != ''){
                await this.get_place('city', value)
            }
            signup_data.city = {id : ''}
        }
        else if(type === 'city'){
            signup_data[type] = {id : value}
        }
        else if(type !== 'password' && type !== 'confirm_password'){
            signup_data[type] = value
        }
        else{
            signup_data[type].value = value
        }
		await this.setState({signup_data : signup_data})
	}

	async authBtnAction(){
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        var data = this.state.signup_data

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
        else if(data.email === ''){
            await this.alertSnackbar('Email tidak boleh kosong')
            this.email.focus()
        }
        else if(!data.email.match(mailformat)){
            await this.alertSnackbar('Format Email tidak sesuai')
            this.email.focus()
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
        else if(data.password.value === ''){
            await this.alertSnackbar('Password tidak boleh kosong')
            this.password.focus()
        }
        else if(data.confirm_password.value === ''){
            await this.alertSnackbar('Konfirmasi Password tidak boleh kosong')
            this.confirm_password.focus()
        }
        else if(data.password.value != data.confirm_password.value){
            await this.alertSnackbar('Konfirmasi Password tidak cocok dengan Password')
        }
        else{
            try {
                var dataPost = JSON.stringify(data)
                dataPost = dataPost = JSON.parse(dataPost)
                dataPost.password = dataPost.password.value

                var response = await this.axios.post(this.url + '/auth/register', dataPost, this.state.optionsAxios);
            
                if (response.data.status == 'success') {
                    await AsyncStorage.setItem('token', response.data.token)
                    this.props.navigation.navigate('Index')
                }
    
            } catch (e) {
                this.alertSnackbar(e.message)
            }
        }


    }
    
    async showPass(type){
        var signup_data = this.state.signup_data
		signup_data[type]['is_show'] = !signup_data[type]['is_show']
		await this.setState({signup_data : signup_data})
	}

	render() {
        const {country_arr, province_arr, city_arr, signup_data} = this.state
		return (

			<KeyboardAvoidingView style={{backgroundColor : Style.colors.bgBase, flex : 1}}>
				<ScrollView>

                    <View style={{padding : 16}}>

                        <View style={{marginTop : 16}}>
                            <Text>Name of Club</Text>
                            <TextInput 
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
                                style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 8}} 
                                placeholder={'Email'}
                                returnKeyType={"next"}
                                editable={true}
                                onChangeText={text => this.ChangeInput(text, 'email')}
                                ref={(input) => { this.email = input }}
                                keyboardType={'email-address'} />
                        </View>
                        <View style={{marginTop : 8}}>
                            <Text>Country</Text>
                            <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                                <Picker
                                    selectedValue={signup_data.country.id}
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
                                    selectedValue={signup_data.province.id}
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
                                    selectedValue={signup_data.city.id}
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
                            <Text>Password</Text>
                            <View style={{marginTop : 8}}>
                                <InputPassword 
                                    passwordData={this.state.signup_data.password}
                                    changeInput={(value)=>this.ChangeInput(value, 'password')}
                                    showPass={()=>this.showPass('password')}
                                    onRef={(input) => { this.password = input }} />
                            </View>
                        </View>
                        <View style={{marginTop : 8}}>
                            <Text>Confirm Password</Text>
                            <View style={{marginTop : 8}}>
                                <InputPassword
                                    passwordData={this.state.signup_data.confirm_password}
                                    changeInput={(value)=>this.ChangeInput(value, 'confirm_password')}
                                    showPass={()=>this.showPass('confirm_password')}
                                    onRef={(input) => { this.confirm_password = input }} />
                            </View>
                        </View>


                    </View>

				</ScrollView>
                <View style={{margin : 16}}>
                    <Button color={Style.colors.colorPrimary} title={'Sign Up'} actionBtnPress={()=>this.authBtnAction()} />
                </View>
			</KeyboardAvoidingView>

		);
	}
}