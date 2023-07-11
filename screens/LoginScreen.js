import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Please enter email and password');
      return;           
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Login successful');
        navigation.navigate('ProjectList');
      })
      .catch(error => {
        setErrorMessage(error.message);
        console.log('Login error:', error);
      });
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.text}>Don't have an account?</Text>
      <Button
        title="Sign up"
        onPress={() => navigation.navigate('Signup')}
        color="#007AFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
  },
});

export default LoginScreen;
