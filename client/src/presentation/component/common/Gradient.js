import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../style/Theme';
import style from '../../style/Style';

class Gradient extends Component {
    render() {
        let colors = [Color.primaryLight, Color.primary, Color.primaryDark];
        if (this.props.opacity) {
            colors = [
                Color.primaryLightTransparent, 
                Color.primaryTransparent, 
                Color.primaryDarkTransparent
            ];
        }
        return (
            <LinearGradient
                colors={this.props.colors || colors}
                end={this.props.horizontal ? (this.props.end || { x: 1.0, y: 0.5 }) 
                    : { x: 1.0, y: 1.0 }} 
                start={this.props.start || { x: 0.0, y: 0.5 }}
                style={this.props.containerStyle || style.full}
            >
                {this.props.view}
            </LinearGradient>
        );
    }
}

export { Gradient };
