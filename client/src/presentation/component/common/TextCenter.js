import React, { Component } from 'react';
import { 
    Text, 
    StyleSheet 
} from 'react-native';
import {
    Color,
    Size
} from '../../style/Theme';

class TextCenter extends Component {
    render() {
        const { textStyle } = styles;
        return (
            <Text
                {...this.props}
                numberOfLines={this.props.numberOfLines || 2}
                style={StyleSheet.flatten([textStyle, this.props.style])}
            >
                {this.props.text}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        alignSelf: 'center',
        color: Color.white,
        fontSize: Size.font,
        margin: Size.spacing_xs,
        textAlign: 'center'
    }
});

export { TextCenter };
