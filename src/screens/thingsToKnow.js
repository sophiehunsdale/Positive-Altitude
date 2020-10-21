import React, { Component } from 'react';
import {
  StyleSheet, View, Image, Text, FlatList, SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import colors from './styles/colors';

class ThingsToKnow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thingsToKnow: [],
    };
  }
  componentDidMount() {
    firebase.firestore()
      .collection('thingsToKnow')
      .orderBy('title')
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const { title, description, img } = doc.data();
          list.push({
            id: doc.id,
            img,
            title,
            description,
          });
        });
        this.setState({
          thingsToKnow: list,
        });
      });
  }
  componentWillUpdate() {
    this.componentDidMount();
  }

  render() {
    const { thingsToKnow } = this.state;
    const { navigation } = this.props;

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
          <Text style={styles.headerText}>Things To Know  </Text>
        </View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={thingsToKnow}
          style={styles.cardContainer}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <View>
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
                <Image style={styles.cardImage} source={{ uri: item.img }} />
                <View style={styles.cardDescription}>
                  <Text style={{ color: colors.pebble }}>
                    {' '}
                    {item.description}
                    {' '}
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

ThingsToKnow.propTypes = {

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.jade,
  },
  input: {
    height: 50,
    marginTop: 5,
    fontSize: 18,
    borderRadius: 6,
    borderColor: 'grey',
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
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
    paddingTop: 10,
    width: '80%',
    paddingLeft: 60,
    color: colors.white,
  },
  back: {
    paddingTop: 20,
    paddingLeft: 15,
    color: colors.white,
  },
  contentContainer: {
    width: '97%',
    paddingTop: 8,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardText: {
    padding: 10,
    fontSize: 25,
    color: colors.pebble,
  },
  card: {
    padding: 20,
    width: '96%',
    borderWidth: 3,
    borderRadius: 20,
    marginBottom: 10,
    marginLeft: '2%',
    backgroundColor: colors.jade,
    borderColor: colors.lightjade,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  cardImage: {
    height: 200,
    width: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  cardDescription: {
    padding: 15,
    textAlign: 'left',
  },
});

export default ThingsToKnow;

ThingsToKnow.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
