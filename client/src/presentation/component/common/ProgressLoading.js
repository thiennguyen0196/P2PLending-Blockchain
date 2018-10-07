import React, { Component } from 'react';
import { 
    ActivityIndicator,
    Modal,
    Platform,
    View, 
    StyleSheet 
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { Color } from '../../style/Theme';
import style from '../../style/Style';

class ProgressLoading extends Component {
    renderBlurView() {
        if (Platform.OS === 'ios') {
            return (
                <BlurView
                    style={style.absoluteCenter}
                    blurType='light'
                    blurAmount={5}
                />
            );
        }
        return (
            <View 
                style={StyleSheet.flatten([style.absoluteCenter, 
                    { backgroundColor: Color.whiteTransparent }])} 
            />
        );
    }
    render() {
        return (
            <Modal
                onRequestClose={() => console.log('Loading Done')}
                visible={this.props.loading || false}
                transparent
            >
                {this.renderBlurView()}
                <ActivityIndicator
                    color={Color.primary}
                    size='large'
                    style={style.absoluteCenter}
                />
            </Modal>
        );
    }
}

export { ProgressLoading };
