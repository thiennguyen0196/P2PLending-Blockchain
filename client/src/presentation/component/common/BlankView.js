import React, { Component } from 'react';
import { 
    TouchableOpacity, 
    View, 
    StyleSheet 
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TextCenter } from '../common';
import { 
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class BlankView extends Component {
    render() {
        const { iconStyle } = styles;
        return (
            <TouchableOpacity
                style={StyleSheet.flatten([style.fullCenter, this.props.containerStyle])}
                onPress={this.props.onPress}
            >
                <View>
                    <TextCenter
                        text={this.props.textState}
                        style={this.props.textStyle || style.txtPrimary}
                    />
                    <Icon
                        color={this.props.iconColor || Color.primary}
                        containerStyle={StyleSheet.flatten([iconStyle, this.props.iconStyle])}
                        name={this.props.iconName || 'emotsmile'}
                        size={this.props.iconSize || Size.icon_xlg}
                        type={this.props.iconType || 'simple-line-icon'}
                    />
                    <TextCenter
                        text={this.props.textRequest}
                        style={this.props.textStyle || style.txtPrimary}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        alignSelf: 'center',
        margin: Size.spacing
    }
});

export { BlankView };
