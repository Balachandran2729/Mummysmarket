import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator , TransitionPresets } from '@react-navigation/stack';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../common/colour';
import type { AppStackParamList } from './types';

import HomeScreen from '../../feature/home/HomeScreen';
import CartScreen from '../../feature/cart/CartScreen';
import ProductDetails from '../../feature/home/ProdectDetails';
import SaveProduct from '../../feature/cart/SaveProdect';
import Login from '../../feature/login/Login';

const Tab = createBottomTabNavigator();
const AppStack = createStackNavigator<AppStackParamList>();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <AntDesign
                name="home"
                size={26}
                color={ COLORS.primaryDark}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="add-shopping-cart"
                size={26}
                color={COLORS.primaryDark}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}


const AppNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Login" component={Login} />
      <AppStack.Screen name="MainTabs" component={TabNavigation} />
      <AppStack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
            ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <AppStack.Screen
        name="SaveProduct"
        component={SaveProduct}
        options={{
            ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </AppStack.Navigator>
  );
};

export { TabNavigation, AppNavigator };