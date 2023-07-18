import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from '../firebase';

const ProjectCreateScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberHourlyRate, setMemberHourlyRate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartDate, setTaskStartDate] = useState(new Date());
  const [taskEndDate, setTaskEndDate] = useState(new Date());
  const [taskAssignedMembers, setTaskAssignedMembers] = useState([]);

  const handleAddMember = () => {
    if (memberEmail.trim() === '' || memberHourlyRate.trim() === '') {
      return;
    }

    const member = {
      email: memberEmail,
      hourlyRate: parseFloat(memberHourlyRate),
    };

    if (members.some((m) => m.email === member.email)) {
      return;
    }

    setMembers((prevMembers) => [...prevMembers, member]);
    setMemberEmail('');
    setMemberHourlyRate('');
  };

  const handleAddTask = () => {
    if (taskName.trim() === '') {
      return;
    }

    const assignedMembersWithHourlyRate = taskAssignedMembers.map((memberEmail) => {
      const member = members.find((m) => m.email === memberEmail);
      return {
        email: memberEmail,
        hourlyRate: member ? member.hourlyRate : 0,
      };
    });

    const task = {
      id: tasks.length + 1,
      name: taskName,
      description: taskDescription,
      startDate: taskStartDate,
      endDate: taskEndDate,
      assignedMembers: [...assignedMembersWithHourlyRate],
      completed: false,
      completionDateTime: null,
      hoursWorked: 0,
    };

    setTasks((prevTasks) => [...prevTasks, task]);
    setTaskName('');
    setTaskDescription('');
    setTaskStartDate(new Date());
    setTaskEndDate(new Date());
    setTaskAssignedMembers([]);
  };

  const handleCreateProject = async () => {
    if (projectName.trim() === '') {
      return;
    }

    try {
      const currentUser = firebase.auth().currentUser;

      const projectData = {
        name: projectName,
        createdBy: currentUser.email,
        leader: currentUser.uid,
        members: [...members],
        tasks: [...tasks],
        completed: false,
        totalHoursWorked: 0,
        totalCost: 0,
      };

      const projectRef = await firebase.firestore().collection('projects').add(projectData);

      console.log('Project created:', projectRef.id);

      setProjectName('');
      setMembers([]);
      setMemberEmail('');
      setMemberHourlyRate('');
      setTasks([]);
      setTaskName('');
      setTaskDescription('');
      setTaskStartDate(new Date());
      setTaskEndDate(new Date());
      setTaskAssignedMembers([]);

      navigation.navigate('ProjectList');
    } catch (error) {
      console.log('Error creating project:', error);
    }
  };

  const renderMembers = () => {
    if (members.length === 0) {
      return <Text>No members added.</Text>;
    }

    return members.map((member) => (
      <Text key={member.email} style={styles.member}>
        {`${member.email} - $${member.hourlyRate}/hr`}
      </Text>
    ));
  };

  const renderAssignedMembers = () => {
    if (taskAssignedMembers.length === 0) {
      return <Text>No members assigned.</Text>;
    }

    return taskAssignedMembers.map((member) => (
      <Text key={member} style={styles.assignedMember}>
        {member}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <Text style={styles.heading}>Create Project</Text>

          <TextInput
            style={styles.input}
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Project Name"
          />

          <Text style={styles.sectionHeading}>Members</Text>

          <View style={styles.memberContainer}>
            <TextInput
              style={styles.memberInput}
              value={memberEmail}
              onChangeText={setMemberEmail}
              placeholder="Member Email"
            />
            <TextInput
              style={styles.memberInput}
              value={memberHourlyRate}
              onChangeText={setMemberHourlyRate}
              placeholder="Hourly Rate"
              keyboardType="numeric"
            />
            <Button title="Add Member" onPress={handleAddMember} />
          </View>

          {renderMembers()}

          <Text style={styles.sectionHeading}>Tasks</Text>

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
            multiline
          />

          <View style={styles.datePickerContainer}>
            <Text>Start Date: </Text>
            <DateTimePicker
              value={taskStartDate}
              mode="date"
              display="default"
              onChange={(event, date) => setTaskStartDate(date)}
            />
          </View>

          <View style={styles.datePickerContainer}>
            <Text>End Date: </Text>
            <DateTimePicker
              value={taskEndDate}
              mode="date"
              display="default"
              onChange={(event, date) => setTaskEndDate(date)}
            />
          </View>

          <View style={styles.memberPickerContainer}>
            <Text>Assigned Members: </Text>
            <Picker
              selectedValue={taskAssignedMembers}
              onValueChange={(itemValue) => {
                if (itemValue !== '') {
                  if (!taskAssignedMembers.includes(itemValue)) {
                    setTaskAssignedMembers([...taskAssignedMembers, itemValue]);
                  }
                }
              }}
            >
              <Picker.Item label="Select a member" value="" />
              {members.map((member) => (
                <Picker.Item key={member.email} label={member.email} value={member.email} />
              ))}
            </Picker>
          </View>

          {renderAssignedMembers()}

          <Button title="Add Task" onPress={handleAddTask} />

          <Button title="Create Project" onPress={handleCreateProject} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberInput: {
    flex: 1,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberPickerContainer: {
    marginBottom: 20,
  },
  member: {
    marginBottom: 5,
  },
  assignedMember: {
    marginBottom: 5,
  },
});

export default ProjectCreateScreen;
