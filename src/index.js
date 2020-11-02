import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native'
import Style from './Style/theme'
import axios from 'axios';
import moment from 'moment'
import Snackbar from 'react-native-snackbar'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {NavigationContainer, StackActions} from '@react-navigation/native'

import Schedule from './Schedule'
import History from './History'
import Payment from './Payment'
import Profile from './Profile'

export default class AppIndex extends Component {
    state = {
        token : '',
    }

    async componentDidMount(){
    }

    render(){
        const IndexTab = createBottomTabNavigator();
        return(
            <IndexTab.Navigator
                tabBarOptions={{
                    showIcon: true,
                    keyboardHidesTabBar: true,
                    style: {
                    backgroundColor: Style.colors.black70p_hex,
                    },
                    activeTintColor: 'white',
                    inactiveTintColor : Style.colors.white50p
                }}>
                <IndexTab.Screen
                    name="ScheduleTab"
                    component={Schedule}
                    options={{
                    tabBarLabel: 'Schedule',
                    tabBarIcon: ({focused, tintColor}) => {
                        tintColor = Style.colors.primaryButton;
                        return (
                        <Icon
                            name={'event'}
                            size={24}
                            color={focused ? 'white' : Style.colors.white50p}
                        />
                        );
                    },
                    }}
                />
                {/* <IndexTab.Screen
                    name="HistoryTab"
                    component={History}
                    options={{
                    tabBarLabel: 'History',
                    tabBarIcon: ({focused, tintColor}) => {
                        tintColor = Style.colors.primaryButton;
                        return (
                        <Icon
                            name={'history'}
                            size={24}
                            color={focused ? 'white' : Style.colors.white50p}
                        />
                        );
                    },
                    }}
                /> */}
                <IndexTab.Screen
                    name="PaymentTab"
                    component={Payment}
                    options={{
                    tabBarLabel: 'Payment',
                    tabBarIcon: ({focused, tintColor}) => {
                        tintColor = Style.colors.primaryButton;
                        return (
                        <Icon
                            name={'receipt'}
                            size={24}
                            color={focused ? 'white' : Style.colors.white50p}
                        />
                        );
                    },
                    }}
                    listeners={({navigation, route}) => ({
                        tabPress: e => {
                            navigation.dispatch(
                            StackActions.replace('Index', {screen : 'PaymentTab'}),
                            );
                        },
                    })}
                />
                <IndexTab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({focused, tintColor}) => {
                        tintColor = Style.colors.primaryButton;
                        return (
                        <Icon
                            name={'history'}
                            size={24}
                            color={focused ? 'white' : Style.colors.white50p}
                        />
                        );
                    },
                    }}
                />
            </IndexTab.Navigator>
        )
    }
}
