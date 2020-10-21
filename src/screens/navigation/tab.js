import * as React from 'react';
import {
  Entypo,
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from '../home';
import Todo from '../todo';
import colors from '../styles/colors';
import ThingsToKnow from '../thingsToKnow';
import CurrentLocation from '../currentLocation';

const Tab = createMaterialBottomTabNavigator();

export default function TabNav() {
  return (
    <Tab.Navigator
      activeColor={colors.white}
      initialRouteName="Explore"
      inactiveColor={colors.pebble}
      tabBarOptions={{ showlabel: false }}
      barStyle={{ backgroundColor: colors.jade }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <AntDesign
              size={24}
              name="home"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Current Location"
        component={CurrentLocation}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <Entypo
              size={24}
              color={color}
              name="location-pin"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Things To Know"
        component={ThingsToKnow}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={24}
              color={color}
              name="lightbulb-on-outline"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Todos"
        component={Todo}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              size={24}
              name="ios-list"
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

TabNav.propTypes = {
  color: PropTypes.string,
};

TabNav.defaultProps = {
  color: colors.white,
};
