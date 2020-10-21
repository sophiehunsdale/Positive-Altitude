import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
import colors from './styles/colors';
import logo from '../images/logo.png';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      email: '',
      password: '',
      loading: false,
    });
  }

  loginUser = (email, password) => {
    this.setState({ loading: true }, () => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.setState({ loading: false });
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          Alert.alert('Password is incorrect.');
        } else if (errorCode === 'auth/invalid-email') {
          Alert.alert('Email is incorrect.');
        } else {
          Alert.alert(errorMessage);
        }
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const {
      email,
      loading,
      password,
    } = this.state;

    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>
        <Text style={styles.loginText}> Welcome back </Text>
        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              autoCorrect={false}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              secureTextEntry
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Password"
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              disabled={loading}
              style={[styles.login, { backgroundColor: colors.jade }]}
              onPress={() => this.loginUser(email, password, navigate)}
            >
              <AntDesign name="login" size={24} color={colors.white} />

            </TouchableOpacity>
            <View style={styles.text}>
              <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordButton}> Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {loading
              && (
                <View>
                  <ActivityIndicator />
                  <Text style={styles.registerTextCont}>Logging in ...</Text>
                </View>
              )}
          </View>

          <View style={styles.text}>
            <Text style={styles.registerTextCont}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigate('Register')}>
              <Text style={styles.registerButton}> Register </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    paddingTop: '20%',
    alignItems: 'center',
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
  login: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingTop: 20,
  },
  text: {
    flexGrow: 1,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  forgotPasswordButton: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.moss,
  },
  registerTextCont: {
    fontSize: 16,
    color: colors.jade,
  },
  registerButton: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.moss,
  },
});
