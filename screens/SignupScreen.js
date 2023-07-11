import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '../firebase';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = () => {
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Please enter email and password');
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Signup successful');
        navigation.navigate('Login');
      })
      .catch(error => {
        setErrorMessage(error.message);
        console.log('Signup error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Signup</Text>
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
      <Button title="Sign up" onPress={handleSignup} />
      <Text style={styles.text}>Already have an account?</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
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
    backgroundColor: '#61dafb',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    text: {color: '#000'},
    height: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderRadius: 20,
    height: 50,
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

export default SignupScreen;
