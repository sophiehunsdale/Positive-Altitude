import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default class AdminHome extends Component {
  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            size={24}
            style={styles.back}
            name="md-arrow-back"
            color={colors.white}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Admin Home </Text>
        </View>

        <View style={{ marginTop: 100, alignItems: 'center' }}>
          <View>
            <Text style={[styles.title, { color: colors.fog }]}> Climbing Routes </Text>
          </View>
          <View style={{ marginVertical: 30, flexDirection: 'row' }}>
            <View>
              <TouchableOpacity
                style={[styles.addList, { borderColor: colors.fog }]}
                onPress={() => this.props.navigation.navigate('AddClimbingRoutes')}
              >
                <AntDesign name="plus" size={24} color={colors.fog} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingLeft: 20 }}>
              <TouchableOpacity
                style={[styles.addList, { borderColor: colors.fog }]}
                onPress={() => this.props.navigation.navigate('ViewClimbingRoutes')}
              >
                <MaterialCommunityIcons name="magnify" size={24} color={colors.fog} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 100, alignItems: 'center' }}>
            <View>
              <Text style={[styles.title, { color: colors.night }]}> Things To Know </Text>
            </View>
            <View style={{ marginVertical: 30, flexDirection: 'row' }}>
              <View>
                <TouchableOpacity
                  style={[styles.addList, { borderColor: colors.night }]}
                  onPress={() => this.props.navigation.navigate('AddThingsToKnow')}
                >
                  <AntDesign name="plus" size={24} color={colors.night} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingLeft: 20 }}>
                <TouchableOpacity
                  style={[styles.addList, { borderColor: colors.night }]}
                  onPress={() => this.props.navigation.navigate('ViewThingsToKnow')}
                >
                  <MaterialCommunityIcons name="magnify" size={24} color={colors.night} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 100, alignItems: 'center' }}>
            <View>
              <Text style={[styles.title, { color: colors.glass }]}> Users </Text>
            </View>
            <View style={{ marginVertical: 30, flexDirection: 'row' }}>
              <View>
                <TouchableOpacity
                  style={[styles.addList, { borderColor: colors.glass }]}
                  onPress={() => this.props.navigation.navigate('AddUsers')}
                >
                  <AntDesign name="plus" size={24} color={colors.glass} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingLeft: 20 }}>
                <TouchableOpacity
                  style={[styles.addList, { borderColor: colors.glass }]}
                  onPress={() => this.props.navigation.navigate('ViewUsers')}
                >
                  <MaterialCommunityIcons name="magnify" size={24} color={colors.glass} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 75,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fog,
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 25,
    paddingTop: 10,
    width: '80%',
    paddingLeft: 90,
    color: colors.white,
  },
  title: {
    fontSize: 25,
    color: colors.night,
  },
  back: {
    paddingTop: 20,
    paddingLeft: 15,
    color: colors.onyx,
  },
  addList: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 4,
  },
});

AdminHome.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
