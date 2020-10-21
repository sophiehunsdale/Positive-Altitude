import React from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './styles/colors';

export default class AddClimbingListModal extends React.Component {
  backgroundColors = [
    colors.fog,
    colors.jade,
    colors.veil,
    colors.night,
    colors.glass,
    colors.quartz,
  ];

  state = {
    name: '',
    color: this.backgroundColors[0],
  };

  createTodo = () => {
    const { name, color } = this.state;
    const list = { name, color };

    this.props.addClimbingList(list);
    this.setState({ name: '' });
    this.props.closeModal();
  };

  renderColors() {
    return this.backgroundColors.map((color) => (
      <TouchableOpacity
        key={color}
        onPress={() => this.setState({ color })}
        style={[styles.colorSelect, { backgroundColor: color }]}
      />
    ));
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableOpacity
          onPress={this.props.closeModal}
          style={{ position: 'absolute', top: 64, right: 32 }}
        >
          <AntDesign
            name="close"
            size={24}
            color={colors.onyx}
          />
        </TouchableOpacity>

        <View style={{ alignSelf: 'stretch', marginHorizontal: 32 }}>
          <Text style={styles.title}>Create Todo List</Text>
          <TextInput
            style={styles.input}
            placeholder="List Name?"
            onChangeText={(text) => this.setState({ name: text })}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            {this.renderColors()}
          </View>
          <TouchableOpacity
            onPress={this.createTodo}
            style={[styles.create, { backgroundColor: this.state.color }]}
          >
            <Text style={{ color: colors.white, fontWeight: '600' }}>Create!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: '800',
    color: colors.fog,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    marginTop: 8,
    fontSize: 18,
    borderRadius: 6,
    paddingHorizontal: 16,
    borderColor: colors.jade,
    borderWidth: StyleSheet.hairlineWidth,
  },
  create: {
    height: 50,
    marginTop: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
