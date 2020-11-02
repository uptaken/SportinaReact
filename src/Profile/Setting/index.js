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
	Button,
    AsyncStorage,
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import ProfileHead from '../../Components/HeadTitle'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class Setting extends Base {
	state = {
		setting_menu : [
            {
                title : 'Profile Setting',
                menu_arr : [
                    {title : 'Change Profile', icon : 'person', nav : 'ChangeProfile', type : ''},
                    {title : 'Change Password', icon : 'vpn-key', nav : 'ChangePassword', type : ''},
                ]
            },
            {
                title : 'About',
                menu_arr : [
                    {title : 'Terms & Conditions', icon : 'help', nav : 'TermsPrivacy', type : 'terms'},
                    {title : 'Privacy Policy', icon : 'error', nav : 'TermsPrivacy', type : 'policy'},
                    {title : 'Give us Rating', icon : 'star', nav : '', type : ''},
                ]
            }
        ]
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
    }
    
    async settingMenuSelected(indexMenu, indexSubMenu){
        var nav = this.state.setting_menu[indexMenu].menu_arr[indexSubMenu].nav
        this.props.navigation.navigate(nav, {type : this.state.setting_menu[indexMenu].menu_arr[indexSubMenu].type, onData : ()=>this.onGetDataBack()})
    }

    async onGetDataBack(){
        this.props.route.params.onData()
        // this.props.navigation.goBack()
    }

    async signOut(){
        await AsyncStorage.clear()
        this.props.navigation.navigate("Auth", {screen : 'Login'})
    }

	render() {
		return (
            <View style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>
            
                <ProfileHead title={'Settings'} />

                <View>
                    {
                        this.state.setting_menu.map((data, index)=>(
                            <View key={index}>
                                <View style={{padding : 16}}>
                                    <Text>{data.title}</Text>
                                </View>

                                <View>
                                {
                                    data.menu_arr.map((data1, index1)=>(
                                        <View style={{marginBottom : 4}} key={index1} >
                                            <TouchableHighlight onPress={()=>this.settingMenuSelected(index, index1)}>
                                                <View style={{flexDirection : 'row', backgroundColor : 'white', padding : 16}}>
                                                    <View>
                                                        <Icon name={data1.icon} size={20} />
                                                    </View>
                                                    <View style={{flex : 1, marginLeft : 16}}>
                                                        <Text>{data1.title}</Text>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    ))
                                }
                                </View>
                            </View>
                        ))
                    }

                    <TouchableHighlight underlayColor={'transparent'} activeOpacity={0.5} onPress={()=>this.signOut()}>
                        <View style={{padding : 16}}>
                                <Text style={{color : Style.colors.red70p}}>Sign Out</Text>
                        </View>
                    </TouchableHighlight>

                    <View style={{marginTop : 8, alignItems : 'center'}}>
                        <Text>Versi Aplikasi 2.2</Text>
                    </View>

                </View>

            </View>			
		);
	}
}