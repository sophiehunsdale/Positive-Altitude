import {
  Feather,
  Octicons,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import colors from '../styles/colors';

export default function Drawers(props) {
  const { currentUser } = firebase.auth();

  const { navigation } = props;
  const { navigate } = navigation;

  const [user, setUser] = useState({});

  if (isEmpty(user) && currentUser != null) {
    const getUserByIdQuery = firebase.firestore().collection('Users').doc(currentUser.uid);
    getUserByIdQuery.get().then((doc) => {
      if (!doc.exists) {
        setUser({});
      } else {
        setUser(doc.data());
      }
    });
  } else if (!currentUser && !isEmpty(user)) {
    setUser({});
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.jade }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.container}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                <Title style={styles.title}>
                  {`Hello, ${currentUser ? currentUser.displayName : 'Unknown'}`}
                </Title>

              </View>
            </View>

          </View>
          <Drawer.Section style={styles.drawerSection} {...props}>

            <DrawerItem
              icon={({ color, size }) => (

                <FontAwesome5
                  size={size}
                  color={color}
                  name="hands-helping"
                />
              )}
              label="Support"
              onPress={() => {
                navigation.navigate('Support');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (

                <MaterialCommunityIcons
                  size={size}
                  color={color}
                  name="settings-outline"
                />
              )}
              label="Settings"
              onPress={() => { navigate('Settings'); }}
            />

            {user.type === 'Admin'
              && (
                <DrawerItem
                  icon={({ color, size }) => (
                    <Octicons
                      size={size}
                      name="settings"
                      color={color}
                    />
                  )}
                  label="Admin"
                  onPress={() => { navigate('AdminHome'); }}
                />
              )}
          </Drawer.Section>
        </View>

      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (

            <Feather
              size={size}
              name="log-in"
              color={color}
            />
          )}
          label="Sign Out"
          onPress={() => {
            firebase.auth().signOut();
            Alert.alert('User Signed Out Successfully')
          }}
        />
      </Drawer.Section>
    </View>
  );
}

Drawers.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 10,
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    color: colors.white,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    marginRight: 3,
    fontWeight: 'bold',
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: colors.onyx,
  },
  preference: {
    paddingVertical: 12,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
});
