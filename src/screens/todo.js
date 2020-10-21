import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from './styles/colors';
import Fire from './firebase/fireFunctions';
import ClimbingToDoList from './climbingToDoList';
import AddClimbingListModal from './addClimbingListModal';

export default class Todo extends Component {
  state = {
    addClimbingToDoVisible: false,
    lists: [],
    user: {},
    loading: true,
  };

  componentDidMount() {
    firebase = new Fire((error, user) => {
      if (error) {
        return alert('Something went wrong');
      }

      firebase.getClimbingLists((lists) => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        });
      });

      this.setState({ user });
    });
  }

  componentWillUnmount() {
    firebase.detach();
  }

  toggleAddClimbingToDoModal() {
    this.setState({ addClimbingToDoVisible: !this.state.addClimbingToDoVisible });
  }

  renderList = (list) => <ClimbingToDoList list={list} updateClimbingList={this.updateClimbingList} />;

  addClimbingList = (list) => {
    firebase.addClimbingList({
      name: list.name,
      color: list.color,
      todos: [],
    });
  };
  updateClimbingList = (list) => {
    firebase.updateClimbingList(list);
  };

  render() {
    const { loading, addClimbingToDoVisible, lists } = this.state;
    const { navigation } = this.props;

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.jade} />
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
          <Text style={styles.headerText}>Todo Lists</Text>
        </View>

        <Modal
          animationType="slide"
          visible={addClimbingToDoVisible}
          onRequestClose={() => this.toggleAddClimbingToDoModal()}
        >
          <AddClimbingListModal
            addClimbingList={this.addClimbingList}
            closeModal={() => this.toggleAddClimbingToDoModal()}
          />
        </Modal>
        <View style={{ marginTop: 100, alignItems: 'center' }}>
          <View>
            <Text style={styles.title}> Add New List</Text>
          </View>

          <View style={{ marginVertical: 30 }}>
            <TouchableOpacity
              style={styles.addClimbingList}
              onPress={() => this.toggleAddClimbingToDoModal()}
            >
              <AntDesign name="plus" size={16} color={colors.jade} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 320, paddingTop: 20, paddingLeft: 32 }}>
            <FlatList
              horizontal
              data={lists}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => this.renderList(item)}
            />
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
    paddingTop: 10,
    width: '80%',
    paddingLeft: 125,
    color: colors.white,
  },
  title: {
    fontSize: 25,
    color: colors.jade,
  },
  addClimbingList: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.jade,
  },
});

Todo.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
