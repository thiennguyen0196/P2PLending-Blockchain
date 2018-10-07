import React, { Component } from 'react';
import { 
    Dimensions,
    Image, 
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { TextCenter } from '../common';
import {
    Color,
    Size
} from '../../style/Theme';

class ImagePickerContainer extends Component {

    state = { height: 150, width: 150 };

    componentDidMount() {
        const size = Dimensions.get('window').width - (Size.spacing_lg * 7);
        this.setState({ height: size, width: size });
    }

    onSelectPhotoPress() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
        
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const img = { uri: response.uri };
                this.props.onPressAction(img);
            }
        });
    }

    renderImgOrText() {
        const { width, height } = this.state;
        const { imageStyle } = styles;
        if (!this.props.imgSource || this.props.imgSource === '') {
            return (
                <TextCenter text={this.props.text} />
            );
        } 
        return (
            <Image
                style={StyleSheet.flatten([imageStyle, { width, height }, this.props.imageStyle])} 
                source={this.props.imgSource} 
            />
        );
    }

    render() {
        const { width, height } = this.state;
        const { containerStyle, imageContainerStyle } = styles;
        return (
            <TouchableOpacity 
                disabled={this.props.disabled}
                onPress={this.onSelectPhotoPress.bind(this)}
                style={StyleSheet.flatten([containerStyle, this.props.containerStyle])}
            >
                <View 
                    style={StyleSheet.flatten([imageContainerStyle, { width, height },
                        this.props.imageContainerStyle])}
                >
                    {this.renderImgOrText()}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center'
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderColor: Color.white,
        borderRadius: Size.radius_lg,
        borderWidth: 2,
        justifyContent: 'center',
    },
    imageStyle: {
        alignItems: 'center',
        borderRadius: Size.radius_lg,
        justifyContent: 'center',
    },
});

export { ImagePickerContainer };
