import React, { Component } from 'react';
import {
  StyleSheet, View, Image, Text, FlatList, SafeAreaView, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default class ViewClimbingRoutes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      climbingRoutes: [],
    };
  }
  componentDidMount() {
    firebase.firestore()
      .collection('climbing-routes')
      .orderBy('createdAt')
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const {
            crag, grade, height, img, lat, long, pitches, title,
          } = doc.data();
          list.push({
            id: doc.id,
            img,
            lat,
            crag,
            long,
            title,
            grade,
            height,
            pitches,
          });
        });
        this.setState({
          climbingRoutes: list,
        });
      });
  }
  deleteClimbingRoute = (id, index) => {
    const { climbingRoutes } = this.state;

    firebase.firestore().collection('climbing-routes').doc(id)
      .delete()
      .then(() => {
        climbingRoutes.splice(index, 1);
        this.setState({ climbingRoutes });
        console.log('Deleted!');
      });
  };
  componentWillUpdate() {
    this.componentDidMount();
  }

  render() {
    const { climbingRoutes } = this.state;
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
          <Text style={styles.headerText}>Climbing Routes</Text>
        </View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={climbingRoutes}
          style={styles.cardContainer}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item, index }) => (
            <View style={{ width: 400 }}>
              <View style={styles.card}>

                <View style={{ flexDirection: 'row', width: '80%' }}>
                  <Text style={styles.cardText}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.deleteClimbingRoute(item.id, index)}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color={colors.white} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.cragText}>
                    {item.crag}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.onyx, fontWeight: 'bold' }}>
                      Grade:
                    </Text>
                    <Text>
                      {item.grade}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.onyx, fontWeight: 'bold' }}>
                      Height:
                    </Text>
                    <Text>
                      {item.height}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.onyx, fontWeight: 'bold' }}>
                      Pitches:
                    </Text>
                    <Text>
                      {item.pitches}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Image style={styles.cardImage} source={{ uri: item.img }} />
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
    height: 50,
    marginTop: 5,
    fontSize: 18,
    borderRadius: 6,
    borderColor: 'grey',
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  deleteButton: {
    paddingVertical: 16,
    alignItems: 'flex-end',
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
    textAlign: "center",
    width: '80%',
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
  cragText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.onyx,
    textAlign: 'center',
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
  cardInfo: {
    fontWeight: '800',
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
});

ViewClimbingRoutes.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
