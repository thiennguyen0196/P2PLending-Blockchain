import React, { Component } from 'react';
import { 
    Platform,
    StyleSheet 
} from 'react-native';
import { Button } from 'react-native-elements';
import { 
    Color,
    Size
} from '../../style/Theme';

class ButtonCustom extends Component {
    render() {
        const { buttonActiveStyle, disableStyle, shadowAndroidStyle } = styles;
        return (
            <Button 
                {...this.props}
                backgroundColor={this.props.backgroundColor || Color.primaryDark}
                borderRadius={this.props.borderRadius || Size.radius_xxlg}
                buttonStyle={this.props.elevation ?  
                    StyleSheet.flatten([buttonActiveStyle, shadowAndroidStyle, 
                        this.props.buttonActiveStyle]) :
                    StyleSheet.flatten([buttonActiveStyle, this.props.buttonActiveStyle])}
                color={this.props.color || Color.white}
                disabledStyle={this.props.disabledStyle || disableStyle}
                fontSize={this.props.fontSize || Size.font}
                raised={this.props.raised || Platform.OS === 'ios'}
            />
        );
    }
}

const styles = StyleSheet.create({
    buttonActiveStyle: {
        margin: Size.spacing_xs,
        padding: Size.spacing_sm
    },
    disableStyle: {
        backgroundColor: Color.primaryDark
    },
    shadowAndroidStyle: {
        elevation: 2
    }
});

export { ButtonCustom };
