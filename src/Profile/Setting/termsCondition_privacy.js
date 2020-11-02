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
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import ProfileHead from '../../Components/HeadTitle'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class TermsPrivacy extends Base {
	state = {
        title : ''
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
        var title = this.props.route.params.type == 'terms' ? 'Terms & Conditions' : 'Privacy Policy'
        await this.setState({title : title})
    }
    

	render() {
		return (
            <View style={{backgroundColor : Style.colors.bgBase, height : '100%'}}>
            
                <ProfileHead title={this.state.title} />
                

            </View>			
		);
	}
}