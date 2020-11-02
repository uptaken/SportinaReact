import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    TextInput
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class NoData extends Base {
	state = {
    };
    
    async componentDidMount(){
        if (this.props.onRef != null) {
            this.props.onRef(this);
        }
    }

    async focus() {
        this.textInput.focus();
    }

	render() {
        const {onSubmitEditing} = this.props
		return (
            <View style={{flexDirection : 'row', backgroundColor : 'white', borderRadius : 4}}>
                <TextInput 
                    style={{padding : 8, flex : 1}}
                    placeholder={this.props.passwordData.title}
                    returnKeyType={this.props.returnKeyType}
                    editable={true}
                    ref={input => (this.textInput = input)}
                    onSubmitEditing={()=>null}
                    onChangeText={(value) => this.props.changeInput(value)}
                    secureTextEntry={!this.props.passwordData.is_show} />
                <View style={{justifyContent : 'center', padding : 8}}>
                    <TouchableHighlight onPress={()=>this.props.showPass()} style={{borderRadius : 50/2, padding : 4}} underlayColor={Style.colors.gray_ea}>
                        <Icon name={this.props.passwordData.is_show ? 'visibility' : 'visibility-off'} size={20} />
                    </TouchableHighlight>
                </View>
            </View>
		);
	}
}