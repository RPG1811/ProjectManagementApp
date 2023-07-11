import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
    >
      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Project List</Text>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
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
  projectItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
