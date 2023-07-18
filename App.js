import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProjectListScreen from './screens/ProjectListScreen';
import ProjectCreateScreen from './screens/ProjectCreateScreen';
import ProjectDetailScreen from './screens/ProjectDetailScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import TaskCreateScreen from './screens/TaskCreateScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProjectList" component={ProjectListScreen} />
        <Stack.Screen name="CreateProject" component={ProjectCreateScreen} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        <Stack.Screen name="TaskCreate" component={TaskCreateScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'Admin Panel' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
