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
    TouchableHighlight,
    FlatList,
    Keyboard,
    AsyncStorage
} from 'react-native';

import Base from '../../../Base';
import Style from '../../../Style/theme'
import Button from '../../../Components/Button'

import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {Picker} from '@react-native-community/picker';

import SearchCompetition from '../../../Components/SearchCompetition'
import HeadTitle from '../../../Components/HeadTitle'

import DateTimePicker from '@react-native-community/datetimepicker'

export default class FormRegister extends Base {
	state = {
        token : '',
        optionsAxios : {
            timeout: 30000,
            headers: {
            'Content-Type': 'application/json',
            },
        },
        coach_data : {
            id : '',
            name : '',
            coach_position : {id : ''},
            phone : '',
            gender : '',
            grade : {id : ''},
            image : {
                image_display : this.no_profile_picture,
                image : '',
                original_rotation : 0,
                type : 'old'
            },
            registration_status : 'waiting'
        },
        athlete_data : {
            id : '',
            unit : {id : ''},
            name : '',
            phone : '',
            birth_date : '',
            gender : '',
            height : '',
            weight : '',
            division : {id : ''},
            class : {id : ''},
            grade : {id : ''},
            image : {
                image_display : this.no_profile_picture,
                image : '',
                original_rotation : 0,
                type : 'old'
            },
            birth_date_val : '',
            registration_status : 'waiting'
        },
        competition_data : {name : '', id : ''},
        coach_position_arr : [],
        grade_arr : [],
        division_arr : [],
        class_arr : [],
        is_datepicker : false,
        unit_arr : [],
        competition_id : '',
    }

	async componentDidMount() {
        var token = await AsyncStorage.getItem('token')
        var optionsAxios = this.state.optionsAxios
        optionsAxios.headers['Authorization'] = token
        var competition_id = this.props.route.params.competition_id
        await this.setState({token : token, optionsAxios : optionsAxios, competition_id : competition_id})

        await this.get_competition_data()

        if(this.props.route.params.type === 'coach'){
            await this.get_coach_position()
        }
        else if(this.props.route.params.type === 'athlete'){
            await this.get_unit()
            await this.get_classDivision('division', '', '')
        }

        await this.get_grade()

        if(this.props.route.params.id != null){
            await this.get_data()
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

    async get_unit(){
        try {
			var response = await this.axios.get(this.url + '/unit', this.state.optionsAxios);
		
			if (response.data.status == 'success') {
                var data = response.data.data.data
                var arr = []
                for(var x in data){
                    var unit = {}
                    unit.id = data[x].id
                    unit.name = data[x].name
                    arr.push(unit)
                }
                await this.setState({unit_arr : arr})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
    }

    async get_coach_position(){
        try {
			var response = await this.axios.get(this.url + '/coach-position', this.state.optionsAxios);
		
			if (response.data.status == 'success') {
                var data = response.data.data.data
                await this.setState({coach_position_arr : data})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
    }

    async get_grade(){
        try {
			var response = await this.axios.get(this.url + '/grade-competition?competition_id=' + this.state.competition_data.id, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
                var data = response.data.data.data
                await this.setState({grade_arr : data})
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
    }

    async get_classDivision(type, id, gender){
        var url = this.url
        if(type === 'division'){
            url += '/division?competition_id=' + this.state.competition_data.id
        }
        else if(type === 'class'){
            url += '/class?division_id=' + id
        }

        try {
			var response = await this.axios.get(url, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
                var data = response.data.data.data
                if(type === 'division'){
                    var arr = []
                    for(var x in data){
                        var division_data = {}
                        division_data.id = data[x].id
                        division_data.name = data[x].name
                        arr.push(division_data)
                    }
                    await this.setState({division_arr : arr})
                }
                else if(type === 'class'){
                    var arr = []
                    for(var x in data){
                        if(data[x].gender == gender){
                            var class_data = {}
                            class_data.id = data[x].id
                            class_data.name = data[x].name
                            if(gender !== ''){
                                arr.push(class_data)
                            }
                        }
                    }
                    await this.setState({class_arr : arr})
                }
                if(id === ''){
                    await this.setState({class_arr : []})
                }
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
    }
    
    async get_data(){
        try {
            var url = this.url
            if(this.props.route.params.registration_status === 'waiting'){
                url += '/team/participant?id=' + this.props.route.params.id
            }
            else{
                url += '/' + this.props.route.params.type + '?id=' + this.props.route.params.id + '&type=no_team'
            }
			var response = await this.axios.get(url, this.state.optionsAxios);
		
			if (response.data.status == 'success') {
                var data = response.data.data
                if(data.unit != null){
                    data.unit = {id : data.unit.id, name : data.unit.name}
                }
                data.registration_status = this.props.route.params.registration_status
                data.image = {
                    image : '',
                    image_display : this.no_profile_picture,
                    original_rotation : 0,
                    type : 'old'
                }
                var image_url = this.props.route.params.type
                if(this.props.route.params.registration_status === 'waiting'){
                    image_url = 'team-participant'
                }
                if(data.file_name != null){
                    data.image = {
                        image : '',
                        image_display : {uri : this.url_image + '/' + image_url + '?file_name=' + data.file_name + '&random=' + new Date().getTime()},
                        original_rotation : 0,
                        type : 'old'
                    }   
                }
                if(this.props.route.params.type === 'coach'){
                    await this.setState({coach_data : data})
                }
                else if(this.props.route.params.type === 'athlete'){
                    data.division = {id : data.class.division.id, name : data.class.division.name}
                    data.class = {id : data.class.id, name : data.class.name}
                    data.birth_date = this.moment(data.birth_date).format('DD MMMM YYYY')
                    data.birth_date_val = new Date(data.birth_date)
                    await this.get_classDivision('class', data.division.id, data.gender)
                    await this.setState({athlete_data : data})
                }
			}

		} catch (e) {
			this.alertSnackbar(e.message)
		}
    }

    async chooseImage(){
        ImagePicker.showImagePicker(async response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
                var data = {}
                var image = {
                    image_display : {uri: response.uri},
                    image : response.data,
                    original_rotation : 0,
                    type : 'new'
                }
                if(this.props.route.params.type === 'coach'){
                    data = this.state.coach_data
                    data.image = image
                    await this.setState({coach_data : data})
                }
                else if(this.props.route.params.type === 'athlete'){
                    data = this.state.athlete_data
                    data.image = image
                    await this.setState({athlete_data : data})
                }
      
            }
        });
    }

	async ChangeInput(value, type, formType){
        if(formType === 'coach'){
            var data = this.state.coach_data
            data[type] = value
            if(type === 'coach_position'){
                data[type] = {id : value}
            }
            else if(type === 'grade'){
                data[type] = {id : value}
            }
            await this.setState({coach_data : data})
        }
        if(formType === 'athlete'){
            var data = this.state.athlete_data
            data[type] = value
            if(type === 'birth_date'){
                data.birth_date = this.moment(value).format('DD MMMM YYYY')
                data.birth_date_val = new Date(value)
                await this.datePickerAction()
            }
            else if(type === 'division'){
                data[type] = {id : value}
                await this.setState({class_arr : []})
                data['class'] = {id : ''}
                await this.get_classDivision('class', value, data.gender)
            }
            else if(type === 'gender'){
                if(data['division'].id === ''){
                    data['division'] = {id : ''}
                }
                else{
                    await this.get_classDivision('class', data['division'].id, value)
                }
                data['class'] = {id : ''}
            }
            else if(type === 'unit'){
                data[type] = {id : value}
            }
            else if(type === 'grade'){
                data[type] = {id : value}
            }
            else if(type === 'class'){
                data[type] = {id : value}
            }
            await this.setState({athlete_data : data})
        }
    }

    async datePickerAction(){
        var is_datepicker = !this.state.is_datepicker
        await this.setState({is_datepicker : is_datepicker})
        Keyboard.dismiss()
    }
    
    async saveDataForm(){
        var type = this.props.route.params.type
        var url = this.url
        var url_team_participant = '/team/participant'
        var response = ''
        if(type === 'coach'){
            var data = this.state.coach_data
            if(data.coach_position.id === ''){
                await this.alertSnackbar('Position tidak boleh kosong')
            }
            else if(data.name === ''){
                await this.alertSnackbar('Nama tidak boleh kosong')
            }
            else if(data.phone === ''){
                await this.alertSnackbar('No. Handphone tidak boleh kosong')
            }
            else if(data.gender === ''){
                await this.alertSnackbar('Gender tidak boleh kosong')
            }
            else if(data.grade.id === ''){
                await this.alertSnackbar('Grade tidak boleh kosong')
            }
            else{
                try {
                    data.competition = {id : this.state.competition_data.id}
                    data.type = 'coach'

                    var dataClone = JSON.stringify(data)
                    dataClone = JSON.parse(dataClone)
                    if(dataClone.image.type === 'old'){
                        dataClone.image = []
                    }
                    var dataPost = {}

                    if(data.registration_status !== 'waiting'){
                        url += '/coach'
                        dataPost = dataClone
                    }
                    else{
                        url += url_team_participant
                        if(data.id === ''){
                            dataPost.arr_participant = [dataClone]
                        }
                        else{
                            dataPost = dataClone
                        }
                    }

                    if(data.id !== ''){
                        response = await this.axios.put(url, dataPost, this.state.optionsAxios);
                    }
                    else if(data.id === ''){
                        response = await this.axios.post(url, dataPost, this.state.optionsAxios);
                    }
                    
                    if(response.data.status === 'success'){
                        await this.alertSnackbar('Berhasil')
                        await this.props.route.params.onData()
                        this.props.navigation.goBack()
                    }
                }
                catch (e) {
                    await this.alertSnackbar(e.message)
                }
            }
            
        }
        else if(type === 'athlete'){
            var data = this.state.athlete_data
            if(data.name === ''){
                await this.alertSnackbar('Nama tidak boleh kosong')
            }
            else if(data.birth_date === ''){
                await this.alertSnackbar('Tanggal Lahir tidak boleh kosong')
            }
            else if(data.gender === ''){
                await this.alertSnackbar('Gender tidak boleh kosong')
            }
            else if(data.grade.id === ''){
                await this.alertSnackbar('Grade tidak boleh kosong')
            }
            else if(data.weight === ''){
                await this.alertSnackbar('Weight tidak boleh kosong')
            }
            else if(data.height === ''){
                await this.alertSnackbar('Height tidak boleh kosong')
            }
            else if(data.division.id === ''){
                await this.alertSnackbar('Division tidak boleh kosong')
            }
            else if(data.class.id === ''){
                await this.alertSnackbar('Class tidak boleh kosong')
            }
            
            else{
                try {
                    data.competition = {id : this.state.competition_data.id}
                    data.type = 'athlete'
                    
                    var dataClone = JSON.stringify(data)
                    dataClone = JSON.parse(dataClone)
                    dataClone.birth_date = this.moment(dataClone.birth_date).format('yyyy-MM-DD')
                    if(dataClone.image.type === 'old'){
                        dataClone.image = []
                    }
                    var dataPost = {}

                    if(data.registration_status !== 'waiting'){
                        url += '/athlete'
                        dataPost = dataClone
                    }
                    else{
                        url += url_team_participant
                        if(dataClone.unit.id === ''){
                            delete dataClone.unit
                        }
                        if(data.id === ''){
                            dataPost.arr_participant = [dataClone]
                        }
                        else{
                            dataPost = dataClone
                        }
                    }

                    if(data.id !== ''){
                        response = await this.axios.put(url, dataPost, this.state.optionsAxios);
                    }
                    else if(data.id === ''){
                        response = await this.axios.post(url, dataPost, this.state.optionsAxios);
                    }

                    if(response.data.status === 'success'){
                        await this.alertSnackbar('Berhasil')
                        await this.props.route.params.onData()
                        this.props.navigation.goBack()
                    }
                }
                catch (e) {
                    await this.alertSnackbar(e.message)
                }
            }
        }
    }

	render() {
        const {
            competition_data,
            coach_data,
            coach_position_arr,
            grade_arr,
            athlete_data,
            division_arr,
            class_arr,
            is_datepicker,
            unit_arr
        } = this.state
		return (
            <>
            <HeadTitle title={competition_data.name} subTitle={this.props.route.params.type + ' Registration'} />
            <ScrollView style={{backgroundColor : Style.colors.bgBase}}>
                
                <View style={{padding : 16}}>

                    <View style={{alignItems : 'center'}}>
                    <TouchableHighlight onPress={()=>this.chooseImage()} style={{borderRadius : 120/2}}>
                    {
                        this.props.route.params.type === 'coach' ?
                        <Image style={{width : 120, height : 120, borderRadius : 120/2}} source={coach_data.image.image_display} />
                        :
                        <Image style={{width : 120, height : 120, borderRadius : 120/2}} source={athlete_data.image.image_display} />
                    }
                    </TouchableHighlight>
                    </View>

                    <View style={{marginTop : 16}}>
                        {
                            this.props.route.params.type == 'coach' ? 
                            <FormCoach
                                coach_data={coach_data}
                                coach_position_arr={coach_position_arr}
                                ChangeInput={(value, type)=>this.ChangeInput(value, type, 'coach')}
                                grade_arr={grade_arr} />
                            : this.props.route.params.type == 'athlete' ? 
                            <FormAthlete
                                athlete_data={athlete_data}
                                unit_arr={unit_arr}
                                division_arr={division_arr}
                                grade_arr={grade_arr}
                                class_arr={class_arr}
                                is_datepicker={is_datepicker}
                                ChangeInput={(value, type)=>this.ChangeInput(value, type, 'athlete')}
                                datePickerAction={()=>this.datePickerAction()} />
                            : <></>
                        }
                    </View>

                    <View style={{marginTop : 16}}>
                        <View>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(Style.colors.colorPrimaryDark, false)} onPress={()=>this.saveDataForm()}>
                                <View style={{backgroundColor : Style.colors.colorPrimary, padding : 12, alignItems : 'center', borderRadius : 4}}>
                                    <Text style={{color : 'white', textTransform: 'uppercase'}}>Save</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{marginTop : 8}}>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('#cc0000ff', false)}>
                                <View style={{backgroundColor : '#cc0000ff', padding : 12, alignItems : 'center', borderRadius : 4}}>
                                    <Text style={{color : 'white', textTransform: 'uppercase'}}>Cancel</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>

                </View>
                
            </ScrollView>
            </>
        );
	}
}

class FormCoach extends Base {

    render() {
        const {
            coach_data,
            coach_position_arr,
            ChangeInput,
            grade_arr
        } = this.props
        return (
            <>

                <View>
                    <Text>Position</Text>
                        <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                            <Picker
                                selectedValue={coach_data.coach_position.id}
                                onValueChange={(itemValue, itemIndex) =>
                                    ChangeInput(itemValue, 'coach_position')
                                }>
                                <Picker.Item label={'Pilih Posisi'} value={''} />
                                {
                                    coach_position_arr.map((data, index)=>(
                                    <Picker.Item label={data.name} value={data.id} key={index} />
                                    ))
                                }
                            </Picker>
                        </View>
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Name of Coach</Text>
                    <TextInput
                        value={coach_data.name}
                        onChangeText={text=>ChangeInput(text, 'name')}
                        style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                        placeholder={'Name of Coach'}
                        returnKeyType={"next"}
                        editable={true}
                        ref={(input) => { this.name = input }}
                        onSubmitEditing={() => { this.phone.focus() }} />
                </View>
                <View style={{marginTop : 8}}>
                    <Text>No. Handphone</Text>
                    <TextInput
                        value={coach_data.phone}
                        onChangeText={text=>ChangeInput(text, 'phone')}
                        style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                        placeholder={'081234567xxx'}
                        returnKeyType={"next"}
                        editable={true}
                        keyboardType={'phone-pad'}
                        ref={(input) => { this.phone = input }}
                        onSubmitEditing={() => null } />
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Gender</Text>
                        <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                            <Picker
                                selectedValue={coach_data.gender}
                                onValueChange={(itemValue, itemIndex) =>
                                    ChangeInput(itemValue, 'gender')
                                }>
                                <Picker.Item label={'Pilih Gender'} value={''} />
                                <Picker.Item label={'Male'} value={1} />
                                <Picker.Item label={'Female'} value={0} />
                            </Picker>
                        </View>
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Grade</Text>
                        <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                            <Picker
                                selectedValue={coach_data.grade.id}
                                onValueChange={(itemValue, itemIndex) =>
                                    ChangeInput(itemValue, 'grade')
                                }>
                                <Picker.Item label={'Pilih Grade'} value={''} />
                                {
                                    grade_arr.map((data, index)=>(
                                    <Picker.Item label={data.grade} value={data.id} key={index} />
                                    ))
                                }
                            </Picker>
                        </View>
                </View>
            
            </>
        );
    }
}

class FormAthlete extends Base {
    state = {
        is_datepicker : false
    }

    render() {
        const {
            unit_arr,
            athlete_data,
            division_arr,
            grade_arr,
            class_arr,
            ChangeInput,
            is_datepicker,
            datePickerAction
        } = this.props
        return (
            <>

                <View>
                    <Text>Unit / School</Text>
                        <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                            <Picker
                                selectedValue={athlete_data.unit.id}
                                onValueChange={(itemValue, itemIndex) =>
                                    ChangeInput(itemValue, 'unit')
                                }>
                                <Picker.Item label={'Pilih Unit / School'} value={''} />
                                {
                                    unit_arr.map((data, index)=>(
                                    <Picker.Item label={data.name} value={data.id} key={index} />
                                    ))
                                }
                            </Picker>
                        </View>
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Name</Text>
                    <TextInput 
                        value={athlete_data.name}
                        onChangeText={text=>ChangeInput(text, 'name')}
                        style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                        placeholder={'Name'}
                        returnKeyType={"next"}
                        editable={true}
                        ref={(input) => { this.name = input }}
                        onSubmitEditing={() => { this.phone.focus() }} />
                </View>
                <View style={{marginTop : 8}}>
                    <Text>No. Handphone</Text>
                    <TextInput
                        value={athlete_data.phone}
                        onChangeText={text=>ChangeInput(text, 'phone')}
                        style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                        placeholder={'081234567xxx'}
                        returnKeyType={"next"}
                        editable={true}
                        keyboardType={'phone-pad'}
                        ref={(input) => { this.phone = input }}
                        onSubmitEditing={() => this.birth_date.focus() } />
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Date of Birth</Text>
                        <TextInput 
                            value={athlete_data.birth_date}
                            style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                            returnKeyType={"next"}
                            editable={true}
                            onFocus={() => datePickerAction()}
                            onChangeText={datebirth => console.log(datebirth)}
                            ref={(input) => { this.birth_date = input }}
                            blurOnSubmit={false}
                            />
                        {
                            is_datepicker ? (
                            <DateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={athlete_data.birth_date_val != '' ? athlete_data.birth_date_val : new Date()}
                                mode={'date'}
                                maximumDate={new Date()}
                                display="spinner"
                                onChange={(event, selectedDate) =>
                                ChangeInput(selectedDate, 'birth_date') &&
                                this.datePickerAction()
                                }
                            />
                            ) :<></>
                        }
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Gender</Text>
                    <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                        <Picker
                            selectedValue={athlete_data.gender}
                            onValueChange={(itemValue, itemIndex) =>
                                ChangeInput(itemValue, 'gender')
                            }>
                            <Picker.Item label={'Pilih Gender'} value={''} />
                            <Picker.Item label={'Male'} value={1} />
                            <Picker.Item label={'Female'} value={0} />
                        </Picker>
                    </View>
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Grade</Text>
                    <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                        <Picker
                            selectedValue={athlete_data.grade.id}
                            onValueChange={(itemValue, itemIndex) =>
                                ChangeInput(itemValue, 'grade')
                            }>
                            <Picker.Item label={'Pilih Grade'} value={''} />
                            {
                                grade_arr.map((data, index)=>(
                                <Picker.Item label={data.grade} value={data.id} key={index} />
                                ))
                            }
                        </Picker>
                    </View>
                </View>

                <View style={{marginTop : 8}}>
                    <View style={{flexDirection : 'row'}}>
                        <View style={{flex : 1, paddingRight : 8}}>
                            <Text>Weight(Kg)</Text>
                            <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                            <TextInput 
                                value={athlete_data.weight.toString()}
                                onChangeText={text=>ChangeInput(text, 'weight')}
                                style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                                placeholder={'Weight(Kg)'}
                                returnKeyType={"next"}
                                editable={true}
                                keyboardType={'numeric'}
                                ref={(input) => { this.weight = input }}
                                onSubmitEditing={() => { this.height.focus() }} />
                            </View>
                        </View>
                        <View style={{flex : 1, paddingLeft : 8}}>
                            <Text>Height(cm)</Text>
                            <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                            <TextInput 
                                value={athlete_data.height.toString()}
                                onChangeText={text=>ChangeInput(text, 'height')}
                                style={{padding : 8, backgroundColor : 'white', borderRadius : 4, marginTop : 4}} 
                                placeholder={'Height(cm)'}
                                returnKeyType={"next"}
                                editable={true}
                                keyboardType={'numeric'}
                                ref={(input) => { this.height = input }}
                                onSubmitEditing={() => null } />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{marginTop : 8}}>
                    <Text>Division</Text>
                    <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                        <Picker
                            selectedValue={athlete_data.division.id}
                            onValueChange={(itemValue, itemIndex) =>
                                ChangeInput(itemValue, 'division')
                            }>
                            <Picker.Item label={'Pilih Posisi'} value={''} />
                            {
                                division_arr.map((data, index)=>(
                                <Picker.Item label={data.name} value={data.id} key={index} />
                                ))
                            }
                        </Picker>
                    </View>
                </View>
                <View style={{marginTop : 8}}>
                    <Text>Class</Text>
                    <View style={{backgroundColor : 'white', borderRadius : 4, marginTop : 4}}>
                        <Picker
                            selectedValue={athlete_data.class.id}
                            onValueChange={(itemValue, itemIndex) =>
                                ChangeInput(itemValue, 'class')
                            }>
                            <Picker.Item label={'Pilih Class'} value={''} />
                            {
                                class_arr.map((data, index)=>(
                                <Picker.Item label={data.name} value={data.id} key={index} />
                                ))
                            }
                        </Picker>
                    </View>

                    <Text style={{color : Style.colors.red70p}}>Please pick gender before pick class</Text>
                </View>
            
            </>
        );
    }
}