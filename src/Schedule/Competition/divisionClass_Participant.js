import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	Button,
    FlatList,
    AsyncStorage,
    Linking,
    TouchableHighlight,
    Modal
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import HeadTitle from '../../Components/HeadTitle'
import ListRegistered from '../../Components/CompetitionDetail/ListRegistered'
import NoData from '../../Components/NoData'
import ModalLoading from '../../Components/ModalLoading'

export default class DivisionClassParticipant extends Base {
	state = {
        token : '',
		optionsAxios : {
			timeout: this.axiosTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
        competition_data : {id : '', name : ''},
        participant_arr : [],
        competition_id : '',
        class_id : '',
        division_id : '',
        auth_data : {name : ''},
        class_data : {name : '', division : {name : ''}},
        is_modal_loading : true
    }

	async componentDidMount() {
        var token = await AsyncStorage.getItem('token')
        console.log(token)
        var competition_id = this.props.route.params.competition_id
        var class_id = this.props.route.params.class_id
        var division_id = this.props.route.params.division_id
        var optionsAxios = this.state.optionsAxios
        optionsAxios.headers['Authorization'] = token
        await this.setState({token : token, optionsAxios : optionsAxios, competition_id : competition_id, class_id : class_id, division_id : division_id})

        await this.get_class()
        await this.get_auth()

        await this.get_competition_data()
        await this.get_participant()

        setTimeout(async () => {
            await this.setState({is_modal_loading : false})
        }, this.loadingTimeout);
    }

    async get_auth(){
		try {
			var response = await this.axios.get(this.url + '/auth/profile', this.state.optionsAxios);
		
			if (response.data.status == 'success') {
				var data = response.data.data
				await this.setState({auth_data : data})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
	}

    async get_competition_data(){
        try {
          var url = this.url + '/competition?id=' + this.state.competition_id

          var response = await this.axios.get(url, this.state.optionsAxios);

          if (response.data.status == 'success') {
            var data = response.data.data

            await this.setState({competition_data : data})
          }

        } catch (e) {
          this.alertSnackbar(e.message)
        }
    }

    async get_participant(){
        try {
            var url = this.url + '/athlete?id=&class_id=' + this.state.class_id + '&competition_id=' + this.state.competition_data.id + '&type=no_team&search='
            console.log(url)

            var response = await this.axios.get(url, this.state.optionsAxios);
  
            if (response.data.status == 'success') {
              var data = response.data.data.data
              for(var x in data){
                  data[x].type = 'athlete'
                  data[x].image_display = this.no_profile_picture
                  if(data[x].file_name != null){
                    data[x].image_display = {uri : this.url_image + '/athlete?file_name=' + data[x].file_name + '&random=' + new Date().getTime()}
                  }
              }

              await this.setState({participant_arr : data})
            }  
        } catch (e) {
        this.alertSnackbar(e.message)
        }
    }

    async get_class(){
        try {
            var url = this.url + '/class?id=' + this.state.class_id

            var response = await this.axios.get(url, this.state.optionsAxios);
  
            if (response.data.status == 'success') {
              var data = response.data.data

              await this.setState({class_data : data})
            }
  
        } catch (e) {
        this.alertSnackbar(e.message)
        }
    }

	render() {
        const {
            competition_data,
            participant_arr,
            auth_data,
            class_data,
            is_modal_loading
        } = this.state
		return (
            <>
            <HeadTitle title={competition_data.name} subTitle={class_data.division.name + ' / ' + class_data.name} />
            <ScrollView>
                
            <View style={{padding : 16}}>

                <View>
                    {
                        participant_arr.map((data, index)=>(
                            <TouchableHighlight key={index} underlayColor={'transparent'} style={{marginTop : index === 0 ? 0 : 8}}>
                                <ListRegistered data={data} auth_data={auth_data} />
                            </TouchableHighlight>
                        ))
                    }
                </View>
                {
                    participant_arr.length === 0 ?
                    <NoData />
                    : <></>
                }

            </View>
                
            </ScrollView>

            <ModalLoading is_modal_loading={is_modal_loading} />

            </>
		);
	}
}