import React, { Component } from 'react';
import { SecureStore } from 'expo';
import {
  Button,
  StyleSheet,
  View
} from 'react-native';
import LoginModal from '../modals/LoginModal'

export default class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = { modalVisible: false };
      this.onAuth = this.onAuth.bind(this);
      this.isLoggedIn = false;
    }
  
    static navigationOptions = {
      title: 'Home',
      headerLeft: false
    };

    onAuth = (credentials, profile) => {
      this.setState({modalVisible: false}, () => 
      this.props.navigation.navigate('Profile', {credentials: credentials, profile: profile}) )
    };

    render() {
      const { navigate } = this.props.navigation;
      SecureStore.getItemAsync('token').then((isLoggedIn)=>{
            console.log("Storage content:",isLoggedIn);
            this.isLoggedIn = isLoggedIn;
      });
      if (this.isLoggedIn) {
        return (
            <View style={styles.container}>
              <Button
                onPress={() => this.setState({modalVisible: true})}
                title="Login"
              />
              <LoginModal modalVisible={this.state.modalVisible} onAuth={this.onAuth}/>
            </View>
          );
      }
      return (
        <View style={styles.container}>
          <Button
            onPress={() => this.setState({modalVisible: true})}
            title="Log In"
          />
          <LoginModal modalVisible={this.state.modalVisible} onAuth={this.onAuth}/>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });