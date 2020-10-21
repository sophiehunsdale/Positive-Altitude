import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import colors from './styles/colors';

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigate('Home');
      } else {
        navigate('Login');
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.jade} />
      </View>
    );
  }
}

export default LoadingScreen;

LoadingScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
