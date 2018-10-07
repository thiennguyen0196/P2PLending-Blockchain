import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { BlankView } from '../common';
import { Color } from '../../style/Theme';
import style from '../../style/Style';

class ErrorView extends Component {
    render() {
        if (this.props.loading) {
            return (
                <ActivityIndicator
                    color={Color.primary}
                    size='large'
                    style={style.absoluteCenter}
                />
            );
        }
        return (
            <BlankView
                iconName='bug'
                iconType='font-awesome'
                onPress={this.props.onPress}
                textState={this.props.error}
                textRequest='Chạm để tải lại'
            />
        );
    }
}

export { ErrorView };
