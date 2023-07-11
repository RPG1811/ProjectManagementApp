import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import firebase from '../firebase';

const ProjectCreateScreen = ({ navigation }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const handleAssignMember = () => {
    if (memberEmail) {
      setAssignedMembers([...assignedMembers, memberEmail]);
      setMemberEmail('');
    }
  };

  const handleAddTask = () => {
    if (taskName) {
      setTasks([...tasks, { id: generateTaskId(), name: taskName, assignedMember: '' }]);
      setTaskName('');
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
      <TextInput
        style={styles.assignedMemberInput}
        value={item.assignedMember}
        onChangeText={(text) => handleTaskMemberChange(item.id, text)}
        placeholder="Assigned Member"
      />
    </View>
  );

  const handleTaskMemberChange = (taskId, member) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, assignedMember: member } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Project</Text>

      <TextInput
        style={styles.input}
        value={projectTitle}
        onChangeText={setProjectTitle}
        placeholder="Project Title"
      />

      <View style={styles.assignMemberContainer}>
        <TextInput
          style={styles.input}
          value={memberEmail}
          onChangeText={setMemberEmail}
          placeholder="Member Email"
        />
        <Button title="Add Member" onPress={handleAssignMember} />
      </View>

      <View style={styles.assignedMembersContainer}>
        <Text style={styles.label}>Assigned Members:</Text>
        {assignedMembers.map((member, index) => (
          <Text key={index}>{member}</Text>
        ))}
      </View>

      <View style={styles.taskContainer}>
        <Text style={styles.label}>Tasks:</Text>
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.input}
            value={taskName}
            onChangeText={setTaskName}
            placeholder="Task Name"
          />
          <Button title="Add Task" onPress={handleAddTask} />
        </View>
      </View>

      <Button title="Create Project" onPress={handleCreateProject} />
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
  assignMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedMembersContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',  
  },
  taskTitle: {
    flex: 1,
    marginRight: 10,
  },
  assignedMemberInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProjectCreateScreen;
