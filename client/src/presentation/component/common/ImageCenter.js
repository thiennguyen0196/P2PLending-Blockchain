import React, { Component } from 'react';
import { 
    Dimensions,
    Image,
    StyleSheet
} from 'react-native';
import { Size } from '../../style/Theme';

class ImageCenter extends Component {
    render() {
        const height = this.props.height || Dimensions.get('window').width - (Size.spacing_lg * 6);
        const width = this.props.ratio ? height * this.props.ratio : height;
        return (
            <Image
                {...this.props}
                resizeMode={this.props.resizeMode || 'contain'}
                style={StyleSheet.flatten([{
                    alignSelf: 'center',
                    height, 
                    width,
                }, this.props.style])}
            />
        );
    }
}

export { ImageCenter };
