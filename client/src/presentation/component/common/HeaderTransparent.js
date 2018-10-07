import React, { Component } from 'react';
import { Header } from 'react-navigation';
import { 
    Platform,
    View, 
    TouchableOpacity,
    StyleSheet 
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TextCenter } from '../common';
import { 
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class HeaderTransparent extends Component {
    renderBackButton() {
        const { goBack, onBackIconPress } = this.props;
        let iconName;
        if (goBack) {
            if (Platform.OS === 'ios') {
                iconName = 'chevron-left';
            } else {
                iconName = 'arrow-left';
            }
            return (
                <Icon
                    color={Color.white}
                    containerStyle={style.full}
                    component={TouchableOpacity}
                    name={iconName}
                    onPress={onBackIconPress}
                    size={Platform.OS === 'ios' ? Size.spacing_xlg : Size.icon}
                    type='material-community'
                />
            );
        }
        return (
            <View style={style.full} />
        );
    }

    renderTitle() {
        const { title } = this.props;
        const { titleStyle } = styles;
        return (
            <TextCenter 
                style={titleStyle}
                text={title || ''}
            />
        );
    }

    renderRightComponent() {
        return (
            <View style={style.full} />
        );
    }

    render() {
        const { containerStyle } = styles;
        let marginTop;
        if (Platform.OS === 'ios') {
            marginTop = Size.spacing;
        } 
        return (
            <View style={StyleSheet.flatten([containerStyle, { marginTop }])}>
                {this.renderBackButton()}
                {this.renderTitle()}
                {this.renderRightComponent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        height: Header.HEIGHT,
    },
    titleStyle: {
        flex: 5,
        fontSize: Size.font_lg,
        fontWeight: 'bold'
    }
});

export { HeaderTransparent };
