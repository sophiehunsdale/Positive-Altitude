
import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import colors from './styles/colors';
import logo from '../images/logo.png';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: ""
    };
  }
  handleEmailChange = email => {
    this.setState({ email: email });
  };
  submitEmail = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(function () {
        Alert.alert("Email Sent");
      })
      .catch(function (error) {
        Alert.alert(error.message);
      });
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>
        <Text style={styles.loginText}> Forgot your password? </Text>
        <ScrollView style={styles.formContainer}>
          <Text style={styles.forgotPasswordSubheading}>
            Enter your email to find your account
            </Text>
          <View style={styles.inputGroup}>
            <TextInput
              autoCorrect={false}
              placeholder="Email Address"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={email => this.handleEmailChange(email)}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.forgotPasswordButton, { backgroundColor: colors.jade }]}
              onPress={() => this.submitEmail(this.state.email)}
            >
              <AntDesign name="unlock" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.footer}>
              <Ionicons
                size={45}
                style={styles.back}
                name="md-arrow-back"
                color={colors.jade}
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        </ScrollView >
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 75,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordButton: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingTop: 20,
  },
  back: {
    color: colors.jade,
  },
  logoContainer: {
    paddingTop: '20%',
    alignItems: 'center',
  },
  inputGroup: {
    flex: 1,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.jade,
  },
  logo: {
    width: 150,
    height: 150,
  },
  loginText: {
    fontSize: 20,
    color: colors.moss,
    textAlign: 'center',
    paddingVertical: 16,
  },
  formContainer: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.jade,
  },
  forgotPasswordSubheading: {
    fontSize: 18,
    fontWeight: "300",
    paddingBottom: 30,
    color: colors.jade,
  },
});

ForgotPassword.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
