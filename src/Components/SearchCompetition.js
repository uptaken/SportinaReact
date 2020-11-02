import React from 'react';
import {
	View,
	TextInput,
	TouchableHighlight,
} from 'react-native';

import Base from '../Base';
import Style from '../Style/theme'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class SearchCompetition extends Base {
	state = {
	};

	render() {
        const {ChangeInput, searchBtn} = this.props
		return (
            <View style={{flexDirection : 'row'}}>
                <TextInput 
                    style={{padding : 8, flex : 1, backgroundColor : 'white'}} 
                    placeholder={'Search Competition'}
                    returnKeyType={"search"}
                    editable={true}
                    onChangeText={text => ChangeInput(text)}
                    onSubmitEditing={()=>searchBtn()}
                    />
                
                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>searchBtn()}>
                        <View style={{justifyContent : 'center', flex : 1, backgroundColor : Style.colors.colorPrimary, padding : 8, borderTopEndRadius : 4, borderBottomEndRadius : 4}}>
                            <Icon name={'search'} size={28} color={'white'} />
                        </View>
                    </TouchableHighlight>

            </View>		
		);
	}
}