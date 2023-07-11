import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import firebase from '../firebase';

const TaskCreateScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const handleCreateTask = async () => {
    try {
      const taskRef = firebase
        .firestore()
        .collection('projects')
        .doc(projectId)
        .collection('tasks');
      const newTask = {
        taskId: generateTaskId(),
        taskName,
        taskDescription,
        startDate,
        endDate,
        assignedMembers: [],
        hourlyRate: parseFloat(hourlyRate),
        completed: false,
        completionDateTime: null,
        hoursWorked: 0,
      };
      await taskRef.add(newTask);

      setTaskName('');
      setTaskDescription('');
      setStartDate('');
      setEndDate('');
      setHourlyRate('');

      navigation.goBack();
    } catch (error) {
      console.log('Error creating task:', error);
    }
  };

  const generateTaskId = () => {
    const timestamp = Date.now().toString();
    const randomString = nanoid(6);
    return `task-${timestamp}-${randomString}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Task</Text>

      <TextInput
        style={styles.input}
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Task Name"
      />

      <TextInput
        style={styles.input}
        value={taskDescription}
        onChangeText={setTaskDescription}
        placeholder="Task Description"
        multiline
      />

      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="Start Date"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
        placeholder="End Date"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={hourlyRate}
        onChangeText={setHourlyRate}
        placeholder="Hourly Rate"
        keyboardType="numeric"
      />

      <Button title="Create Task" onPress={handleCreateTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
});

export default TaskCreateScreen;
