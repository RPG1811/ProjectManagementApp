import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import firebase from '../firebase';

const ProjectCreateScreen = ({ navigation }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [taskHourlyRate, setTaskHourlyRate] = useState('');

  const handleAssignMember = () => {
    if (memberEmail) {
      setAssignedMembers([...assignedMembers, memberEmail]);
      setMemberEmail('');
    }
  };

  const handleAddTask = () => {
    if (taskName && taskDescription && taskStartDate && taskEndDate && taskHourlyRate) {
      setTasks([
        ...tasks,
        {
          id: generateTaskId(),
          name: taskName,
          description: taskDescription,
          startDate: taskStartDate,
          endDate: taskEndDate,
          hourlyRate: taskHourlyRate,
        },
      ]);
      setTaskName('');
      setTaskDescription('');
      setTaskStartDate('');
      setTaskEndDate('');
      setTaskHourlyRate('');
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectRef = firebase.firestore().collection('projects');
      const newProject = {
        title: projectTitle,
        assignedMembers: assignedMembers,
        tasks: tasks,
      };
      await projectRef.add(newProject);

      setProjectTitle('');
      setAssignedMembers([]);
      setTasks([]);

      navigation.navigate('ProjectList');
    } catch (error) {
      console.log('Error creating project:', error);
    }
  };

  const generateTaskId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Start Date: {item.startDate}</Text>
      <Text>End Date: {item.endDate}</Text>
      <Text>Hourly Rate: {item.hourlyRate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Project</Text>

      <TextInput
        style={styles.input}
        value={projectTitle}
        onChangeText={setProjectTitle}
        placeholder="Project Title"
      />

      <Text style={styles.label}>Assigned Members:</Text>
      <View style={styles.assignedMembersContainer}>
        {assignedMembers.map((member, index) => (
          <View key={index} style={styles.assignedMember}>
            <Text style={styles.assignedMemberText}>{member}</Text>
          </View>
        ))}
      </View>

      <TextInput
        style={styles.input}
        value={memberEmail}
        onChangeText={setMemberEmail}
        placeholder="Add Member Email"
      />

      <Button title="Add Member" onPress={handleAssignMember} />

      <View style={styles.taskContainer}>
        <Text style={styles.label}>Tasks:</Text>
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
        />

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
        />
        <TextInput
          style={styles.input}
          value={taskStartDate}
          onChangeText={setTaskStartDate}
          placeholder="Task Start Date"
        />
        <TextInput
          style={styles.input}
          value={taskEndDate}
          onChangeText={setTaskEndDate}
          placeholder="Task End Date"
        />
        <TextInput
          style={styles.input}
          value={taskHourlyRate}
          onChangeText={setTaskHourlyRate}
          placeholder="Task Hourly Rate"
          keyboardType="numeric"
        />

        <Button title="Add Task" onPress={handleAddTask} />
      </View>

      <Button title="Create Project" onPress={handleCreateProject} />

      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
        color="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  assignedMembersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  assignedMember: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  assignedMemberText: {
    fontSize: 14,
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskItem: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ProjectCreateScreen;
