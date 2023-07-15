import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../firebase';

const ProjectListScreen = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('projects')
      .onSnapshot(snapshot => {
        const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectList);
      });

    return () => unsubscribe();
  }, []);

  const navigation = useNavigation();

  const handleAddProject = () => {
    navigation.navigate('CreateProject');
  };

  const handleDeleteTask = (projectId, taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const projectRef = firebase.firestore().collection('projects').doc(projectId);
            const taskRef = projectRef.collection('tasks').doc(taskId);

            taskRef.delete()
              .then(() => {
                console.log('Task deleted successfully');
              })
              .catch(error => {
                console.log('Error deleting task:', error);
              });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
      <Text style={styles.projectInfo}>Start Date: {item.startDate}</Text>
      <Text style={styles.projectInfo}>End Date: {item.endDate}</Text>
      <Text style={styles.taskCount}>Tasks: {item.tasks.length}</Text>
      <FlatList
        data={item.tasks}
        renderItem={({ item: task }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onLongPress={() => handleDeleteTask(item.id, task.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.taskTitle}>{task.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={task => task.id}
        contentContainerStyle={styles.taskListContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Project List</Text>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.projectListContainer}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
        <Text style={styles.addButtonText}>Add Project</Text>
      </TouchableOpacity>
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
  projectListContainer: {
    paddingBottom: 10,
  },
  projectItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projectDescription: {
    marginBottom: 5,
  },
  projectInfo: {
    fontSize: 12,
    color: '#777',
  },
  taskCount: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  taskListContainer: {
    marginTop: 5,
  },
  taskItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectListScreen;
