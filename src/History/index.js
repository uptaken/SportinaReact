import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
	FlatList
} from 'react-native';

import Base from '../Base';
import ListCompetition from '../Components/ListCompetition'
import NoDataFound from '../Components/NoData'

import Style from '../Style/theme'

export default class History extends Base {
	state = {
		data_arr : [
			{id : 1}, {id : 2}, {id : 3},
			{id : 4}, {id : 5}, {id : 6},
			{id : 7}
		]
	};

	static navigationOptions = {
		header: null,
	};

	async componentDidMount() {
	}

	async toDetail(){
		this.props.navigation.navigate('HistoryCompetitionDetail')
	}

	render() {
		return (
            <View style={{backgroundColor : Style.colors.bgBase, flex : 1}}>
                
				<View style={{padding : 16}}>
					<Text>Following Competition</Text>
				</View>

				{/* <FlatList
					data={this.state.data_arr}
					renderItem={({item, index}) => (
						<View style={{flex : 1/2, paddingLeft : index % 2 == 0 ? 0 : 4, paddingRight : index % 2 == 0 ? 4 : 0, marginBottom : 8, paddingBottom : index+1 == this.state.data_arr.length ? 20 : 0}}
						key={index}>
							<ListCompetition key={index} onPressList={()=>this.toDetail()} />
						</View>
					)}
					keyExtractor={(item, index) => index}
					scrollEnabled={true}
					ListEmptyComponent={()=>(
						<NoDataFound />
					)}
					numColumns={2}
					style={{padding : 16, marginBottom : 8}}
					/> */}

            </View>			
		);
	}
}