import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	View,
} from 'react-native';

import Base from '../../Base';
import Style from '../../Style/theme'
import SearchCompetition from '../../Components/SearchCompetition'
import ListPayment from '../../Components/ListPayment'
import NoDataFound from '../../Components/NoData'

export default class PaidOff extends Base {
	render() {
		const {
			data_arr,
			paymentDetail
		} = this.props
		return (
            <>
			<KeyboardAvoidingView style={{backgroundColor : Style.colors.bgBase}}>
                <View style={{padding : 16, backgroundColor : Style.colors.bgBase}}>
					<SearchCompetition ChangeInput={(value)=>this.changeInput(value)} />
				</View>
            </KeyboardAvoidingView>

			<ScrollView>
				<View style={{padding : 16}}>
				{
					data_arr.map((data, index)=>(
						<ListPayment data={data} toDetail={()=>paymentDetail(index)} key={index} />
					))
				}
				{
					data_arr.length == 0 ? (
						<NoDataFound />
					)
					: <></>
				}
				</View>
			</ScrollView>
			</>
		);
	}
}