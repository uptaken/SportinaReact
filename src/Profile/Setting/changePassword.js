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
import InputPassword from '../../Components/inputPassword'

import Button from '../../Components/Button'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class ChangePassword extends Base {
    inputs = {}
	state = {
        token : '',
        optionsAxios : {
			timeout: this.axiosTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
        change_pass_arr : [
            {type : 'old_pass', is_show : false, title : 'Old Password', value : ''},
            {type : 'new_pass', is_show : false, title : 'New Password', value : ''},
            {type : 'retype_pass', is_show : false, title : 'Re-Type New Password', value : ''},
        ],
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
        var token = await AsyncStorage.getItem('token')
		var optionsAxios = this.state.optionsAxios
		optionsAxios.headers['Authorization'] = token
        await this.setState({token : token, optionsAxios : optionsAxios})
    }
    
    async showPass(index){
        var change_pass_arr = this.state.change_pass_arr
        change_pass_arr[index].is_show = !change_pass_arr[index].is_show

        await this.setState({change_pass_arr : change_pass_arr})
    }

    async changeInput(value, index){
        var change_pass_arr = this.state.change_pass_arr
        change_pass_arr[index].value = value

        await this.setState({change_pass_arr : change_pass_arr})
    }

    async savePassword(){
        var change_pass_arr = this.state.change_pass_arr
        var empty_value = true, empty_value_message = ''
        var new_pass = '', retype_pass = ''
        for(var x in change_pass_arr){
            if(change_pass_arr[x].value == ''){
                empty_value = true
                empty_value_message = change_pass_arr[x].title + ' is empty'
                break;
            }
            else{
                empty_value = false
            }

            if(change_pass_arr[x].type == 'new_pass'){
                new_pass = change_pass_arr[x].value
            }
            if(change_pass_arr[x].type == 'retype_pass'){
                retype_pass = change_pass_arr[x].value
            }
        }

        if(empty_value){
            console.log(empty_value_message)
        }
        else if(new_pass != retype_pass){
            console.log('Password not match')
        }
        else{
            try {
                var dataPost = {}
                dataPost.password = new_pass
                
                var response = await this.axios.put(this.url + '/auth/change-password', dataPost, this.state.optionsAxios);
            
                if (response.data.status == 'success') {
                    this.alertSnackbar('Password Berhasil diperbarui')
                    this.props.route.params.onData()
                    this.props.navigation.goBack()
                }
    
            } catch (e) {
                this.alertSnackbar(e.message)
            }
        }
    }

    async inputNext(index){
        if(index+1 == this.state.change_pass_arr.length){
            this.savePassword()
        }
        else{
            this.inputs[this.state.change_pass_arr[index+1].type].focus()
        }
    }

	render() {
		return (
            <View style={{backgroundColor : Style.colors.bgBase, flex : 1}}>
            
                <ProfileHead title={'Change Password'} />

                <View style={{padding : 16, flex : 1}}>
                    <ScrollView>

                        {
                            this.state.change_pass_arr.map((data, index)=>(
                                <View style={{marginTop : index == 0 ? 0 : 8}} key={index}>
                                    <Text>{data.title}</Text>
                                    <View style={{marginTop : 4}}>
                                    <InputPassword
                                        passwordData={data}
                                        changeInput={(value)=>this.changeInput(value, index)}
                                        showPass={()=>this.showPass(index)}
                                        onRef={ref => {this.inputs[data.type] = ref}}
                                        returnKeyType={(index+1 == this.state.change_pass_arr.length) ? 'done' : 'next'}
                                        onSubmitEditing={() => this.inputNext(index)} />
                                    </View>
                                </View>
                            ))
                        }

                    </ScrollView>

                    <View style={{marginTop : 24}}>
                        <Button title={'Save'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.savePassword()} />
                    </View>
                </View>

            </View>			
		);
	}
}