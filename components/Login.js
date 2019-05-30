import React, { Component } from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import Auth0 from 'react-native-auth0';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

import { SecureStore } from 'expo';

var credentials = require('../auth0-credentials');
const auth0 = new Auth0(credentials);

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { viewLogin: true };
        this.realmLogin = this.realmLogin.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    onSuccess(credentials) {
        auth0.auth
            .userInfo({ token: credentials.accessToken })
            .then(profile => {
                SecureStore.setItemAsync('token', credentials.accessToken);
                // SecureStore.setItemAsync('credentials', credentials);
                // SecureStore.setItemAsync('profile', profile);
                this.props.onAuth(credentials, profile);
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    }

    realmLogin(username, password) {
        auth0.auth
            .passwordRealm({
                username: username,
                password: password,
                realm: 'Username-Password-Authentication',
                scope: 'openid profile email',
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    createUser(email, username, password) {
        auth0.auth
            .createUser({
                email: email,
                username: username,
                password: password,
                connection: 'Username-Password-Authentication',
            })
            .then(success => {
                console.log(success)
                this.alert('Success', 'New user created')
            })
            .catch(error => { 
                this.alert('Error', error.json.description) 
            });
    }

    webAuth(connection) {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email',
                connection: connection,
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => this.alert('Error', error.error_description));
    };

    render() {
        let form = null;
        if (this.state.viewLogin) {
            form = <LoginForm realmLogin={this.realmLogin} />;
        } else {
            form = <SignupForm createUser={this.createUser} />;
        }
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../images/rsz_2icon_color.png')}
                    />
                    <Text style={styles.title}>mPowered</Text>
                </View>
                <View style={styles.tabContainer}>
                <Button
                    onPress={() => this.setState({viewLogin: true})}
                    title="Log In"
                />
                <Button
                    onPress={() => this.setState({viewLogin: false})}
                    title="Sign up"
                />
                </View>
                <View style={styles.formContainer}>
                    {form}
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    formContainer: {
        flex: 2,
    },
    headerContainer: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
    },
    socialContainer: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 1,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    title: {
        marginTop: 10,
        width: 100,
        textAlign: 'center',
        fontSize: 16
    },
    socialIcon: {
        marginTop: 10
    }
});