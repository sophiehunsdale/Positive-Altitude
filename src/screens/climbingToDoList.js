import React from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import colors from './styles/colors';
import ClimbingToDoModal from './climbingToDoModal';

export default class ClimbingToDoList extends React.Component {
  state = {
    showClimbingListVisible: false,
  };

  toggleClimbingListModal() {
    this.setState({ showClimbingListVisible: !this.state.showClimbingListVisible });
  }

  render() {
    const { list } = this.props;

    const completedCount = list.todos.filter((todo) => todo.completed).length;
    const remainingCount = list.todos.length - completedCount;

    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.state.showClimbingListVisible}
          onRequestClose={() => this.toggleClimbingListModal()}
        >
          <ClimbingToDoModal
            list={list}
            closeModal={() => this.toggleClimbingListModal()}
            updateClimbingList={this.props.updateClimbingList}
          />
        </Modal>
        <TouchableOpacity
          style={[styles.listContainer, { backgroundColor: list.color }]}
          onPress={() => this.toggleClimbingListModal()}
        >
          <Text style={styles.listTitle} numberOfLines={1}>
            {list.name}
          </Text>

          <View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.count}>{remainingCount}</Text>
              <Text style={styles.subtitle}>Remaining</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.count}>{completedCount}</Text>
              <Text style={styles.subtitle}>Completed</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    width: 200,
    borderRadius: 6,
    paddingVertical: 32,
    marginHorizontal: 12,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 24,
    marginBottom: 18,
    fontWeight: '700',
    color: colors.white,
  },
  count: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});
