import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import colors from '../styles/colors';

export default class AddUsers extends Component {
  constructor() {
    super();
    this.state = {
      type: '',
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
    if (this.state.email === '' || this.state.password < 7 || this.state.displayName === '' || this.state.displayName === '') {
      Alert.alert('Please complete all details to register a user!');
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
          if (errorCode == 'auth/weak-password') {
            Alert.alert('The password is too weak.');
          } else if (errorCode == 'auth/email-already-in-use') {
            Alert.alert('Email is already in use');
          } else if (errorCode == 'auth/invalid-email') {
            Alert.alert('Email is invalid');
          } else if (errorCode == 'auth/operation-not-allowed') {
            Alert.alert('Something has gone wrong!');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        }).then((res) => {
          firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).set({
            displayName: this.state.displayName,
            type: this.state.type,
          }),
            res.user.updateProfile({
              displayName: this.state.displayName,
              type: this.state.type,
            });
          console.log('User Registered Successfully!');
          this.setState({
            isLoading: false,
            displayName: '',
            type: '',
            email: '',
            password: '',
          });
          Alert.alert('User Registered Successfully!');
          this.props.navigation.navigate('viewUsers');
        })
        .catch((error) => this.setState({ errorMessage: error.message }));
    }
  }
  render() {
    const {
      isLoading, displayName, type, email, password,
    } = this.state;
    const { navigation: { goBack } } = this.props;

    if (isLoading) {
      return (
        <View />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            size={24}
            style={styles.back}
            name="md-arrow-back"
            color={colors.white}
            onPress={() => goBack()}
          />
          <Text style={styles.headerText}>Add New User</Text>
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              numberOfLines={2}
              autoCorrect={false}
              value={displayName}
              returnKeyType="next"
              placeholder="Display Name"
              onChangeText={(val) => this.updateInputVal(val, 'displayName')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              value={type}
              numberOfLines={2}
              autoCorrect={false}
              returnKeyType="next"
              placeholder="User Type (User/Admin)"
              onChangeText={(val) => this.updateInputVal(val, 'type')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              value={email}
              numberOfLines={2}
              placeholder="Email"
              autoCorrect={false}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(val) => this.updateInputVal(val, 'email')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              maxLength={15}
              secureTextEntry
              value={password}
              numberOfLines={2}
              returnKeyType="go"
              placeholder="Password"
              onChangeText={(val) => this.updateInputVal(val, 'password')}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => this.register()}
              style={[styles.addRoute, { backgroundColor: colors.glass }]}
            >
              <AntDesign name="plus" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingLeft: 80,
    color: colors.white,
  },
  title: {
    fontSize: 25,
    color: colors.glass,
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
  inputGroup: {
    flex: 1,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass,
  },
  addRoute: {
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingTop: 20,
  },
  preloader: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
