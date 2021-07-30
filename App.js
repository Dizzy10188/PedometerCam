import React, { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Pedometer } from 'expo-sensors';
import { Camera } from 'expo-camera';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button, { width: windowWidth, height: windowHeight }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
        <Button title="Pedometer" onPress={() => navigation.popToTop()} />
      </Camera>
    </View>
  );
}

const PedometerScreen = ({ navigation }) => {
  const [currentStepCount, setCurrentStepCount] = useState(0);

  let _subscription;

  const _subscribe = () => {
    _subscription = Pedometer.watchStepCount(result => {
      setCurrentStepCount(result.steps);
    });
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.pedometerText}>Steps Taken: {currentStepCount}</Text>
      <Text style={styles.pedometerText}>Current Goal: 1000</Text>
      {/* <Progress.Bar progress={0.3} width={200} /> */}
      {/* <Progress.Pie style={styles.pi} progress={currentStepCount / 1000} showsText={true} size={100} /> */}
      <Progress.Circle style={styles.pi} progress={currentStepCount / 1000} showsText={true} size={100} />
      <Button title="Camera" onPress={() => navigation.navigate('Camera')} />
      {/* <Progress.CircleSnail color={['red', 'green', 'blue']} /> */}
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Pedometer"} screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: 'grey',
        headerStyle: {
          backgroundColor: 'lightblue'
        }
      }}>
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Pedometer" component={PedometerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: "black",
    padding: 10,
    borderWidth: 1
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'blue',
  },
  pedometerText: {
    fontSize: 24
  },
  pi: {
    margin: 50
  }
});