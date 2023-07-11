import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import firebase from '../firebase';

const ProjectDetailScreen = ({ route }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [hoursWorked, setHoursWorked] = useState({});

  useEffect(() => {
    const projectRef = firebase.firestore().collection('projects').doc(projectId);

    const unsubscribe = projectRef.onSnapshot((snapshot) => {
      const projectData = snapshot.data();
      setProject(projectData);
      setTasks(projectData.tasks);
      setTaskStatus(projectData.taskStatus);
    });

    return () => unsubscribe();
  }, [projectId]);

  const handleTaskCompletion = async (taskId, hoursWorked) => {
    const projectRef = firebase.firestore().collection('projects').doc(projectId);
    const taskRef = projectRef.collection('tasks').doc(taskId);

    const updatedTaskStatus = { ...taskStatus };
    updatedTaskStatus[taskId] = true;

    await taskRef.update({
      completed: true,
      completionDateTime: firebase.firestore.FieldValue.serverTimestamp(),
      hoursWorked: parseFloat(hoursWorked),
    });

    await projectRef.update({ taskStatus: updatedTaskStatus });
  };

  const calculateTotalCost = () => {
    let totalCost = 0;

    tasks.forEach((task) => {
      const taskHours = parseFloat(hoursWorked[task.taskId]) || 0;
      const hourlyRate = task.hourlyRate || 0;
      totalCost += taskHours * hourlyRate;
    });

    return totalCost.toFixed(2);
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.taskName}</Text>
      <Text style={styles.taskDescription}>{item.taskDescription}</Text>
      {taskStatus[item.taskId] ? (
        <Text style={styles.taskStatus}>Completed</Text>
      ) : (
        <View style={styles.taskCompletionContainer}>
          <TextInput
            style={styles.hoursWorkedInput}
            placeholder="Hours Worked"
            keyboardType="numeric"
            onChangeText={(text) => setHoursWorked({ ...hoursWorked, [item.taskId]: text })}
          />
          <Button
            title="Complete Task"
            onPress={() => handleTaskCompletion(item.taskId, hoursWorked[item.taskId])}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {project && (
        <React.Fragment>
          <Text style={styles.heading}>{project.title}</Text>
          <Text>Creator: {project.creator}</Text>
          <Text style={styles.sectionHeading}>Tasks:</Text>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.taskId}
          />
          <Text style={styles.sectionHeading}>Total Cost:</Text>
          <Text style={styles.totalCost}>{calculateTotalCost()}</Text>
        </React.Fragment>
      )}
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
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    marginBottom: 5,
  },
  taskCompletionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursWorkedInput: {
    width: 100,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  taskStatus: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  totalCost: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProjectDetailScreen;
