import React, { Component } from 'react';
import {
    Platform,
    View,
    StatusBar,
    StyleSheet
} from 'react-native';
import firebase from 'react-native-firebase';
import { onGetFlagDialog } from './domain';
import AppNavigator from './AppNavigator';
import { ConfirmDialog } from './presentation/component/common';
import { Color } from './presentation/style/Theme';

class App extends Component {

    componentDidMount() {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            if (Platform.OS === 'android') {
                onGetFlagDialog()
                    .then(value => {
                        if (!value || value !== 'true') {
                            return ConfirmDialog(
                                notification.title,
                                notification.body,
                                false
                            ).then(() => console.log('OK Notification'));
                        }
                    })
                    .catch(error => console.log(error));
            }
        });
    }

    componentWillUnmount() {
        this.notificationListener();
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <StatusBar 
                    backgroundColor={Color.primary}
                    barStyle='light-content'
                />
                <AppNavigator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1
    }
});

export default App;
