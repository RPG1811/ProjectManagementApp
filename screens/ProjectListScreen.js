import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../firebase';

const ProjectListScreen = () => {
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUserEmail = firebase.auth().currentUser?.email;

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('projects').onSnapshot((snapshot) => {
      const projectList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filteredProjects = projectList.filter(
        (project) => project.createdBy === currentUser.email || project.members.some(member => member.email === currentUserEmail)
      );
      setProjects(filteredProjects);
    });
  
    const currentUser = firebase.auth().currentUser;
    const currentUserEmail = currentUser ? currentUser.email : '';
    if (currentUser) {
      const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
      userRef.get().then((doc) => {
        const userData = doc.data();
        setIsAdmin(userData?.isAdmin || false);
      });
    }
  
    return () => unsubscribe();
  }, []);
  
  

  const navigation = useNavigation();

  const handleAddProject = () => {
    navigation.navigate('CreateProject');
  };

  const handleDeleteProject = (projectId) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
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

            projectRef
              .delete()
              .then(() => {
                console.log('Project deleted successfully');
              })
              .catch((error) => {
                console.log('Error deleting project:', error);
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderProjectItem = ({ item }) => {
    const numTasks = item.tasks ? item.tasks.length : 0;
    const taskStatus = item.tasks
      ? item.tasks.some((task) => task.completed)
        ? 'In Progress'
        : 'Not Started'
      : 'Not Started';

    const handlePress = () => {
      navigation.navigate('ProjectDetail', { projectId: item.id, members: item.members });
    };

    return (
      <TouchableOpacity style={styles.projectItem} onPress={handlePress} activeOpacity={0.7}>
        <Text style={styles.projectTitle}>{item.name}</Text>
        <Text style={styles.projectDescription}>Tasks: {numTasks}</Text>
        <Text style={styles.projectDescription}>Status: {taskStatus}</Text>
        <Text style={styles.projectDescription}>Created By: {item.createdByEmail}</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.deleteProjectButton}
            onPress={() => handleDeleteProject(item.id)}
          >
            <Text style={styles.deleteProjectButtonText}>Delete Project</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Project List</Text>
      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectListContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noProjectsText}>No projects available.</Text>
      )}
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
  deleteProjectButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  deleteProjectButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  noProjectsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProjectListScreen;
