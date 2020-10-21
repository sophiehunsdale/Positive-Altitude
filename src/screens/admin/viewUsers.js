import React, { Component } from 'react';
import {
  StyleSheet, View, Image, Text, FlatList, SafeAreaView, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import colors from '../styles/colors';

export default class ViewUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    firebase.firestore()
      .collection('Users')
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const { displayName, type, email } = doc.data();
          list.push({
            id: doc.id,
            displayName,
            type,
            email,
          });
        });
        this.setState({
          users: list,
        });
      });
  }

  componentWillUpdate() {
    this.componentDidMount();
  }
  deleteUser = (id, index) => {
    const { users } = this.state;

    firebase.firestore().collection('Users').doc(id)
      .delete()
      .then(() => {
        users.splice(index, 1);
        this.setState({ users });
        console.log('Deleted!');
      });
  }

  render() {
    const { users } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="md-arrow-back"
            size={24}
            style={styles.back}
            color={colors.white}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Users</Text>
        </View>
        <FlatList
          numColumns={1}
          horizontal={false}
          style={styles.cardContainer}
          contentContainerStyle={styles.contentContainer}
          data={users}
          renderItem={({ item, index }) => (

            <View style={{ width: 400 }}>
              <View style={styles.card}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardText}>{item.displayName}</Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => this.deleteUser(item.id, index)} style={styles.deleteButton}>
                      <MaterialCommunityIcons name="trash-can-outline" size={24} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.cardDescription}>
                  <Text style={{ color: colors.pebble }}>
                    User Type:
                    {' '}
                    {item.type}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.jade,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
    borderRadius: 6,
    height: 50,
    marginTop: 5,
    paddingHorizontal: 16,
    fontSize: 18,
  },

  deleteButton: {
    paddingVertical: 16,
    alignSelf: 'flex-end',
  },
  header: {
    height: 75,
    paddingLeft: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.jade,
  },
  headerText: {
    fontSize: 25,
    color: colors.white,
    paddingTop: 10,
    textAlign: "center",
    width: '80%'
  },
  back: {
    color: colors.white,
    paddingTop: 20,
    paddingLeft: 15,
  },
  contentContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 8,
    width: '97%',
  },
  textContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    paddingLeft: 32,
    width: '90%',
  },
  cardText: {
    fontSize: 25,
    color: colors.pebble,
  },
  card: {
    padding: 20,
    width: '96%',
    borderRadius: 20,
    marginBottom: 10,
    marginLeft: '2%',
    borderColor: colors.lightjade,
    borderWidth: 3,
    backgroundColor: colors.jade,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  cardDescription: {
    paddingLeft: 32,
    padding: 15,
    textAlign: 'left',
  },
});

ViewUsers.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};