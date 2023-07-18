import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from '../firebase';

const AdminPanelScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('projects')
      .onSnapshot((snapshot) => {
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      });

    return () => unsubscribe();
  }, []);

  const handleAddProject = () => {
    navigation.navigate('CreateProject');
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Panel</Text>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectItem}
        contentContainerStyle={styles.projectList}
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
});

export default AdminPanelScreen;
