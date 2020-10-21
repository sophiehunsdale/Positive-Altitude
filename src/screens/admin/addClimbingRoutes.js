import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default class AddClimbingRoutes extends Component {
  constructor() {
    super();
    this.database = firebase.firestore().collection('climbing-routes');
    this.state = {
      img: '',
      lat: '',
      crag: '',
      long: '',
      grade: '',
      title: '',
      height: '',
      pitches: '',
      isLoading: false,
    };
  }
  inputValueUpdate = (val, prop) => {
    const { state } = this;
    debugger;
    state[prop] = val;
    this.setState(state);
  }

  onPressButton = () => {
    Alert.alert(
      'Choose an option',
      'Camera or Gallery',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: this.openCamera,
        },
        {
          text: 'Gallery',
          onPress: this.openImage,
        },
      ],
      { cancelable: false },

    );
  }

  openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.granted === false) {
      return;
    }
    const picker = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (picker.cancelled === true) {

    } else if (picker.cancelled === false) {
      this.uploadPhoto(picker.uri, this.uid);
    }
  }

  openImage = async () => {
    const permission = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permission.granted === false) {
      return;
    }
    const picker = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (picker.cancelled === true) {

    } else if (picker.cancelled === false) {
      this.uploadPhoto(picker.uri, this.uid);
    }
  }

  uploadPhoto = async (url, imageName) => {
    const time = this.timeAccurate;
    const path = `climbing-routes${imageName}/${time}`;

    return new Promise(async (res, rej) => {
      const response = await fetch(url);
      const file = await response.blob();

      const upload = firebase.storage().ref(path).put(file);

      upload.on('state_changed', (snapshot) => { }, (err) => {
        rej(err);
      },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
          this.setState({ img: url });
        });
    });
  };

  setPickerValue(newValue, othervalue) {
    this.setState({
      img: `${newValue} (${othervalue})`,
    });

    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      pickerDisplayed: !this.state.pickerDisplayed,
    });
  }

  storeClimbingRoute() {
    if (
      this.state.crag === ''
      || this.state.img === ''
      || this.state.lat === ''
      || this.state.long === ''
      || this.state.grade === ''
      || this.state.title === ''
      || this.state.height === ''
      || this.state.pitches === ''
    ) {
      alert('Please complete all details');
    } else {
      this.setState({
        isLoading: true,
      });
      this.database.add({
        img: this.state.img,
        lat: this.state.lat,
        crag: this.state.crag,
        long: this.state.long,
        grade: this.state.grade,
        title: this.state.title,
        height: this.state.height,
        pitches: this.state.pitches,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then((res) => {
        this.setState({
          img: '',
          lat: '',
          crag: '',
          long: '',
          grade: '',
          title: '',
          height: '',
          pitches: '',
          isLoading: false,
        });
        this.props.navigation.navigate('viewClimbingRoutes');
      })
        .catch((err) => {
          console.error('Error found: ', err);
          this.setState({
            isLoading: false,
          });
        });
    }
  }
  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;

    const floatLat = parseFloat(this.state.lat);
    const floatLong = parseFloat(this.state.long);

    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color={colors.fog} />
        </View>
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
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Add New Climbing Route </Text>
        </View>
        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              numberOfLines={2}
              placeholder="Title"
              returnKeyType="next"
              value={this.state.title}
              onChangeText={(val) => this.inputValueUpdate(val, 'title')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              numberOfLines={2}
              placeholder="Crag"
              returnKeyType="next"
              value={this.state.crag}
              onChangeText={(val) => this.inputValueUpdate(val, 'crag')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              numberOfLines={2}
              placeholder="Grade"
              returnKeyType="next"
              value={this.state.grade}
              onChangeText={(val) => this.inputValueUpdate(val, 'grade')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              numberOfLines={2}
              returnKeyType="next"
              value={this.state.height}
              keyboardType="number-pad"
              placeholder="Height (metres)"
              onChangeText={(val) => this.inputValueUpdate(val, 'height')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              value={floatLat}
              numberOfLines={2}
              returnKeyType="next"
              placeholder="Latitude"
              keyboardType="number-pad"
              onChangeText={(val) => this.inputValueUpdate(parseFloat(val), 'lat')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              numberOfLines={2}
              value={floatLong}
              returnKeyType="next"
              placeholder="Longitude"
              keyboardType="number-pad"
              onChangeText={(val) => this.inputValueUpdate(parseFloat(val), 'long')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              type={Number}
              numberOfLines={2}
              returnKeyType="next"
              autoCapitalize="none"
              placeholder="Pitches"
              keyboardType="number-pad"
              value={this.state.pitches}
              onChangeText={(val) => this.inputValueUpdate(val, 'pitches')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.button}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={30}
                color={colors.fog}
                style={styles.camera}
                onPress={this.onPressButton}
              />
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center' }}>{this.state.img}</Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => this.storeClimbingRoute()}
              style={[styles.addRoute, { backgroundColor: colors.fog }]}
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
    paddingLeft: 20,
    color: colors.white,
  },
  title: {
    fontSize: 25,
    color: colors.night,
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
    borderBottomColor: colors.fog,
  },
  camera: {
    alignSelf: 'flex-start',
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

AddClimbingRoutes.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
