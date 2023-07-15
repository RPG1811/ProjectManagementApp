import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../firebase';

const ProjectDetailScreen = ({ route }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [hoursWorked, setHoursWorked] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const projectRef = firebase.firestore().collection('projects').doc(projectId);

    const unsubscribe = projectRef.onSnapshot((snapshot) => {
      const projectData = snapshot.data();
      setProject(projectData);
      setTasks(projectData.tasks);
      setTaskStatus(projectData.taskStatus);
      setStartDate(projectData.startDate);
      setEndDate(projectData.endDate);
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
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => {}}
      activeOpacity={0.7}
    >
      <View style={styles.taskInfoContainer}>
        <Text style={styles.taskTitle}>{item.name}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.taskDescription}>Start Date: {item.startDate}</Text>
        <Text style={styles.taskDescription}>End Date: {item.endDate}</Text>
        <Text style={styles.taskDescription}>Assigned Member: {item.assignedMember}</Text>
      </View>
      {taskStatus && taskStatus[item.taskId] ? (
        <Text style={styles.taskStatus}>Completed</Text>
      ) : (
        <View style={styles.taskCompletionContainer}>
          <Text style={styles.taskHours}>Hours Worked:</Text>
          <Text style={styles.taskHoursValue}>{hoursWorked[item.taskId] || 0}</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleTaskCompletion(item.taskId, hoursWorked[item.taskId])}
          >
            <Text style={styles.completeButtonText}>Complete Task</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {project && (
        <View style={styles.projectContainer}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <Text style={styles.projectInfo}>Start Date: {startDate}</Text>
          <Text style={styles.projectInfo}>End Date: {endDate}</Text>

          <Text style={styles.sectionHeading}>Tasks:</Text>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.taskId}
            contentContainerStyle={styles.taskListContainer}
            showsVerticalScrollIndicator={false}
          />

          <Text style={styles.sectionHeading}>Total Cost:</Text>
          <Text style={styles.totalCost}>$ {calculateTotalCost()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  projectContainer: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  taskListContainer: {
    paddingBottom: 10,
  },
  taskContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  taskInfoContainer: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    marginBottom: 5,
  },
  taskStatus: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  taskCompletionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskHours: {
    marginRight: 5,
  },
  taskHoursValue: {
    fontWeight: 'bold',
  },
  completeButton: {
    marginLeft: 'auto',
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalCost: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProjectDetailScreen;
