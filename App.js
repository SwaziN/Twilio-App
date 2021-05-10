import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

class App extends Component {
  TWILIO_NOTIFICATION_SID = 'ISd785c24f9e9591d7830a36c04b393bd3';
  state = {
    userIdentity: '',
  };

  handleUserIdentity = (text) => {
    this.setState({userIdentity: text});
  };

  registerTwilioToken(userId) {
    messaging()
      .getToken()
      .then((token) => {
        const params = {
          Identity: userId,
          BindingType: 'fcm',
          Address: token,
        };

        let formBody = [];
        for (let entry in params) {
          let encodedKey = encodeURIComponent(entry);
          let encodedValue = encodeURIComponent(params[entry]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        const header = {
          Authorization:
            'Basic QUMyNDdkOTU1NzU4MWU5ZDlkOGUzMjFiZDE3YjA5YzEyNzoyODk1ZGY1ZjE3ODA3MjhiOGVhZTUyZTkzZmExMzZlMQ==',
          'Content-Type': 'application/x-www-form-urlencoded',
        };

        const request = {
          method: 'POST',
          headers: header,
          body: formBody,
        };

        fetch(
          `https://notify.twilio.com/v1/Services/${this.TWILIO_NOTIFICATION_SID}/Bindings`,
          request,
        )
          .then((binding) => {
            console.log('Successfully created binding: ', binding);
          })
          .catch((err) => {
            console.error(
              'Failed to create binding for ',
              params.Identity,
              err,
            );
          });
      });
  }

  componentDidMount() {
    return messaging().onMessage(async (remoteMessage) => {
      Alert.alert("You've Got Mail!", JSON.stringify(remoteMessage));
    });
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Welcome To Flex React!!</Text>
        <Text>Someone out there is thinking of you.</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="UserId"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={this.handleUserIdentity}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => this.registerTwilioToken(this.state.userIdentity)}>
          <Text style={styles.submitButtonText}> Submit </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  input: {
    margin: 25,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 25,
    height: 40,
  },
  submitButtonText: {
    color: 'white',
  },
});
