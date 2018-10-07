import React, { Component } from 'react';
import { 
    StyleSheet,
    View
} from 'react-native';
import {
    Icon,
    ListItem 
} from 'react-native-elements';
import {
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class ListItemCustom extends Component {
    renderDivider() {
        const { borderViewStyle } = styles;
        if (this.props.hideDivider) {
            return null;
        }
        return (
            <View style={borderViewStyle} />
        );
    }

    renderIcon() {
        const { iconStyle } = styles;
        if (this.props.iconName) {
            return (
                <Icon
                    name={this.props.iconName}
                    type={this.props.iconType}
                    size={this.props.iconSize || Size.icon}
                    color={this.props.iconColor || Color.grayLight}
                    containerStyle={iconStyle}
                />
            );
        }
    }

    render() {
        const { containerStyle, titleStyle } = styles;
        return (
            <View>
                <ListItem
                    {...this.props}
                    containerStyle={StyleSheet.flatten([containerStyle, this.props.listItemStyle])}
                    leftIcon={this.renderIcon()}
                    hideChevron={typeof (this.props.hideChevron) !== 'undefined' ? 
                        this.props.hideChevron : true}
                    rightTitleNumberOfLines={this.props.rightTitleNumberOfLines || 2}
                    rightTitleStyle={StyleSheet.flatten([titleStyle, this.props.rightTitleStyle])}
                    subtitleStyle={StyleSheet.flatten([style.txtCaption, this.props.subtitleStyle])}
                    titleStyle={StyleSheet.flatten([titleStyle, this.props.titleStyle])}
                />
                {this.renderDivider()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    borderViewStyle: {
        backgroundColor: Color.grayLightExtreme,
        height: 1,
        marginLeft: Size.spacing
    },
    containerStyle: {
        borderBottomWidth: 0,
        backgroundColor: Color.white,
    },
    iconStyle: {
        alignSelf: 'center',
        marginRight: Size.spacing_sm,
        marginLeft: Size.spacing_sm,
        marginVertical: Size.spacing_xs,
        width: Size.spacing_lg
    },
    titleStyle: {
        color: Color.grayDark,
        fontSize: Size.font
    }
});

export { ListItemCustom };
