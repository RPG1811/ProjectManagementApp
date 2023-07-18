import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '../firebase';

const TaskCreationForm = ({ projectId }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartDate, setTaskStartDate] = useState(new Date());
  const [taskEndDate, setTaskEndDate] = useState(new Date());
  const [taskAssignedMembers, setTaskAssignedMembers] = useState([]);
  const [taskAssignedMember, setTaskAssignedMember] = useState('');

  const handleAddTaskMember = () => {
    if (taskAssignedMember !== '' && !taskAssignedMembers.includes(taskAssignedMember)) {
      setTaskAssignedMembers((prevMembers) => [...prevMembers, taskAssignedMember]);
      setTaskAssignedMember('');
    }
  };

  const handleCreateTask = async () => {
    if (taskName.trim() === '') {
      return;
    }

    try {
      const taskData = {
        name: taskName,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        assignedMembers: [...taskAssignedMembers],
      };

      // Save the task to the project's tasks collection
      await firebase
        .firestore()
        .collection('projects')
        .doc(projectId)
        .collection('tasks')
        .add(taskData);

      console.log('Task created:', taskData);

      // Clear the form fields
      setTaskName('');
      setTaskDescription('');
      setTaskStartDate(new Date());
      setTaskEndDate(new Date());
      setTaskAssignedMembers([]);
      setTaskAssignedMember('');
    } catch (error) {
      console.log('Error creating task:', error);
    }
  };

  const renderAssignedMembers = ({ item }) => (
    <Text style={styles.assignedMember}>{item}</Text>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
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

        <View style={styles.datePickerContainer}>
          <Text>Start Date: </Text>
          <DateTimePicker
            value={taskStartDate}
            mode="date"
            display="default"
            onChange={(event, date) => setTaskStartDate(date)}
          />
        </View>

        <View style={styles.datePickerContainer}>
          <Text>End Date: </Text>
          <DateTimePicker
            value={taskEndDate}
            mode="date"
            display="default"
            onChange={(event, date) => setTaskEndDate(date)}
          />
        </View>

        <View style={styles.memberPickerContainer}>
          <Text>Assigned Members: </Text>
          <Picker
            selectedValue={taskAssignedMember}
            onValueChange={(itemValue) => setTaskAssignedMember(itemValue)}
          >
            <Picker.Item label="Select a member" value="" />
            {/* Add the members list here */}
          </Picker>
          <Button title="Add Member" onPress={handleAddTaskMember} />
        </View>

        <FlatList
          data={taskAssignedMembers}
          renderItem={renderAssignedMembers}
          keyExtractor={(item) => item}
          ListEmptyComponent={<Text>No members assigned.</Text>}
          contentContainerStyle={styles.memberListContainer}
        />

        <Button title="Create Task" onPress={handleCreateTask} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberPickerContainer: {
    marginBottom: 20,
  },
  assignedMember: {
    marginBottom: 5,
  },
  memberListContainer: {
    flexGrow: 1,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default TaskCreationForm;
