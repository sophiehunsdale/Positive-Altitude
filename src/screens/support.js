import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import { Fontisto, AntDesign, Ionicons } from '@expo/vector-icons';
import colors from './styles/colors';
import logo from '../images/logo.png';

export default class Support extends Component {
  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            size={24}
            style={styles.back}
            name="md-arrow-back"
            color={colors.white}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Support</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>

        <View style={[styles.info, { paddingTop: 50 }]}>
          <Text>Ask us any questions, and we'll help you find a solution!</Text>
        </View>
        <View style={styles.info}>
          <Text>{'Want us to add a new climbing route location? \nLet us know!'}</Text>
        </View>
        <Text style={styles.title}>Contact Us</Text>
        <View style={styles.info}>
          <Fontisto name="email" size={24} style={{ paddingRight: 20 }} />
          <Text> sophiehunsdale@hotmail.com</Text>
        </View>
        <View style={styles.info}>
          <AntDesign name="phone" size={24} style={{ paddingRight: 20 }} />
          <Text> 028 9097 4669</Text>
        </View>
      </SafeAreaView>
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
    justifyContent: 'flex-start',
    backgroundColor: colors.jade,
  },
  headerText: {
    fontSize: 25,
    paddingTop: 10,
    paddingLeft: 120,
    color: colors.white,
  },
  logoContainer: {
    paddingTop: '20%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  back: {
    paddingTop: 20,
    paddingLeft: 15,
    color: colors.white,
  },
  formContainer: {
    flex: 1,
    padding: 35,
  },
  title: {
    opacity: 0.9,
    fontSize: 25,
    marginTop: 40,
    color: colors.jade,
    textAlign: 'center',
  },
  info: {
    padding: 10,
    paddingLeft: 40,
    textAlign: 'left',
    flexDirection: 'row',
  },
});

Support.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
