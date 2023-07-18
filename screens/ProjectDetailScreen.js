import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../firebase';

const ProjectDetailScreen = ({ route }) => {
  const { projectId, members } = route.params;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
 
  const [totalCost, setTotalCost] = useState(0);
  const [completionDate, setCompletionDate] = useState('');

  useEffect(() => {
    const projectRef = firebase.firestore().collection('projects').doc(projectId);

    const unsubscribe = projectRef.onSnapshot((snapshot) => {
      const projectData = snapshot.data();
      setProject(projectData);
      setTasks(projectData.tasks);

      

      if (projectData.completed && projectData.completionDateTime) {
        setCompletionDate(projectData.completionDateTime.toDate().toISOString());
      } else {
        setCompletionDate('');
      }
    });

    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    const calculateTotalCost = () => {
      let totalCost = 0;

      tasks.forEach((task) => {
        const taskHours = parseFloat(hoursWorked[task.id]) || 0;
        const assignedMember = task.assignedMembers.find((member) => member.email === firebase.auth().currentUser.email);
        const hourlyRate = assignedMember ? assignedMember.hourlyRate : 0;
        totalCost += taskHours * hourlyRate;
      });

      return totalCost.toFixed(2);
    };

    setTotalCost(calculateTotalCost());
  }, [tasks, hoursWorked]);

  const handleTaskCompletion = async (taskId, hoursWorked) => {
    try {
      const projectRef = firebase.firestore().collection('projects').doc(projectId);
      const projectSnapshot = await projectRef.get();

      if (projectSnapshot.exists) {
        const projectData = projectSnapshot.data();
        const updatedTasks = projectData.tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              completed: true,
              completionDateTime: firebase.firestore.Timestamp.now(),
              hoursWorked: parseFloat(hoursWorked),
            };
          }
          return task;
        });

        // Update tasks array in Firestore
        await projectRef.update({ tasks: updatedTasks });

        // Recalculate and update the total cost and total hours worked in Firestore
        const updatedTotalCost = calculateTotalCost(updatedTasks);
        const updatedTotalHoursWorked = calculateTotalHoursWorked(updatedTasks);
        await projectRef.update({ totalCost: updatedTotalCost, totalHoursWorked: updatedTotalHoursWorked });

        // Check if all tasks are completed and update the completion date of the project
        if (updatedTasks.every((task) => task.completed)) {
          await projectRef.update({ completed: true, completionDateTime: firebase.firestore.Timestamp.now() });
        }
      }
    } catch (error) {
      console.log('Error in handleTaskCompletion:', error);
    }
  };

  const calculateTotalCost = (tasks) => {
    let totalCost = 0;

    tasks.forEach((task) => {
      if (task.completed) {
        const taskHours = parseFloat(task.hoursWorked) || 0;
        const assignedMember = task.assignedMembers.find((member) => member.email === firebase.auth().currentUser.email);
        const hourlyRate = assignedMember ? assignedMember.hourlyRate : 0;
        totalCost += taskHours * hourlyRate;
      }
    });

    return totalCost.toFixed(2);
  };

  const calculateTotalHoursWorked = (tasks) => {
    let totalHoursWorked = 0;

    tasks.forEach((task) => {
      if (task.completed) {
        totalHoursWorked += parseFloat(task.hoursWorked) || 0;
      }
    });

    return totalHoursWorked;
  };

  const renderTaskItem = ({ item }) => {
    const assignedMember = item.assignedMembers.find((member) => member.email === firebase.auth().currentUser.email);

    return (
      <TouchableOpacity style={styles.taskContainer} onPress={() => {}} activeOpacity={0.7}>
        <View style={styles.taskInfoContainer}>
          <Text style={styles.taskTitle}>{item.name}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          <Text style={styles.taskDescription}>
            Start Date: {item.startDate ? item.startDate.toDate().toISOString() : ''}
          </Text>
          <Text style={styles.taskDescription}>
            End Date: {item.endDate ? item.endDate.toDate().toISOString() : ''}
          </Text>
        </View>
        {item.completed ? (
          <Text style={styles.taskStatus}>Completed</Text>
        ) : (
          <View style={styles.taskCompletionContainer}>
            <Text style={styles.taskHours}>Hours Worked:</Text>
            <TextInput
              style={styles.taskHoursInput}
              keyboardType="numeric"
              value={hoursWorked[item.id] || ''}
              onChangeText={(text) => setHoursWorked((prevHoursWorked) => ({ ...prevHoursWorked, [item.id]: text }))}
            />
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleTaskCompletion(item.id, hoursWorked[item.id])}
            >
              <Text style={styles.completeButtonText}>Complete Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {project && (
        <View style={styles.projectContainer}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          
          {completionDate ? (
            <Text style={styles.projectInfo}>Completion Date: {completionDate}</Text>
          ) : (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() =>
                Alert.alert('Confirm Project Completion', 'Are you sure you want to mark this project as completed?', [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Mark as Completed',
                    onPress: () => handleProjectCompletion(),
                  },
                ])
              }
            >
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionHeading}>Tasks:</Text>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.taskListContainer}
            showsVerticalScrollIndicator={false}
          />

          <Text style={styles.sectionHeading}>Total Cost:</Text>
          <Text style={styles.totalCost}>$ {totalCost}</Text>
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
  taskHoursInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  completeButton: {
    marginTop: 10,
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
