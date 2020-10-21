import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons, Entypo } from '@expo/vector-icons';
import colors from './styles/colors';

export default class CurrentLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
    };
    this.getLocationAsync();
  }

  state = {
    currentLatitude: 'unknown',
    currentAltitude: 'unknown',
    currentLongitude: 'unknown',
  };

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') { console.log('We need your permission to access your location.'); }

    const location = await Location.getCurrentPositionAsync({
      timeout: 1000,
      maximumAge: 1000,
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const region = {
      latitudeDelta: 0.045,
      longitudeDelta: 0.045,
      latitude: location.coords.latitude,
      altitude: location.coords.altitude,
      longitude: location.coords.longitude,
    };

    this.setState({ region });
  }


  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentAltitude = JSON.stringify(position.coords.altitude);
        const currentLongitude = JSON.stringify(position.coords.longitude);

        this.setState({ currentLatitude });
        this.setState({ currentAltitude });
        this.setState({ currentLongitude });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      const currentLatitude = JSON.stringify(position.coords.latitude);
      const currentAltitude = JSON.stringify(position.coords.altitude);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      this.setState({ currentLatitude });
      this.setState({ currentAltitude });
      this.setState({ currentLongitude });
    });
  };
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  };

  render() {
    const { region } = this.state;
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
          <Text style={styles.headerText}>Current Location</Text>
        </View>
        <View style={styles.locationContainer}>
          <View>
            <MapView
              showsCompass
              showsUserLocation
              style={styles.map}
              initialRegion={region}
            />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTextTitle}>You Are Here</Text>
            <Text
              style={styles.locationText}
            >
              Longitude:
              {' '}
              {this.state.currentLongitude}
            </Text>
            <Text
              style={styles.locationText}
            >
              Latitude:
              {' '}
              {this.state.currentLatitude}
            </Text>
            <Text
              style={styles.locationText}
            >
              Altitude:
              {' '}
              {this.state.currentAltitude}
            </Text>
            <Entypo name="location-pin" style={{ paddingTop: 30 }} size={84} color={colors.jade} />
          </View>
        </View>
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
    paddingLeft: 68,
    color: colors.white,
  },
  back: {
    paddingTop: 20,
    paddingLeft: 15,
    color: colors.white,
  },
  map: {
    width: 350,
    height: 350,
  },
  locationContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextContainer: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextTitle: {
    fontSize: 35,
    color: colors.moss,
  },
  locationText: {
    fontSize: 18,
    marginTop: 16,
    color: colors.jade,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

CurrentLocation.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
