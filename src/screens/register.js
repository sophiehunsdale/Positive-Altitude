import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import 'firebase/firestore';
import * as firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import colors from './styles/colors';
import logo from '../images/logo.png';

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      displayName: '',
      isLoading: false,
    };
  }

  updateInputVal = (val, prop) => {
    const { state } = this;
    state[prop] = val;
    this.setState(state);
  }

  register = () => {
    if (this.state.email === '' || this.state.password < 7 || this.state.displayName === '') {
      Alert.alert('Enter all details to register.');
    } else {
      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            Alert.alert('Your password is too weak.');
            this.props.navigation.navigate('Register')
          } else if (errorCode === 'auth/email-already-in-use') {
            Alert.alert('Email is already in use');
            this.props.navigation.navigate('Register')
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert('Email is invalid');
            this.props.navigation.navigate('Register')
          } else if (errorCode === 'auth/operation-not-allowed') {
            Alert.alert('Something has gone wrong!');

          } else {
            alert(errorMessage);
          }
          console.log(error);
        }).then((res) => {
          firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).set({
            displayName: this.state.displayName,
          }),
            res.user.updateProfile({
              displayName: this.state.displayName,
            });
          console.log('User Registered Successfully!');
          this.setState({
            isLoading: false,
            displayName: '',
            email: '',
            password: '',
          });
          Alert.alert('User Registered Successfully!');
          this.props.navigation.navigate('Login');
        })
        .catch((error) => this.setState({ errorMessage: error.message }));
      this.props.navigation.navigate('Register');
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View />
      );
    }
    return (

      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>
        <Text style={styles.registerText}>Register</Text>
        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              autoCorrect={false}
              autoCapitalize="words"
              placeholder="Display Name"
              value={this.state.displayName}
              onChangeText={(val) => this.updateInputVal(val, 'displayName')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Email"
              autoCorrect={false}
              autoCapitalize="none"
              value={this.state.email}
              keyboardType="email-address"
              onChangeText={(val) => this.updateInputVal(val, 'email')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              maxLength={15}
              secureTextEntry
              placeholder="Password"
              value={this.state.password}
              onChangeText={(val) => this.updateInputVal(val, 'password')}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => this.register()}
              style={[styles.register, { backgroundColor: colors.jade }]}
            >
              <AntDesign name="plus" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.text}>
            <Text style={styles.signInCont}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.signInButton}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

    );
  }
}

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
  registerText: {
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
  register: {
    padding: 16,
    borderRadius: 4,
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
  signInCont: {
    fontSize: 16,
    color: colors.jade,
  },
  signInButton: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.moss,
  },
});

Register.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};