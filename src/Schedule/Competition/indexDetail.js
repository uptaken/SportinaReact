import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  RefreshControl,
  View,
  Linking,
  Modal,
  Text,
  TextInput,
  Keyboard
} from 'react-native';

import Button from '../../Components/Button'
import Style from '../../Style/theme'
import Base from '../../Base'

import SegmentedControl from '@react-native-community/segmented-control'

import CompetitionDetail from './detail'
import CompetitionHotel from './Hotel'
import CompetitionRegister from './Register'

import ModalLoading from '../../Components/ModalLoading'

export default class CompetitionDetailIndex extends Base {
    state = {
      token : '',
      optionsAxios : {
        timeout: this.axiosTimeout,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      tab_arr : ['Info','Hotel','Register'],
      selectedIndex : 0,
      data_competition : {
        id : '',
        name : '',
        image_display : '',
        description : '',
        start_date : '',
        place : '',
        close_registration_at : '',
        survey : [],
      },
      division_regis_arr : [],
      info_data : [],
      total_data : [],
      athlete_arr : [],
      coach_arr : [],
      survey_arr : [],
      participant_arr : [],
      auth_data : {name : ''},
      totalPriceRegister : 0,
      survey : {},
      is_modal_survey : false,
      estimate_athlete : 0,
      waiting_participant_arr : [],
      is_close_regis : false,
      end_competition : false,
      is_modal_loading : false,
      search_register : '',
    }

  async componentDidMount() {
    var token = await AsyncStorage.getItem('token')
    console.log(token)
    var competition_id = this.props.route.params.id
    var optionsAxios = this.state.optionsAxios
    optionsAxios.headers['Authorization'] = token
    await this.setState({token : token, optionsAxios : optionsAxios, competition_id : competition_id})

    await this.setState({is_modal_loading : true})

    await this.get_auth()
    await this.infoData()

    setTimeout(async () => {
      await this.setState({is_modal_loading : false})
    },this.loadingTimeout);
  }

  async changeTab(index){
    await this.setState({selectedIndex : index})
    if(index === 0){
      await this.setState({participant_arr : []})
      await this.infoData()
    }
    else if(index === 2){
      await this.setState({is_modal_loading : true})
      await this.get_priceInv()
      await this.get_participant('waiting')
      await this.get_participant('coach')
      await this.get_participant('athlete')
      await this.get_survey(this.state.auth_data.id)
      setTimeout(async () => {
        await this.setState({is_modal_loading : false})
      },this.loadingTimeout);
    }
  }

  async infoData(){

    await this.get_data()
    await this.get_division()
    await this.get_survey()

    await this.setDetail_info()

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

  async get_data(){
    try {
      var url = this.url + '/competition?id=' + this.state.competition_id

      var response = await this.axios.get(url, this.state.optionsAxios);

      if (response.data.status == 'success') {
        var data = response.data.data

        data.image_display = this.no_image
        if(data.file_name != null){
            data.image_display = {uri : this.url_image + '/competition?file_name=' + data.file_name + '&random=' + new Date().getTime()}
        }
        var now = this.moment().format()
        if(this.moment(data.close_registration_at).format() < now){
          await this.setState({is_close_regis : true})
        }
        if(this.moment(data.end_date).format() < now){
          await this.setState({is_close_regis : true, end_competition : true})
        }

        await this.setState({data_competition : data})
      }

    } catch (e) {
      this.alertSnackbar(e.message)
    }
  }

  async get_division(){
    try {
      var url = this.url + '/division?id=&competition_id=' + this.state.competition_id

      console.log(url)
      console.log(this.state.optionsAxios)

      var response = await this.axios.get(url, this.state.optionsAxios);

      if (response.data.status == 'success') {
        var data = response.data.data.data

        var division = data

        var arr = []
        var class_arr = []
        
        for(var x in division){
          var class_data_arr = division[x].class
          
            for(var y in class_data_arr){
              arr.push(class_data_arr[y])
              
              if(class_data_arr.length > 4){
                if(arr.length % 4 === 0){
                  class_arr.push(arr)
                  arr = []
                }
              }
              else{
                class_arr = [class_data_arr]
              }
            }
  
          // if(arr.length < 4){
          //   class_arr.push(arr)
          // }

          division[x].data_class_arr = class_arr
        }
        
        await this.setState({division_regis_arr : division})
      }

    } catch (e) {
      this.alertSnackbar(e.message)
    }
  }

  async get_participant(type){
    try {
      var url = this.url
      if(type === 'waiting'){
        url += '/team/participant?competition_id=' + this.state.competition_id + '&search=' + this.state.search_register
      }
      else{
        url += '/' + type + '?id=&class_id=&competition_id=' + this.state.competition_id + '&type=with_team&search=' + this.state.search_register
      }
      console.log(url)

      var response = await this.axios.get(url, this.state.optionsAxios);

      if(response.data.status === 'success'){
          var data = response.data.data.data
          var participant = this.state.participant_arr

          for(var x in data){
            data[x].image_display = this.no_profile_picture
            data[x].status_registration = 'registered'
            data[x].registration_type = 'registered'
            data[x].participant_type = 'athlete_coach'

            var uri_image = this.url_image
            
            if(type === 'waiting'){
              data[x].status_registration = 'waiting'
              data[x].registration_type = 'waiting'
              data[x].participant_type = 'team_participant'
              data[x].type = data[x].type
              uri_image += '/team-participant?file_name=' + data[x].file_name + '&random=' + new Date().getTime()
            }
            else{
              if(data[x].invoice_registration.invoice_status.name === 'Unpaid'){
                data[x].status_registration = 'waiting'
              }
              data[x].type = type
              uri_image += '/' + type + '?file_name=' + data[x].file_name + '&random=' + new Date().getTime()
            }

            if(data[x].file_name != null){
              data[x].image_display = {uri : uri_image}
            }

            if(data[x].deleted_at != null){
              data[x].status_registration = 'canceled'
            }

            participant.push(data[x])
          }
          if(type === 'athlete'){
              await this.setState({athlete_arr : data})
          }
          else if(type === 'coach'){
              await this.setState({coach_arr : data})
          }
          else if(type === 'waiting'){
            this.setState({waiting_participant_arr : data})
          }
          await this.setState({participant_arr : participant})
      }

    } 
    catch (e) {
      await this.alertSnackbar(e.message)
    }
  }

  async get_survey(team_id = ''){
    try {
      var url = this.url + '/competition/survey?competition_id=' + this.state.competition_id
      if(team_id !== ''){
        url += '&team_id=' + team_id
      }

      var response = await this.axios.get(url, this.state.optionsAxios);

      if (response.data.status == 'success') {
        var data = response.data.data.data
        if(team_id === ''){
          await this.setState({survey_arr : data})
        }
        else{
          if(data.length === 0){
            await this.setState({is_modal_survey : true})
          }
        }
      }

    } catch (e) {
      this.alertSnackbar(e.message)
    }
  }

  async setDetail_info(){
    var info_data = [
      {title : 'Date :', value : this.moment(this.state.data_competition.start_date).format('DD MMM YYYY')},
      {title : 'Venue :', value : this.state.data_competition.place},
      {title : 'Close Registration :', value : this.moment(this.state.data_competition.close_registration_at).format('DD MMM YYYY')},
    ]
    
    var total_data = [
        {title : 'Team', value : this.state.data_competition.total_team == null ? 0 : this.state.data_competition.total_team},
        {title : 'Book', value : this.state.data_competition.total_book == null ? 0 : this.state.data_competition.total_book},
        {title : 'Athlete', value : this.state.data_competition.total_athlete == null ? 0 : this.state.data_competition.total_athlete},
        {title : 'Coach', value : this.state.data_competition.total_coach == null ? 0 : this.state.data_competition.total_coach},
    ]
    await this.setState({info_data : info_data, total_data : total_data})
  }

  async downloadProposal(){
    if(this.state.data_competition.proposal_file_name != null){
      Linking.openURL(this.url_image + '/competition?proposal_file_name=' + this.state.data_competition.proposal_file_name)       
    }
  }

  async participantDetail(index){
    var competition = this.state.data_competition
    var participant = this.state.participant_arr
    this.props.navigation.navigate('FormRegister', {
      id : participant[index].id,
      type : participant[index].type,
      registration_status : participant[index].status_registration,
      competition_id : competition.id,
      participant_type : participant[index].participant_type,
      onData : ()=>this.onGetParticipant()
    })
  }

  async onGetParticipant(){
    Keyboard.dismiss()
    await this.setState({is_modal_loading : true, participant_arr : []})
    await this.get_participant('waiting')
    await this.get_participant('coach')
    await this.get_participant('athlete')
    await this.get_priceInv()

    setTimeout(async () => {
      await this.setState({is_modal_loading : false})
    },this.loadingTimeout);
  }

  async addParticipant(type){
    var competition = this.state.data_competition
    this.props.navigation.navigate('FormRegister', {
      type : type,
      registration_status : 'waiting',
      competition_id : competition.id,
      participant_type : 'team_participant',
      onData : ()=>this.onGetParticipant()
    })
  }

  async get_priceInv(){
    var competition = this.state.data_competition
    try {
      var response = await this.axios.get(this.url + '/invoice?competition_id=' + competition.id, this.state.optionsAxios);

      if(response.data.status === 'success'){
          var data = response.data.data.data
          var remaining = 0
          for(var x in data){
            remaining += data[x].remains
          }

          var participant = this.state.participant_arr
          var countAthleteNew = 0
          for(var x in participant){
            if(participant[x].participant_type === 'team_participant'){
              if(participant[x].type === 'athlete'){
                countAthleteNew += 1
              }
            }
          }
          
          var totalPriceRegister = (countAthleteNew * competition.price_per_athlete) + remaining
          await this.setState({totalPriceRegister : totalPriceRegister})
      }

    } 
    catch (e) {
      await this.alertSnackbar(e.message)
    }
  }

  async paymentRegister(){
    if(this.state.waiting_participant_arr.length === 0){
      this.props.navigation.navigate('TopUp', {
        competition_data : JSON.stringify(this.state.data_competition)
      })
    }
    else{
      this.props.navigation.navigate('RegisterPayout', {
        competition_data : JSON.stringify(this.state.data_competition),
        navigateFrom : 'register',
      })
    }
  }

  async submitSurvey(){
    var data = {}
    data.competition = {id : this.state.data_competition.id}
    data.estimate_athlete = this.state.estimate_athlete

    if(this.state.estimate_athlete === 0){
      await this.alertSnackbar('Estimasi Atlit tidak boleh kosong')
    }
    else{
      try {
        var response = await this.axios.post(this.url + '/competition/survey', data, this.state.optionsAxios);
  
        if(response.data.status === 'success'){
          await this.alertSnackbar('Berhasil')
          await this.setState({is_modal_survey : false})
        }
      } 
      catch (e) {
          await this.alertSnackbar(e.message)
      }
    }
  }

  async divisionClassDetail(indexDivision, indexClassArr, indexClass){
    var division_regis_arr = this.state.division_regis_arr
    var class_data = division_regis_arr[indexDivision].data_class_arr[indexClassArr][indexClass]
    var division_data = division_regis_arr[indexDivision]
    this.props.navigation.navigate('DivisionClassParticipant',{
      competition_id : this.state.data_competition.id,
      class_id : class_data.id,
      division_id : division_data.id
    })
  }

  async modalRequestClose(){
    await this.setState({is_modal_survey : false})
  }

  async changeRegisterSearch(value){
    await this.setState({search_register : value})
  }
  
  async searchParticipantBtn(){
    await this.setState({is_modal_loading : true})
    await this.setState({participant_arr : []})
    await this.get_participant('waiting')
    await this.get_participant('coach')
    await this.get_participant('athlete')

    setTimeout(async () => {
      await this.setState({is_modal_loading : false})
    },this.loadingTimeout);
  }

  render() {
    const {
      tab_arr,
      selectedIndex,
      data_competition,
      info_data,
      total_data,
      survey_arr,
      waiting_participant_arr,
      participant_arr,
      auth_data,
      totalPriceRegister,
      is_modal_survey,
      estimate_athlete,
      is_close_regis,
      division_regis_arr,
      end_competition,
      is_modal_loading,
      search_register
    } = this.state
    return (
      <>
      <View style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>
        <SegmentedControl
          values={tab_arr}
          selectedIndex={selectedIndex}
          onChange={(event)=>this.changeTab(event.nativeEvent.selectedSegmentIndex)}
          tintColor={'white'}
          activeFontStyle={{color : Style.colors.black70p_hex}}
          backgroundColor={Style.colors.black70p_hex}
          style={{borderRadius : 0, height : 16 * 2.5}}
        />

          {
            selectedIndex === 0 ?
            <CompetitionDetail
              data={data_competition}
              info_data={info_data}
              total_data={total_data}
              survey_arr={survey_arr}
              downloadProposal={()=>this.downloadProposal()}
              division_regis_arr={division_regis_arr}
              divisionClassDetail={(indexDivision, indexClassArr, indexClass)=>this.divisionClassDetail(indexDivision, indexClassArr, indexClass)} />
            : selectedIndex === 2 ?
            <CompetitionRegister
              data={data_competition}
              participant_arr={participant_arr}
              auth_data={auth_data}
              participantDetail={(index)=>this.participantDetail(index)}
              totalPriceRegister={totalPriceRegister}
              addButton={(type)=>this.addParticipant(type)}
              paymentBtn={()=>this.paymentRegister()}
              is_close_regis={is_close_regis}
              end_competition={end_competition}
              searchParticipantBtn={()=>this.searchParticipantBtn()}
              changeSearch={(value)=>this.changeRegisterSearch(value)} />
            :<></>
          }

          <ModalLoading is_modal_loading={is_modal_loading} />

          <Modal
            transparent={true}
            visible={is_modal_survey}
            animationType="fade"
            onRequestClose={()=>this.modalRequestClose()}>
            <View style={{backgroundColor : '#000000B3', flex : 1, justifyContent : 'center'}}>
                <View style={{margin : 16 * 1.5, backgroundColor : 'white', radius : 4, padding : 16}}>
                  <View>
                    <Text style={{fontWeight : 'bold', fontSize : 16}}>Competition Survey</Text>
                  </View>
                  <View style={{marginTop : 8}}>
                    <Text>Estimation Athlete</Text>
                    <TextInput
                        value={estimate_athlete}
                        onChangeText={async (text)=>await this.setState({estimate_athlete : text})}
                        style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4, borderColor : Style.colors.gray_ea, borderWidth : 1}} 
                        placeholder={'Estimation Athlete'}
                        returnKeyType={"done"}
                        editable={true}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => null } />
                  </View>
                  <View style={{marginTop : 16, flexDirection : "row", justifyContent : 'flex-end'}}>
                    <Button title={'Submit'} color={Style.colors.colorPrimary} actionBtnPress={()=>this.submitSurvey()} />
                  </View>
                </View>
            </View>
          </Modal>
      </View>
      
      </>
    );
  }
}
