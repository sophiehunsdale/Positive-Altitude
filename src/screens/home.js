import React, { Component } from 'react'; import {
  View,
  Text,
  Alert,
  Image,
  Linking,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import debounce from 'lodash/debounce';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import mapsIcon from '../images/mapsicon.jpg';
import colors from './styles/colors';

const CarouselItem = (props) => {
  const {
    item, openMapsApp,
  } = props;

  const {
    lat,
    img,
    long,
    crag,
    title,
    grade,
    height,
    pitches,
  } = item;

  return (
    <View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cragText}>
          {crag}
        </Text>
        <View style={styles.cardInfo}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.onyx, fontWeight: 'bold' }}>
              Grade:
            </Text>
            <Text>
              {grade}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.onyx, fontWeight: 'bold' }}>
              Height:
            </Text>
            <Text>
              {height}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.onyx, fontWeight: 'bold' }}>
              Pitches:
            </Text>
            <Text>
              {pitches}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.cardImage} source={{ uri: img }} />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => openMapsApp({ lat, long })}>
        <Image style={styles.googlemaps} source={mapsIcon} />
      </TouchableOpacity>
    </View>
  );
};
export default class Home extends Component {
  markers = [];
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

  retrieveClimbingRoutes = debounce((value = '') => {
    firebase.firestore()
      .collection('climbing-routes').orderBy('title').startAt(value)
      .endAt(`${value}\uf8ff`)
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const {
            title, description, crag, grade, height, img, location, pitches, lat, long,
          } = doc.data();

          list.push({
            lat,
            img,
            long,
            crag,
            title,
            grade,
            height,
            pitches,
            location,
            id: doc.id,
            description,
          });
        });

        this.setState({ climbingRoutes: list });
      })
      .catch((error) => {
        console.error('getting climbing-routes from database failed', error);
      })
      .finally(() => {
        this.setState({ searching: false });
      });
  }, 500);

  markers = [];

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      queryString: '',
      searching: false,
      climbingRoutes: [],
    };

    this.retrieveClimbingRoutes();
    this.getLocationAsync();
  }

  onCarouselItemChange = (index) => {
    const { markers } = this;
    const { climbingRoutes } = this.state;

    const marker = markers[index];
    const location = climbingRoutes[index];

    this.map.animateToRegion({
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
      latitude: location.lat,
      longitude: location.long,
    });

    marker.showCallout();
  }

  onSearch = (value) => {
    this.setState({ queryString: value, searching: true }, this.retrieveClimbingRoutes(value));
  }

  getLocationAsync = () => {
    Location.hasServicesEnabledAsync().then((res) => {
      console.info('hasServicesEnabledAsync', res);
    }).catch((error) => {
      console.error('hasServicesEnabledAsync', error);
    });

    Location.requestPermissionsAsync().then((res) => {
      if (!res.granted) {
        Alert.alert('We need your permission to access your location.');
      }
    }).catch((error) => {
      console.error('requestPermissionsAsync', error);
    });

    Location.getCurrentPositionAsync({
      timeout: 10000,
      maximumAge: 1000,
      accuracy: Location.Accuracy.BestForNavigation,
    }).then((res) => {
      const { coords: { latitude, longitude } } = res;
      const region = {
        latitude,
        longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      };

      this.setState({ region });
    }).catch((error) => {
      Alert.alert('We can\'t get your current position.');
    });
  }

  openMapsApp = ({ lat, long }) => {
    const latLngUri = encodeURIComponent(`${lat} ${long}`);

    if (Platform.OS === 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${latLngUri}`);
    } else {
      Linking.openURL(`http://maps.google.com/?daddr=${latLngUri}`);
    }
  }

  onMarkerPressed = (location, index) => {
    this.map.animateToRegion({
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    this.carousel.snapToItem(index);
  }

  setMarker = (index, ref) => {
    const { markers } = this;
    if (markers[index] === ref) return;

    markers[index] = ref;
    this.markers = markers;
  }

  render() {
    const { navigation } = this.props;
    const {
      region, climbingRoutes, queryString, searching,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            size={24}
            name="ios-menu"
            color={colors.onyx}
            style={styles.burger}
            onPress={() => navigation.toggleDrawer()}
          />
          <Text style={styles.headerText}>Home</Text>
        </View>

        <View style={styles.searchBar}>
          <MaterialIcons
            size={24}
            name="search"
            color={colors.lightjade}
            style={{ flex: 1, paddingHorizontal: 12 }}
          />
          <TextInput
            value={queryString}
            style={styles.input}
            onChangeText={this.onSearch}
            placeholder="Search Climbing Route Titles"
          />
          <View style={{ width: 50 }}>
            {searching && <ActivityIndicator color="#000" style={{ color: colors.lightjade }} />}
          </View>
        </View>

        <View style={styles.noItemsView}>
          {queryString.length > 0 && climbingRoutes.length === 0 && searching === false
            && <Text style={styles.noItemsText}>No items match your search</Text>}

        </View>

        <MapView
          showsCompass
          showsTraffic
          loadingEnabled
          showsUserLocation
          style={styles.map}
          showsMyLocationButton
          initialRegion={region}
          ref={(map) => { this.map = map; }}
        >
          {climbingRoutes.map((marker, index) => (
            <Marker
              key={marker.id}
              title={marker.title}
              identifier={marker.id}
              ref={(ref) => this.setMarker(index, ref)}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{ latitude: marker.lat, longitude: marker.long }}
            >
              <Callout>
                <Text>{marker.title}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <Carousel
          isLooped
          itemWidth={300}
          data={climbingRoutes}
          removeClippedSubviews={false}
          containerCustomStyle={styles.carousel}
          sliderWidth={Dimensions.get('window').width}
          ref={(carousel) => { this.carousel = carousel; }}
          onSnapToItem={(index) => this.onCarouselItemChange(index)}
          renderItem={(carouselItem) => (
            <CarouselItem
              {...carouselItem}
              openMapsApp={this.openMapsApp}
            />
          )}
        />
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
  searchBar: {
    height: 40,
    borderRadius: 6,
    borderColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 10,
    fontSize: 18,
    height: '100%',
  },
  headerText: {
    fontSize: 25,
    width: '80%',
    paddingTop: 10,
    paddingLeft: 125,
    color: colors.white,
  },
  burger: {
    paddingTop: 20,
    paddingLeft: 15,
    color: colors.white,
  },
  map: {
    flex: 6,
  },
  carousel: {
    bottom: 0,
    paddingBottom: 10,
    position: 'absolute',
  },
  cardContainer: {
    width: 300,
    padding: 5,
    height: 190,
    borderRadius: 24,
    backgroundColor: colors.lightjade,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    alignSelf: 'center',
  },
  cardText: {
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  cragText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.onyx,
    textAlign: 'center',
  },
  card: {
    width: '96%',
    borderRadius: 30,
    marginBottom: 10,
    marginLeft: '2%',
    shadowOpacity: 1,
    shadowColor: 'grey',
    backgroundColor: colors.lightjade,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  cardImage: {
    padding: 5,
    height: 100,
    width: '70%',
    resizeMode: 'cover',
  },
  cardInfo: {
    fontWeight: '800',
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  button: {
    paddingTop: 5,
    alignItems: 'flex-end',
  },
  googlemaps: {
    width: 35,
    height: 35,
    borderRadius: 4,
    justifyContent: 'flex-end',
  },

});

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
  }).isRequired,
};

CarouselItem.propTypes = {
  openMapsApp: PropTypes.func.isRequired,
  item: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    long: PropTypes.number.isRequired,
    crag: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    grade: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    pitches: PropTypes.number.isRequired,
  }).isRequired,
};
