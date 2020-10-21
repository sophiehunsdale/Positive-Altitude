import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { Ionicons, AntDesign, Fontisto } from '@expo/vector-icons';
import colors from './styles/colors';

export default class Settings extends Component {
  refreshScreen() {
    this.setState({ lastRefresh: Date(Date.now()).toString() })
  }
  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const user = firebase.auth().currentUser;

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
          <Text style={styles.headerText}>Settings </Text>

          <Ionicons name="ios-refresh"
            size={24}
            color={colors.white}
            onPress={() => this.refreshScreen()}
            style={{ alignItems: 'flex-end', paddingTop: 20 }}
          />
        </View>

        <View>
          <View style={styles.profile}>
            <Text style={styles.name}>{user.displayName}</Text>
            <Text style={styles.current}>
              Email:
              {' '}
              {user.email}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <View>
            <Text style={[styles.title, { color: colors.jade }]}> Change Email </Text>
          </View>
          <View style={{ marginVertical: 30, width: 150 }}>
            <View>
              <TouchableOpacity
                style={[styles.addList, { borderColor: colors.jade }]}
                onPress={() => this.props.navigation.navigate('ChangeEmail')}
              >
                <Fontisto name="email" size={30} color={colors.jade} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <View>
              <Text style={[styles.title, { color: colors.jade }]}> Change Password </Text>
            </View>
            <View style={{ marginVertical: 30, width: 150 }}>
              <View>
                <TouchableOpacity
                  style={[styles.addList, { borderColor: colors.jade }]}
                  onPress={() => this.props.navigation.navigate('ChangePassword')}
                >
                  <AntDesign name="lock" size={30} color={colors.jade} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <View>
              <Text style={[styles.title, { color: colors.jade }]}> Delete Account </Text>
            </View>
            <View style={{ marginVertical: 30, width: 150 }}>
              <View>
                <TouchableOpacity
                  style={[styles.addList, { borderColor: colors.jade }]}
                  onPress={() => firebase.auth().currentUser.delete()}
                >
                  <AntDesign name="deleteuser" size={30} color={colors.jade} />
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
    justifyContent: 'flex-start',
    backgroundColor: colors.jade,
  },
  headerText: {
    fontSize: 25,
    width: '80%',
    paddingTop: 10,
    paddingLeft: 110,
    color: colors.white,
  },
  profile: {
    marginTop: 64,
    alignItems: 'center',
  },
  name: {
    fontSize: 25,
    fontWeight: '600',
    color: colors.jade,
  },
  current: {
    fontSize: 16,
    paddingTop: 20,
    color: colors.moss,
  },
  title: {
    fontSize: 25,
    color: colors.jade,
  },
  back: {
    paddingTop: 20,
    paddingLeft: 15,
    color: colors.white,
  },
  addList: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
});

Settings.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
