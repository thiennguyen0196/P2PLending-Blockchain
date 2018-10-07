import React, { Component } from 'react';
import { 
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { ImageCenter } from '../common';
import { 
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class ItemPayment extends Component {
    render() {
        const { containerCardStyle } = styles;
        return (
            <TouchableOpacity 
                onPress={this.props.onPress}
                style={containerCardStyle}
            >
                <ImageCenter
                    resizeMode={'contain'}
                    source={this.props.source}
                    style={StyleSheet.flatten([
                        style.full, 
                        { 
                            height: ((Dimensions.get('window').width / 2) 
                                - Size.spacing_xxlg) / Size.ratio_16_9,
                            width: (Dimensions.get('window').width / 2) - Size.spacing_xxlg
                        }
                    ])}
                /> 
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containerCardStyle: {
        flex: 1,
        backgroundColor: Color.white,
        borderColor: Color.grayLightExtreme,
        borderWidth: 2,
        borderRadius: Size.radius_sm,
        justifyContent: 'center',
        margin: Size.spacing_xs,
        padding: Size.spacing_xs
    }
});

export { ItemPayment };
