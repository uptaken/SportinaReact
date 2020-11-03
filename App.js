import React from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import 'react-native-gesture-handler/GestureHandler';
import {AsyncStorage} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'

import Logo from './assets/images/png/ic_sportina_logo.png'
import theme from './src/Style/theme'

import IndexApp from './src/index'

import Login from './src/Auth/Login'
import SignUp from './src/Auth/SignUp'
import ForgetPassword from './src/Auth/ForgetPassword'

import Schedule from './src/Schedule'
import History from './src/History'

import PaymentDetail from './src/Payment/Detail'
import Invoice from './src/Payment/Invoice'
import PaidOff from './src/Payment/PaidOff'

import Profile from './src/Profile'
import ProfileSetting from './src/Profile/Setting'
import FormUnitSchool from './src/Profile/Unit_School/form'

import ChangeProfile from './src/Profile/Setting/changeProfile'
import ChangePassword from './src/Profile/Setting/changePassword'
import TermsPrivacy from './src/Profile/Setting/termsCondition_privacy'

import CompetitionDetail from './src/Schedule/Competition/detail'
import CompetitionDetailIndex from './src/Schedule/Competition/indexDetail'
import CompetitionHotel from './src/Schedule/Competition/Hotel'
import CompetitionRegister from './src/Schedule/Competition/Register'
import DivisionClassParticipant from './src/Schedule/Competition/divisionClass_Participant'

import HotelFindRoom from './src/Schedule/Competition/Hotel/findRoom'
import HotelPickRoom from './src/Schedule/Competition/Hotel/pickRoom'

import FormRegister from './src/Schedule/Competition/Register/form'
import RegisterPayout from './src/Payment/payout'
import Topup from './src/Payment/topup'
import RegisterPayoutComplete from './src/Payment/payoutComplete'

import Notification from './src/Notification'

import CompetitionDetailHistory from './src/History/Competition/detail'
import CompetitionHotelHistory from './src/History/Competition/Hotel'
import CompetitionRegisterHistory from './src/History/Competition/Register'

import ListRegisteredHistory from './src/History/Competition/Register/listRegistered'

const Auth = createStackNavigator();
function AuthStack() {
  return (
    <Auth.Navigator>
      <Auth.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Auth.Screen
        name="SignUp"
        component={SignUp}
        options={{...titleBarStyle, 
            title : 'Sign Up'
        }}
      />
      <Auth.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{headerShown: false}}
      />
    </Auth.Navigator>
  );
}

const IndexTab = createBottomTabNavigator();
function IndexStack() {
  return (
    <IndexTab.Navigator
      tabBarOptions={{
        showIcon: true,
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: theme.colors.black70p_hex,
        },
        activeTintColor: 'white',
        inactiveTintColor : theme.colors.white50p
      }}>
      <IndexTab.Screen
        name="ScheduleTab"
        component={Schedule}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({focused, tintColor}) => {
            tintColor = theme.colors.primaryButton;
            return (
              <Icon
                name={'event'}
                size={24}
                color={focused ? 'white' : theme.colors.white50p}
              />
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            navigation.dispatch(
              StackActions.replace('Index', {screen: 'ScheduleTab'}),
            );
          },
        })}
      />
      <IndexTab.Screen
        name="HistoryTab"
        component={History}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({focused, tintColor}) => {
            tintColor = theme.colors.primaryButton;
            return (
              <Icon
                name={'history'}
                size={24}
                color={focused ? 'white' : theme.colors.white50p}
              />
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            navigation.dispatch(
              StackActions.replace('Index', {screen: 'HistoryTab'}),
            );
          },
        })}
      />
      <IndexTab.Screen
        name="PaymentTab"
        component={PaymentStack}
        options={{
          tabBarLabel: 'Payment',
          tabBarIcon: ({focused, tintColor}) => {
            tintColor = theme.colors.primaryButton;
            return (
              <Icon
                name={'explore'}
                size={24}
                color={focused ? 'white' : theme.colors.white50p}
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
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused, tintColor}) => {
            tintColor = theme.colors.primaryButton;
            return (
              <Icon
                name={'account-circle'}
                size={24}
                color={focused ? 'white' : theme.colors.white50p}
              />
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            navigation.dispatch(
              StackActions.replace('Index', {screen: 'ProfileTab'}),
            );
          },
        })}
      />
    </IndexTab.Navigator>
  );
}

const PaymentStackTab = createMaterialTopTabNavigator();

function PaymentStack() {
  return (
    <PaymentStackTab.Navigator
      tabBarOptions = {{
        style : {backgroundColor : theme.colors.black70p_hex},
        activeTintColor : 'white',
        indicatorStyle : {backgroundColor : 'white', height : 4}
      }}>
      <PaymentStackTab.Screen name="Invoice" component={Invoice} />
      <PaymentStackTab.Screen name="Paid Off" component={PaidOff} />
    </PaymentStackTab.Navigator>
  );
}

const CompetitionStackTab = createMaterialTopTabNavigator();

function CompetitionStack() {
  return (
    <CompetitionStackTab.Navigator
      tabBarOptions = {{
        style : {backgroundColor : theme.colors.black70p_hex},
        activeTintColor : 'white',
        indicatorStyle : {backgroundColor : 'white', height : 4}
      }}>
      <CompetitionStackTab.Screen name="Info" component={CompetitionDetail} />
      <CompetitionStackTab.Screen name="Hotel" component={CompetitionHotel} />
      <CompetitionStackTab.Screen name="Register" component={CompetitionRegister} />
    </CompetitionStackTab.Navigator>
  );
}

const HistoryStackTab = createMaterialTopTabNavigator();

function HistoryStack() {
  return (
    <HistoryStackTab.Navigator
      tabBarOptions = {{
        style : {backgroundColor : theme.colors.black70p_hex},
        activeTintColor : 'white',
        indicatorStyle : {backgroundColor : 'white', height : 4}
      }}>
      <HistoryStackTab.Screen name="Info" component={CompetitionDetailHistory} />
      <HistoryStackTab.Screen name="Hotel" component={CompetitionHotelHistory} />
      <HistoryStackTab.Screen name="Register" component={CompetitionRegisterHistory} />
    </HistoryStackTab.Navigator>
  );
}

const titleBarStyle = {
  headerStyle : {
    backgroundColor : theme.colors.colorPrimary,
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    elevation : 0
  },
  headerTintColor : 'white',
  headerLeft: null,
  headerTitle : ()=>(
    <View style={{flexDirection : 'row'}}>
      <View style={{justifyContent : 'center'}}>
        <Image source={Logo} style={{height : 24, aspectRatio : 1}} />
      </View>
      <View style={{justifyContent : 'center', marginLeft : 4}}>
        <Text style={{color : 'white', fontSize : 20}}>SPORTINA</Text>
      </View>
    </View>
  )
}

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="IndexApp"
          component={IndexApp}
          options={{headerShown: false}}
        /> */}
        
        <Stack.Screen
          name="Index"
          component={IndexApp}
          options={({navigation})=>({
            ...titleBarStyle,
            headerRight : ()=>(
              <TouchableHighlight underlayColor={'transparent'} onPress={()=>navigation.navigate('Notification')}>
                <Icon name={'notifications'} size={24} color={'white'} style={{padding : 16}} />
              </TouchableHighlight>
            )
          })}
          
        />

        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="PaymentDetail"
          component={PaymentDetail}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="ProfileSetting"
          component={ProfileSetting}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="FormUnitSchool"
          component={FormUnitSchool}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="ChangeProfile"
          component={ChangeProfile}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="CompetitionDetail"
          component={CompetitionDetailIndex}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="DivisionClassParticipant"
          component={DivisionClassParticipant}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="FormRegister"
          component={FormRegister}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="RegisterPayout"
          component={RegisterPayout}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="TopUp"
          component={Topup}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="RegisterPayoutComplete"
          component={RegisterPayoutComplete}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="HotelFindRoom"
          component={HotelFindRoom}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="HotelPickRoom"
          component={HotelPickRoom}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="Notification"
          component={Notification}
          options={titleBarStyle}
        />

        <Stack.Screen
          name="HistoryCompetitionDetail"
          component={HistoryStack}
          options={titleBarStyle}
        />
        
        <Stack.Screen
          name="ListRegisteredHistory"
          component={ListRegisteredHistory}
          options={titleBarStyle}
        />
        <Stack.Screen
          name="TermsPrivacy"
          component={TermsPrivacy}
          options={titleBarStyle}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;