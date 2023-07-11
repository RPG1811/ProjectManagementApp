import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import moment from 'moment';
import firebase from '../firebase';

const TaskDetailScreen = ({ route }) => {
  const { projectId, taskId } = route.params;
  const [task, setTask] = useState(null);
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const taskRef = firebase
        .firestore()
        .collection('projects')
        .doc(projectId)
        .collection('tasks')
        .doc(taskId);
      const taskDoc = await taskRef.get();
      setTask(taskDoc.data());
    };

    fetchTask();
  }, [projectId, taskId]);

  const handleCompleteTask = async () => {
    try {
      const taskRef = firebase
        .firestore()
        .collection('projects')
        .doc(projectId)
        .collection('tasks')
        .doc(taskId);
      const member = task.assignedMembers.find((member) => member.memberId === firebase.auth().currentUser.uid);

      await taskRef.update({
        completed: true,
        completionDateTime: moment().toISOString(),
        hoursWorked: parseFloat(hoursWorked),
      });

      console.log('Task completed:', taskId);

      // Check if all tasks in the project are completed
      checkProjectCompletion();
    } catch (error) {
      console.log('Error completing task:', error);
    }
  };

  const checkProjectCompletion = async () => {
    const projectRef = firebase
      .firestore()
      .collection('projects')
      .doc(projectId);
    const tasksSnapshot = await projectRef.collection('tasks').get();
    const allTasksCompleted = tasksSnapshot.docs.every(
      (doc) => doc.data().completed
    );

    if (allTasksCompleted) {
      // Calculate total hours worked and cost of the project
      const tasks = tasksSnapshot.docs.map((doc) => doc.data());
      const totalHoursWorked = tasks.reduce(
        (sum, task) => sum + task.hoursWorked,
        0
      );
      const totalCost = tasks.reduce(
        (sum, task) => sum + task.hoursWorked * task.hourlyRate,
        0
      );

      // Update the project document to mark it as complete
      await projectRef.update({
        completed: true,
        totalHoursWorked,
        totalCost,
      });

      console.log('Project completed:', projectId);
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Loading task details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{task.name}</Text>
      <Text>Description: {task.description}</Text>
      <Text>Start Date: {task.startDate}</Text>
      <Text>End Date: {task.endDate}</Text>
      <Text>
        Prerequisite Tasks: {task.prerequisiteTasks.join(', ')}
      </Text>

      <TextInput
        style={styles.input}
        value={hoursWorked}
        onChangeText={setHoursWorked}
        placeholder="Hours Worked"
        keyboardType="numeric"
      />

      <Button
        title="Complete Task"
        onPress={handleCompleteTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default TaskDetailScreen;
