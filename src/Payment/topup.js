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
    AsyncStorage
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'
import Button from '../Components/Button'

import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {Picker} from '@react-native-community/picker'
import ImagePicker from 'react-native-image-picker'

import SearchCompetition from '../Components/SearchCompetition'
import HeadTitle from '../Components/HeadTitle'

export default class Topup extends Base {
	state = {
        token : '',
        optionsAxios : {
            timeout: this.axiosTimeout,
            headers: {
            'Content-Type': 'application/json',
            },
        },
        competition_data : {id : '', name : ''},
        payment_info : [],
        bank_arr : [],
        payment_data : {bank : {id : ''}, account_number : '', amount : 0, image : {image : ''}},
        is_disabled : false,
    }

	async componentDidMount() {
        var token = await AsyncStorage.getItem('token')
        var competition_data = JSON.parse(this.props.route.params.competition_data)
        var optionsAxios = this.state.optionsAxios
        optionsAxios.headers['Authorization'] = token
        await this.setState({token : token, optionsAxios : optionsAxios, competition_data : competition_data})

        await this.get_bank_setting()
        await this.get_bank()
    }

    async get_bank(){
        try {            
            var response = await this.axios.get(this.url + '/bank', this.state.optionsAxios);
      
            if(response.data.status === 'success'){
                var data = response.data.data.data
                await this.setState({bank_arr : data})
            }
      
        } 
        catch (e) {
            await this.alertSnackbar(e.message)
        }
    }
    
    async get_bank_setting(){
        try {            
            var response = await this.axios.get(this.url + '/bank-setting', this.state.optionsAxios);
      
            if(response.data.status === 'success'){
                var data = response.data.data.data

                var payment_info = [
                    {title : 'Bank Name', value : data[0].bank.name},
                    {title : 'Bank Account', value : data[0].account_number},
                    {title : 'Bank Account Name', value : data[0].account_name},
                ]
                await this.setState({payment_info : payment_info})
            }
      
        } 
        catch (e) {
            await this.alertSnackbar(e.message)
        }
    }

	async toNext(){
        this.props.navigation.navigate('RegisterPayoutComplete')
    }
    
    async ChangeInput(value, type){
        var payment_data = this.state.payment_data
        payment_data[type] = value
        if (type === 'amount') {
            if (value != '') {
                payment_data[type] = parseFloat(value.replace(/,/g, '')).toLocaleString();
            }
        }
        await this.setState({payment_data : payment_data})
    }

    async chooseBukti(){
        ImagePicker.showImagePicker(async response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              var payment_data = this.state.payment_data;
              payment_data.image = {
                image_display : {uri: response.uri},
                image : response.data,
                original_rotation : 0,
                type : 'new'
            }
      
              await this.setState({payment_data : payment_data})
            }
        });
    }

    async submitPayment(){
        var data = this.state.payment_data
        if(data.account_number === ''){
            await this.alertSnackbar('Account Number tidak boleh kosong')
        }
        else if(data.amount === 0){
            await this.alertSnackbar('Amount tidak boleh kosong')
        }
        else if(data.bank.id === ''){
            await this.alertSnackbar('Bank tidak boleh kosong')
        }
        else if(data.image.image === ''){
            await this.alertSnackbar('Bukti Transfer tidak boleh kosong')
        }
        else{
            var dataClone = JSON.stringify(data)
            dataClone = JSON.parse(dataClone)
            dataClone.amount = dataClone.amount.replace(/,/g, '')

            var dataPost = dataClone
            dataPost.competition = {id : this.state.competition_data.id}
            dataPost.type = 'registration'
            console.log(JSON.stringify(dataPost))
            await this.setState({is_disabled : true})
            
            try {
                var response = await this.axios.post(this.url + '/e-cash/transaction', dataPost, this.state.optionsAxios);
          
                if(response.data.status === 'success'){
                    this.props.navigation.navigate('RegisterPayoutComplete', {
                        competition_data : JSON.stringify(this.state.competition_data),
                        navigateFrom : this.props.route.params.navigateFrom,
                    })
                }
                else{
                    await this.setState({is_disabled : false})
                }
          
            } 
            catch (e) {
                await this.setState({is_disabled : false})
                await this.alertSnackbar(e.message)
            }
        }
    }

	render() {
        const {
            payment_info,
            bank_arr,
            payment_data,
            is_disabled,
            competition_data
        } = this.state
		return (
            <View style={{flex : 1}}>

                <HeadTitle title={competition_data.name} subTitle={'TopUp'} />
                <ScrollView style={{backgroundColor : Style.colors.bgBase}}>
                    
                    <View style={{padding : 16}}>

                        <View>
                            <Text>Payment Method</Text>
                            <View style={{backgroundColor : 'white', padding : 16, marginTop : 8, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                                <Text style={{marginBottom : 8}}>Proceed all payment through Transferring to</Text>

                                {
                                    payment_info.map((data, index)=>(
                                        <Text style={{textTransform : 'capitalize'}} key={index} style={{marginBottom : 8}}>{data.value}</Text>
                                    ))
                                }

                                <Text>Please attach your club's name in the notes section of your payment confirmation</Text>
                            </View>
                        </View>

                        <View style={{marginTop : 16}}>
                            <View>
                                <Text>Bank</Text>
                                    <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                                        <Picker
                                            selectedValue={JSON.stringify(payment_data.bank)}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.ChangeInput(JSON.parse(itemValue), 'bank')
                                            }>
                                            <Picker.Item label={'Pilih Bank'} value={JSON.stringify({id : ''})} />
                                            {
                                                bank_arr.map((data, index)=>(
                                                <Picker.Item label={data.name} value={JSON.stringify(data)} key={index} />
                                                ))
                                            }
                                        </Picker>
                                    </View>
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>Account Number</Text>
                                <TextInput 
                                    value={payment_data.account_number}
                                    onChangeText={text => this.ChangeInput(text, 'account_number')}
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                                    placeholder={'Account Number'}
                                    returnKeyType={"next"}
                                    editable={true}
                                    ref={(input) => { this.account_number = input }}
                                    onSubmitEditing={() => { this.amount.focus() }} />
                            </View>
                            <View style={{marginTop : 8}}>
                                <Text>Amount to be Transfer</Text>
                                <TextInput
                                    value={payment_data.amount}
                                    onChangeText={text => this.ChangeInput(text, 'amount')}
                                    style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                                    placeholder={'Amount to be Transfer'}
                                    returnKeyType={"done"}
                                    editable={true}
                                    keyboardType={'numeric'}
                                    ref={(input) => { this.amount = input }} />
                            </View>

                            {
                                payment_data.image.image !== '' ?
                                <View style={{marginTop : 8, alignItems : 'center'}}>
                                    <Image source={payment_data.image.image_display} style={{height : 240, aspectRatio : 3/4}} />
                                </View>
                                :<></>
                            }
                        </View>

                        {/* <View>
                            <Image source={this.competition_example} style={{width : '100%'}} />
                        </View> */}

                        <View style={{marginTop : 16}}>
                            <Button title={'Upload Tanda Bukti'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.chooseBukti()} is_disabled={is_disabled} />
                        </View>
                        <View style={{marginTop : 8}}>
                            <Button title={'Payment'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.submitPayment()} is_disabled={is_disabled} />
                        </View>

                        

                    </View>
                    
                </ScrollView>

            </View>
        );
	}
}