import React from 'react';
import {
  View,
  Text,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {
  AntDesign, Ionicons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import colors from './styles/colors';

export default class ClimbingToDoModal extends React.Component {
  state = {
    newClimbingToDo: '',
  };

  toggleClimbingTodoCompleted = (index) => {
    const { list } = this.props;
    list.todos[index].completed = !list.todos[index].completed;

    this.props.updateClimbingList(list);
  };

  addClimbingToDo = () => {
    const { list } = this.props;

    if (!list.todos.some((todo) => todo.title === this.state.newClimbingToDo)) {
      list.todos.push({ title: this.state.newClimbingToDo, completed: false });

      this.props.updateClimbingList(list);
    }

    this.setState({ newClimbingToDo: '' });
    Keyboard.dismiss();
  };

  deleteClimbingToDo = (index) => {
    const { list } = this.props;
    list.todos.splice(index, 1);

    this.props.updateClimbingList(list);
  };

  renderTodo = (todo, index) => (
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => this.toggleClimbingTodoCompleted(index)}>
          <Ionicons
            size={24}
            color={colors.dove}
            style={{ width: 32 }}
            name={todo.completed ? 'ios-square' : 'ios-square-outline'}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.todo,
            {
              textDecorationLine: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? colors.dove : colors.onyx,
            },
          ]}
        >
          {todo.title}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => this.deleteClimbingToDo(index)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={24} color={colors.onyx} />
        </TouchableOpacity>
      </View>

    </View>
  );

  render() {
    const { list } = this.props;

    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{
              position: 'absolute', top: 64, right: 32, zIndex: 10,
            }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={24} color={colors.onyx} />
          </TouchableOpacity>

          <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.taskCount}>
                {completedCount}
                {' '}
                of
                {taskCount}
                {' '}
                tasks
              </Text>
            </View>
          </View>

          <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
            <FlatList
              data={list.todos}
              keyExtractor={(item) => item.title}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => this.renderTodo(item, index)}
            />
          </View>

          <View style={[styles.section, styles.footer]}>
            <TextInput
              value={this.state.newClimbingToDo}
              style={[styles.input, { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newClimbingToDo: text })}
            />
            <TouchableOpacity
              onPress={() => this.addClimbingToDo()}
              style={[styles.addClimbingToDo, { backgroundColor: list.color }]}
            >
              <AntDesign name="plus" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  section: {
    alignSelf: 'stretch',
  },
  header: {
    marginLeft: 64,
    paddingTop: 16,
    borderBottomWidth: 3,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.onyx,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    fontWeight: '600',
    color: colors.dove,
  },
  footer: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  input: {
    flex: 1,
    height: 48,
    marginRight: 8,
    borderRadius: 6,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  addClimbingToDo: {
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoContainer: {
    width: '90%',
    paddingLeft: 32,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  deleteButton: {
    paddingVertical: 16,
    alignSelf: 'flex-end',
  },
  todo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onyx,
  },

});
