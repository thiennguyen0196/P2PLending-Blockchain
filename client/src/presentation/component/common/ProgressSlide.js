import React, { Component } from 'react';
import { 
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Slider } from 'react-native-elements';
import {
    Color,
    Size
} from '../../style/Theme';

class ProgressSlide extends Component {
    renderDescription() {
        const { containerDescriptionStyle, txtDescriptionStyle } = styles;
        if (this.props.hideDescription) {
            return null;
        }
        return (
            <View style={containerDescriptionStyle}>
                <Text style={txtDescriptionStyle}>
                    {this.props.minimumTxt || ''}
                </Text>
                <View />
                <Text style={txtDescriptionStyle}>
                    {this.props.maximumTxt || ''}
                </Text>
            </View>
        );
    }
    render() {
        const { containerStyle, sliderStyle, thumbStyle, thumbNonStyle, trackStyle } = styles;
        return (
            <View style={containerStyle}>
                <Slider
                    {...this.props}
                    value={Number.isInteger(this.props.value) ? this.props.value : 100}
                    disabled={this.props.disabled || false}
                    maximumValue={this.props.maximumValue || 100}
                    minimumValue={this.props.minimumValue || 0}
                    step={1}
                    style={StyleSheet.flatten([sliderStyle, this.props.sliderStyle])}
                    thumbStyle={this.props.disabled ? thumbNonStyle : thumbStyle}
                    maximumTrackTintColor={Color.grayLightExtreme}
                    minimumTrackTintColor={Color.primary}
                    trackStyle={this.props.trackStyle || trackStyle}
                />
                {this.renderDescription()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sliderStyle: {
        marginHorizontal: Size.spacing,
        marginVertical: Size.spacing_xs
    },
    thumbStyle: {
        top: 28,
        justifyContent: 'center',
        backgroundColor: Color.white,
        borderColor: Color.primary,
        borderRadius: Size.radius_xxlg,
        borderWidth: 2,
        width: Size.spacing,
        height: Size.spacing_lg
    },
    thumbNonStyle: {
        width: 0,
        height: 0
    },
    trackStyle: {
        height: Size.spacing,
        borderRadius: Size.radius_xxlg,
    },
    containerDescriptionStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtDescriptionStyle: {
        color: Color.gray,
        fontSize: Size.font,
        marginHorizontal: Size.spacing_sm
    }
});

export { ProgressSlide };
