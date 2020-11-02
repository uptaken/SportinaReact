import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment'
import Snackbar from 'react-native-snackbar'

export default class Base extends Component {

	host = 'http://sportina-v2.quantumtri.com'
	url = this.host;
	url_image = this.url + '/image';

	priceFormat = 'id-ID'
	pickerMode = 'dropdown'
	
	axios = axios;
	moment = moment;

	logo = require('../assets/images/png/ic_sportina_logotext1.png');
	competition_example = require('../assets/images/png/competition.jpg');
	no_profile_picture = require('../assets/images/png/no_profile_picture.png');
	no_image = require('../assets/images/jpg/no_image_available.jpeg');

	hotel = require('../assets/images/png/hotel.jpg');
	hotel_1 = require('../assets/images/png/hotel_1.jpg');
	
	constructor(props) {
		super(props);
	}

	alertSnackbar(message){
		Snackbar.show({
			text: message,
			duration: Snackbar.LENGTH_SHORT,
		});
	}
}
