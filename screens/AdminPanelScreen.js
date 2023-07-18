import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../firebase';

const AdminPanelScreen = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('projects')
      .onSnapshot((snapshot) => {
        const projectList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProjects(projectList);
      });

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

            projectRef.delete()
              .then(() => {
                console.log('Project deleted successfully');
              })
              .catch(error => {
                console.log('Error deleting project:', error);
              });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderProjectItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.projectItem}
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
      >
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectLeader}>Leader: {item.leader}</Text>
        <Text style={styles.projectStatus}>{item.completed ? 'Completed' : 'In Progress'}</Text>
        <TouchableOpacity
          style={styles.deleteProjectButton}
          onPress={() => handleDeleteProject(item.id)}
        >
          <Text style={styles.deleteProjectButtonText}>Delete Project</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Panel</Text>

      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectList}
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
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  projectList: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  projectItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projectLeader: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  projectStatus: {
    fontSize: 14,
    color: '#888',
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 5,
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

export default AdminPanelScreen;
