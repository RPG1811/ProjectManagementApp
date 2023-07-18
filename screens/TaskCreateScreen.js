import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import firebase from '../firebase';

const TaskCreateScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [projectName, setProjectName] = useState('');
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskstartDate, setTaskStartDate] = useState('');
  const [taskendDate, setTaskEndDate] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [taskAssignedMembers, setTaskAssignedMembers] = useState([]);
  const [taskAssignedMember, setTaskAssignedMember] = useState('');
  const [prerequisiteTasks, setPrerequisiteTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const projectRef = firebase.firestore().collection('projects').doc(projectId);
        const projectSnapshot = await projectRef.get();
        const projectData = projectSnapshot.data();
        setMembers(projectData.members || []);
      } catch (error) {
        console.log('Error fetching project members:', error);
      }
    };

    const fetchAvailableTasks = async () => {
      try {
        const projectRef = firebase.firestore().collection('projects').doc(projectId);
        const tasksSnapshot = await projectRef.collection('tasks').get();
        const tasks = tasksSnapshot.docs.map((doc) => doc.data());
        setAvailableTasks(tasks);
      } catch (error) {
        console.log('Error fetching available tasks:', error);
      }
    };

    fetchProjectMembers();
    fetchAvailableTasks();
  }, [projectId]);

  const handleAssignMember = (memberId) => {
    if (assignedMembers.includes(memberId)) {
      setAssignedMembers((prevMembers) => prevMembers.filter((member) => member !== memberId));
    } else {
      setAssignedMembers((prevMembers) => [...prevMembers, memberId]);
    }
  };

  const handlePrerequisiteTaskSelection = (taskId) => {
    if (prerequisiteTasks.includes(taskId)) {
      setPrerequisiteTasks((prevTasks) => prevTasks.filter((task) => task !== taskId));
    } else {
      setPrerequisiteTasks((prevTasks) => [...prevTasks, taskId]);
    }
  };

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
        assignedMembers,
        hourlyRate: parseFloat(hourlyRate),
        completed: false,
        completionDateTime: null,
        hoursWorked: 0,
        prerequisiteTasks,
      };
      await taskRef.add(newTask);

      setTaskName('');
      setTaskDescription('');
      setStartDate('');
      setEndDate('');
      setHourlyRate('');
      setAssignedMembers([]);
      setPrerequisiteTasks([]);

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
    <ScrollView style={styles.container}>
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

      <Text style={styles.label}>Assigned Members:</Text>
      <View style={styles.memberContainer}>
        {projectMembers.map((member) => (
          <View key={member.memberId} style={styles.memberOption}>
            <Text>{member.email}</Text>
            <Button
              title={assignedMembers.includes(member.memberId) ? 'Remove' : 'Add'}
              onPress={() => handleAssignMember(member.memberId)}
            />
          </View>
        ))}
      </View>

      <Text style={styles.label}>Prerequisite Tasks:</Text>
      <View style={styles.taskContainer}>
        {availableTasks.map((task) => (
          <View key={task.taskId} style={styles.taskOption}>
            <Text>{task.taskName}</Text>
            <Button
              title={prerequisiteTasks.includes(task.taskId) ? 'Remove' : 'Add'}
              onPress={() => handlePrerequisiteTaskSelection(task.taskId)}
            />
          </View>
        ))}
      </View>

      <Button title="Create Task" onPress={handleCreateTask} />
    </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  memberContainer: {
    marginBottom: 10,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  taskContainer: {
    marginBottom: 10,
  },
  taskOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

export default TaskCreateScreen;
