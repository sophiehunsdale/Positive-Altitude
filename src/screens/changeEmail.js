import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from './styles/colors';
import logo from '../images/logo.png';

export default class ChangeEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newEmail: '',
    };
  }
  reauthenticate = (currentPassword) => {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  onChangeEmailPress = () => {
    const { currentPassword, newEmail } = this.state;
    this.reauthenticate(currentPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.updateEmail(newEmail)
          .then(() => {
            Alert.alert('Email was changed');
          }).catch((error) => {
            Alert.alert(error.message);
          });
      }).catch((error) => {
        Alert.alert(error.message);
      });
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;

    const { currentPassword, newEmail } = this.state;

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
          <Text style={styles.headerText}>Change Email</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              secureTextEntry
              returnKeyType="next"
              value={currentPassword}
              placeholder="Current Password"
              onChangeText={(text) => { this.setState({ currentPassword: text }); }}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              value={newEmail}
              returnKeyType="next"
              placeholder="New Email"
              keyboardType="email-address"
              onChangeText={(text) => { this.setState({ newEmail: text }); }}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => this.onChangeEmailPress()}
              style={[styles.addRoute, { backgroundColor: colors.jade }]}
            >
              <AntDesign
                size={16}
                name="plus"
                color={colors.white}
              />
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
    paddingLeft: 80,
    width: '80%',
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
  inputGroup: {
    flex: 1,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.jade,
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

ChangeEmail.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
