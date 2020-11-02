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
import {Picker} from '@react-native-community/picker';

import SearchCompetition from '../Components/SearchCompetition'
import HeadTitle from '../Components/HeadTitle'
import ListInv from '../Components/ListInv'

export default class RegisterPayout extends Base {
	state = {
        token : '',
        optionsAxios : {
            timeout: 30000,
            headers: {
            'Content-Type': 'application/json',
            },
        },
        data_arr : [],
        invoice_arr : [],
        record_payment : [],
        payment_info : [],
        competition_data : {id : '', name : '', price_per_athlete : 0},
        participant_arr : [],
        remaining_payment : 0,
        total_payment : 0,
        ecash_data : {id : '', balance : 0},

    }

	async componentDidMount() {
        var token = await AsyncStorage.getItem('token')
        var competition_data = JSON.parse(this.props.route.params.competition_data)
        var optionsAxios = this.state.optionsAxios
        optionsAxios.headers['Authorization'] = token
        await this.setState({token : token, optionsAxios : optionsAxios, competition_data : competition_data})

        await this.get_team_participant()
        await this.get_invoice()
        await this.get_ecash('')
        await this.get_ecash('log')

        var payment_info = [
            {title : 'Bank Name', value : 'Bank'},
            {title : 'Bank Account', value : '1234567891'},
            {title : 'Bank Account Name', value : 'PT. Sportina'},
        ]
        
        await this.setState({payment_info : payment_info})
    }
    
    async get_team_participant(){
        try {            
            var response = await this.axios.get(this.url + '/team/participant?competition_id=' + this.state.competition_data.id, this.state.optionsAxios);
      
            if(response.data.status === 'success'){
                var data = response.data.data.data
                var count_athlete = 0, count_coach = 0
                for(var x in data){
                    if(data[x].type === 'coach'){
                        count_coach += 1
                    }
                    else if(data[x].type === 'athlete'){
                        count_athlete += 1
                    }
                }
                
                var invoice_arr = [
                    {title : 'Athlete x' + count_athlete, price : this.state.competition_data.price_per_athlete * count_athlete},
                    {title : 'Coach x' + count_coach, price : '0'}
                ]

                var total_payment = this.state.competition_data.price_per_athlete * count_athlete
                
                await this.setState({invoice_arr : invoice_arr, total_payment : total_payment, participant_arr : data})
            }
      
          } 
          catch (e) {
              // await this.setState({alertMessage : e.message})
              // this.$('modalAlert').modal('show')
          }
    }

    async get_ecash(type){
        try {
            var url = this.url
            if(type === ''){
                url += '/e-cash?id=&team_id=&competition_id=' + this.state.competition_data.id + '&type=registration'
            }
            else{
                url += '/e-cash/transaction?id=&e_cash_id=' + this.state.ecash_data.id
            }

            var response = await this.axios.get(url, this.state.optionsAxios);
      
            if (response.data.status == 'success') {
              var data = response.data.data.data
              if(type === ''){
                  await this.setState({ecash_data : data[0]})
              }
              else{
                  var record_payment = []
                  for(var x in data){
                    if(data[x].type === 'out'){
                        data[x].title = 'Payment'
                        data[x].date = this.moment(data[x].created_at).format('DD/MM')
                        data[x].price = data[x].amount
                        record_payment.push(data[x])
                    }
                  }
                  await this.setState({record_payment : record_payment})
              }
            }
      
        } catch (e) {
            this.alertSnackbar(e.message)
        }
    }

    async get_invoice(){
        try {            
            var response = await this.axios.get(this.url + '/invoice?competition_id=' + this.state.competition_data.id, this.state.optionsAxios);
      
            if(response.data.status === 'success'){
                var data = response.data.data.data
                var record_payment = []
                var remaining_payment = 0

                for(var x in data){
                    data[x].title = 'Registration'
                    data[x].date = this.moment(data[x].created_at).format('DD MMM YYYY')
                    data[x].price = data[x].total_price - data[x].remains
                    remaining_payment += data[x].remains
                    record_payment.push(data[x])
                }

                await this.setState({remaining_payment : remaining_payment})
            }
      
        } 
        catch (e) {
            await this.alertSnackbar(e.message)
        }
    }

	async toNext(){
        if(this.state.participant_arr.length === 0){
            this.props.navigation.navigate('TopUp', {
                competition_data : JSON.stringify(this.state.competition_data),
                navigateFrom : this.props.route.params.navigateFrom,
            })
        }
        else{
            try {
                var data = {}
                data.competition = {id : this.state.competition_data.id}
                console.log(data)
                console.log(this.state.optionsAxios)
                console.log(this.url + '/invoice/registration')
                var response = await this.axios.post(this.url + '/invoice/registration', data, this.state.optionsAxios);
          
                if(response.data.status === 'success'){
                    if(this.state.ecash_data.balance > 0){
                        this.props.navigation.navigate('RegisterPayoutComplete', {
                            competition_data : JSON.stringify(this.state.competition_data),
                            navigateFrom : this.props.route.params.navigateFrom,
                        })
                    }
                    else{
                        this.props.navigation.navigate('TopUp', {
                            competition_data : JSON.stringify(this.state.competition_data),
                            navigateFrom : this.props.route.params.navigateFrom,
                        })
                    }
                }
          
            } 
            catch (e) {
                await this.alertSnackbar(e.message)
            }
        }
    }

	render() {
        const {
            competition_data,
            invoice_arr,
            record_payment,
            remaining_payment,
            total_payment
        } = this.state
		return (
            <View style={{flex : 1}}>

                <HeadTitle title={competition_data.name} subTitle={'Payment'} />
                <ScrollView style={{backgroundColor : Style.colors.bgBase}}>
                    
                    <View style={{padding : 16}}>

                        <View>
                            <Text>Detail Invoice</Text>

                            <View style={{backgroundColor : 'white', marginTop : 8, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                                <View style={{padding : 16}}>
                                {
                                    invoice_arr.map((data, index)=>(
                                        <View style={{marginTop : index == 0 ? 0 : 8}} key={index}>
                                            <ListInv title={data.title} price={data.price.toLocaleString(this.priceFormat)} />
                                        </View>
                                    ))
                                }
                                </View>
                                <View style={{padding : 16, borderTopColor : Style.colors.gray_ea, borderTopWidth : 2}}>
                                    <ListInv title={'Total Payment'} price={total_payment.toLocaleString(this.priceFormat)} />
                                </View>
                            </View>

                        </View>

                        <View style={{marginTop : 16}}>
                            <Text>Record of Payment</Text>
                            <View style={{backgroundColor : 'white', padding : 16, marginTop : 8, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>

                                {
                                    record_payment.map((data, index)=>(
                                        <View style={{marginTop : index == 0 ? 0 : 8}} key={index}>
                                            <ListInv title={data.date} subTitle={data.title} price={data.price.toLocaleString(this.priceFormat)} />
                                        </View>
                                    ))
                                }
                            </View>
                        </View>

                        <View style={{backgroundColor : 'white', padding : 16, marginTop : 16, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                            <ListInv title={'Remaining Payment'} price={remaining_payment.toLocaleString(this.priceFormat)} />
                        </View>

                        {/* <View style={{marginTop : 16}}>
                            <Text>Payment Method</Text>
                            <View style={{backgroundColor : 'white', padding : 16, marginTop : 8, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                                <Text style={{marginBottom : 8}}>Proceed all payment through Transferring to</Text>

                                {
                                    this.state.payment_info.map((data, index)=>(
                                        <Text key={index} style={{marginBottom : 8}}>{data.value}</Text>
                                    ))
                                }

                                <Text>Please attach your club's name in the notes section of your payment confirmation</Text>
                            </View>
                        </View> */}

                        

                    </View>
                    
                </ScrollView>
                <View style={{padding : 16, backgroundColor : 'white'}}>
                    <Button title={'Confirm Your Payment'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.toNext()} />
                </View>

            </View>
        );
	}
}