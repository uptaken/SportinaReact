import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	Alert,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons';

import Button from '../Components/Button'

export default class ForgetPassword extends Base {
	state = {
		email : '',
		optionsAxios : {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
		},
		is_disabled : false,
	};

	static navigationOptions = {
			header: null,
	};

	async componentDidMount() {
	}

	async ChangeInput(value){
		await this.setState({email : value})
	}

	async authBtnAction(type){
		if(type == 'signin'){
			this.props.navigation.navigate("Login")
        }
        else{
            await this.resetPassword()
        }
    }
    
    async resetPassword(){
		var email = this.state.email
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		if(email === ''){
			await this.alertSnackbar('Email tidak boleh kosong')
		}
		else if(!email.match(mailformat)){
            await this.alertSnackbar('Format Email tidak sesuai')
		}
		else{
			try {
				await this.setState({is_disabled : true})
				var data = {email : this.state.email}
				var response = await this.axios.post(this.url + '/auth/forget-password', data, this.state.optionsAxios);
				
				if (response.data.status == 'success') {
					Alert.alert(
						'Berhasil',
						'Password baru telah dikirim ke email anda. Silahkan cek kotak masuk email.',
						[
						  {
							text: 'OK',
							onPress: () => this.authBtnAction('signin')
						  },
						],
						{cancelable: false},
					);
				}
				else{
					await this.setState({is_disabled : false})
					Alert.alert(
						'Peringatan',
						response.data.message,
						[
						  {
							text: 'OK',
						  },
						],
						{cancelable: false},
					);
				}
    
            } catch (e) {
				await this.alertSnackbar(e.message)
				await this.setState({is_disabled : false})
            }
		}
	}

	render() {
		const {
			is_disabled
		} = this.state
		return (

			<KeyboardAvoidingView style={{backgroundColor : '#FBC006', flex : 1}}>
				<ScrollView style={{padding : 16,  flex : 1}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>

					<View style={{alignItems : "center"}}>
						<Image source={this.logo} style={{width : 350, height : 80, resizeMode : "contain"}} />
					</View>

					<View style={{marginTop : 16}}>
						<TextInput 
							value={this.state.email}
							style={{padding : 8, backgroundColor : 'white', borderRadius : 4}} 
							placeholder={'Email'}
							returnKeyType={"done"}
							editable={true}
							onChangeText={text => this.ChangeInput(text)}
							ref={(input) => { this.email = input }}
							keyboardType={'email-address'} />
					</View>

					<View style={{marginTop : 16}}>
						<Button color={Style.colors.black70p_hex} title={'Send Reset Link'} actionBtnPress={()=>this.authBtnAction('resetPass')} is_disabled={is_disabled} />
					</View>
					<View style={{marginTop : 8, alignItems : 'center'}}>
						<Text style={{color : 'white', fontSize : 16}}>Remember the Password? <Text style={{textDecorationLine : 'underline', fontWeight : 'bold'}} onPress={()=>this.authBtnAction('signin')}>Sign in</Text></Text>
						{/* <Button color={Style.colors.colorPrimary} title={'Remember the Password? Sign in'} actionBtnPress={()=>this.authBtnAction('signin')} /> */}
					</View>

				</ScrollView>
			</KeyboardAvoidingView>

		);
	}
}