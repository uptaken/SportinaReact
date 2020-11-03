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
	AsyncStorage,
	BackHandler
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackActions} from '@react-navigation/native'

import Button from '../Components/Button'
import InputPassword from '../Components/inputPassword'

export default class Login extends Base {
	state = {
		login_data : {email : '', password : {type : 'password', is_show : false, title : 'Password', value : ''}},
		optionsAxios : {
            timeout: this.axiosTimeout,
            headers: {
                'Content-Type': 'application/json',
            },
        },
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {	
		BackHandler.addEventListener('hardwareBackPress', async () => {
			await this.handleBackButton()
		})
	}

	async handleBackButton(){
		BackHandler.exitApp()
	}

	async componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', async () => {
			await this.handleBackButton()
		})
	}

	async ChangeInput(value, type){
		var login_data = this.state.login_data
		if(type == 'password'){
			login_data[type].value = value
		}
		else{
			login_data[type] = value
		}
		await this.setState({login_data : login_data})
	}

	async authBtnAction(type){
		BackHandler.removeEventListener('hardwareBackPress', async () => {
			await this.handleBackButton()
		})
		if(type == 'signup'){
			this.props.navigation.navigate("SignUp")
		}
		else if(type == 'forget_pass'){
			this.props.navigation.navigate("ForgetPassword")
		}
		else if(type == 'login'){
			await this.login()
		}

	}

	async showPass(){
		var login_data = this.state.login_data
		login_data.password['is_show'] = !login_data.password['is_show']
		await this.setState({login_data : login_data})
	}

	async login(){
		var data = this.state.login_data
		try {
			var dataPost = JSON.stringify(data)
			dataPost = dataPost = JSON.parse(dataPost)
			dataPost.password = dataPost.password.value

			var response = await this.axios.post(this.url + '/auth/login', dataPost, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				BackHandler.removeEventListener('hardwareBackPress', async () => {
					await this.handleBackButton()
				})

				await AsyncStorage.setItem('token', response.data.token)
				// this.props.navigation.navigate('Index')
				this.props.navigation.dispatch(StackActions.replace('Index'));
			}
			else{
				this.alertSnackbar(response.data.message)	
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

	render() {
		return (

			<KeyboardAvoidingView style={{backgroundColor : '#FBC006', flex : 1}}>
				<ScrollView style={{padding : 16,  flex : 1}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>

					<View style={{alignItems : "center"}}>
						<Image source={this.logo} style={{width : 350, height : 80, resizeMode : "contain"}} />
					</View>

					<View style={{marginTop : 16}}>
						<TextInput 
							style={{padding : 8, backgroundColor : 'white', borderRadius : 4}} 
							placeholder={'Email'}
							returnKeyType={"next"}
							editable={true}
							onChangeText={text => this.ChangeInput(text, 'email')}
							ref={(input) => { this.email = input }}
							onSubmitEditing={() => { this.password.focus() }}
							keyboardType={'email-address'} />
					</View>
					<View style={{marginTop : 8}}>
						{/* <View style={{flexDirection : 'row', backgroundColor : 'white', borderRadius : 4}}>
							<TextInput 
								style={{padding : 8, flex : 1}} 
								placeholder={this.state.login_data.password.title}
								returnKeyType={"next"}
								editable={true}
								onChangeText={(value) => this.props.changeInput(value, 'password')}
								ref={(input) => { this.password = input }}
								secureTextEntry={!this.state.login_data.password.is_show} />
							<View style={{justifyContent : 'center', padding : 8}}>
								<TouchableHighlight onPress={()=>this.showPass()} style={{borderRadius : 50/2, padding : 4}} underlayColor={Style.colors.gray_ea}>
									<Icon name={this.state.login_data.password.is_show ? 'visibility' : 'visibility-off'} size={20} />
								</TouchableHighlight>
							</View>
						</View> */}
						
						<InputPassword
							passwordData={this.state.login_data.password}
							changeInput={(value)=>this.ChangeInput(value, 'password')}
							showPass={()=>this.showPass()}
							onRef={ref => {this.password = ref}}
							returnKeyType={'done'}
							onSubmitEditing={() => null } />
					</View>
					<View style={{alignItems : 'flex-end', marginTop : 8}}>
						<Button color={Style.colors.colorPrimary} title={'Forget Password?'} textColor={'black'} actionBtnPress={()=>this.authBtnAction('forget_pass')} />
					</View>

					<View style={{marginTop : 16}}>
						<Button color={Style.colors.black70p_hex} title={'Log In'} actionBtnPress={()=>this.authBtnAction('login')} />
					</View>
					<View style={{marginTop : 8}}>
						<Button color={Style.colors.colorPrimary} title={'Sign Up'} actionBtnPress={()=>this.authBtnAction('signup')} />
					</View>

				</ScrollView>
			</KeyboardAvoidingView>

		);
	}
}