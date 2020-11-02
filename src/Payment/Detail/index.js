import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
    View,
    Text,
    Image,
    AsyncStorage
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import SearchCompetition from '../../Components/SearchCompetition'
import ListPayment from '../../Components/ListPayment'
import NoDataFound from '../../Components/NoData'

import ListInv from '../../Components/ListInv'
import Button from '../../Components/Button'

export default class PaymentDetail extends Base {
	state = {
        token : '',
		optionsAxios : {
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		data_arr : [
			{id : 1}, {id : 2}, {id : 3}, {id : 4}, 
        ],
        invoice_info : [],
        invoice_arr : [],
        record_payment : [],
        inv_id : '',
        competition_data : {
            id : '',
            name : '',
            image_display : '',
            description : '',
            price_per_athlete : 0
        },
        invoice_data : {
            athlete_registration : [],
            coach_registration : [],
            invoice_status : {
                id: '',
                name: ''
            },
            remains : 0
        },
        ecash_data : {id : ''},
        ecash_log_arr : [],
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
        var token = await AsyncStorage.getItem('token')
        var optionsAxios = this.state.optionsAxios
		optionsAxios.headers['Authorization'] = token
        var inv_id = this.props.route.params.id
        await this.setState({token : token, optionsAxios : optionsAxios, inv_id : inv_id})
        
        await this.get_data()
        await this.get_ecash('')
        await this.get_ecash('log')

        var invoice_info = [
            // {title : 'Number of Athlete', value : this.state.invoice_data.athlete_registration.length},
            // {title : 'Number of Coach', value : this.state.invoice_data.coach_registration.length},
            {title : 'Invoice Date', value : this.moment(this.state.invoice_data.created_at).format('DD MMM YYYY')},
            {title : 'Status', value : this.state.invoice_data.invoice_status.name},
        ]

        // var totalAthlete_price = this.state.invoice_data.athlete_registration.length * this.state.competition_data.price_per_athlete

        var invoice_arr = [
            // {title : 'Athlete x' + this.state.invoice_data.athlete_registration.length, price : totalAthlete_price},
            // {title : 'Athlete x' + this.state.invoice_data.coach_registration.length, price : 0}
        ]
        
        await this.setState({invoice_info : invoice_info, invoice_arr : invoice_arr})
    }

    async get_data(){
        try {
            var url = this.url + '/invoice?id=' + this.state.inv_id
            console.log(url)
            console.log(this.state.optionsAxios)

            var response = await this.axios.get(url, this.state.optionsAxios);
      
            if (response.data.status == 'success') {
              var data = response.data.data
              
              var competition = data.competition
              console.log(data)
              competition.image_display = this.no_image
              if(competition.file_name != null){
                  competition.image_display = {uri : this.url_image + '/competition?file_name=' + competition.file_name + '&random=' + new Date().getTime()}
              }
              await this.setState({competition_data : competition, invoice_data : data})

            }
      
        } catch (e) {
            this.alertSnackbar(e.message)
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
    
    async toNext(){
        this.props.navigation.navigate('TopUp', {
            navigateFrom : 'payment',
            competition_data : JSON.stringify(this.state.competition_data)
        })
    }
	
	render() {
        const {
            competition_data,
            invoice_data,
            record_payment
        } = this.state
		return (

            <ScrollView style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>
                
                <View style={{padding : 16}}>

                    <View style={{flexDirection : 'row'}}>

                        <View style={{justifyContent : 'space-between'}}>
                            <Image style={{width : 128, height : 128}} source={competition_data.image_display} />
                        </View>
                        <View style={{flex : 1, marginLeft : 16}}>
                            <Text style={{textTransform : 'capitalize'}}>{competition_data.name}</Text>
                            <Text style={{textTransform : 'capitalize'}}>{competition_data.description}</Text>
                        </View>

                    </View>

                    <View style={{marginTop : 16}}>
                        {
                            this.state.invoice_info.map((data, index)=>(
                                <View style={{flexDirection : 'row', marginBottom : 8}} key={index}>
                                    <Text style={{width : 160}}>{data.title}</Text>
                                    <Text style={{textTransform : 'capitalize'}}>: {data.value}</Text>
                                </View>
                            ))
                        }
                    </View>

                    {/* <View style={{marginTop : 24}}>
                        <Text>List Registered</Text>
                        
                        <View style={{backgroundColor : 'white', marginTop : 8, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                            <View style={{padding : 16}}>
                                {
                                    this.state.invoice_arr.map((data, index)=>(
                                        <View style={{marginTop : index == 0 ? 0 : 8}} key={index}>
                                            <ListInv title={'Athlete'} price={data.price.toLocaleString(this.priceFormat)} />
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View> */}

                    <View style={{marginTop : 24}}>
                        <Text>Record of Payment</Text>

                        <View style={{backgroundColor : 'white', marginTop : 8, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                            <View style={{padding : 16}}>
                                {
                                    record_payment.map((data, index)=>(
                                        <View style={{marginTop : index == 0 ? 0 : 8}} key={index}>
                                            <ListInv title={data.date} subTitle={data.title} price={data.price.toLocaleString(this.priceFormat)} />
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>

                    <View style={{backgroundColor : 'white', padding : 16, marginTop : 16, borderColor : Style.colors.gray_ea, borderWidth : 1, borderRadius : 4}}>
                        <ListInv title={'Remaining Payment'} price={invoice_data.remains.toLocaleString(this.priceFormat)} />
                    </View>

                    {
                        invoice_data.invoice_status.name === 'Unpaid' ?
                        <View style={{backgroundColor : 'white', marginTop : 16}}>
                            <Button title={'Confirm Your Payment'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.toNext()} />
                        </View>
                        : <></>
                    }
                    

                </View>
                
            </ScrollView>

		);
	}
}