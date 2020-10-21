import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default class AddThingsToKnow extends Component {
  constructor() {
    super();
    this.database = firebase.firestore().collection('thingsToKnow');
    this.state = {
      img: '',
      title: '',
      description: '',
      isLoading: false,
    };
  }

  inputValueUpdate = (val, prop) => {
    const { state } = this;
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
    const path = `thingsToKnow${imageName}/${time}`;

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

  storeThingsToKnow() {
    if (
      this.state.img === ''
      || this.state.title === ''
      || this.state.description === ''
    ) {
      alert('Please complete all details');
    } else {
      this.setState({
        isLoading: true,
      });
      this.database.add({
        img: this.state.img,
        title: this.state.title,
        description: this.state.description,
      }).then((res) => {
        this.setState({
          img: '',
          title: '',
          description: '',
          isLoading: false,
        });
        this.props.navigation.navigate('viewThingsToKnow');
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

    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color={colors.night} />
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
          <Text style={styles.headerText}>Add New Thing To Know</Text>
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
              returnKeyType="next"
              placeholder="Description"
              value={this.state.description}
              onChangeText={(val) => this.inputValueUpdate(val, 'description')}
            />
          </View>
          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.button}>
              <MaterialCommunityIcons
                size={30}
                color={colors.fog}
                style={styles.camera}
                name="camera-plus-outline"
                onPress={this.onPressButton}
              />
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', color: colors.fog }}>{this.state.img}</Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.addRoute, { backgroundColor: colors.night }]}
              onPress={() => this.storeThingsToKnow()}
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
    fontSize: 22,
    width: '80%',
    paddingTop: 10,
    paddingLeft: 20,
    color: colors.white,
  },
  camera: {
    alignSelf: 'flex-start',
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
    borderBottomColor: colors.night,
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

AddThingsToKnow.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
