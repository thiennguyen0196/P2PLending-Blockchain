import React, { Component } from 'react';
import { 
    Modal,
    Platform,
    View, 
    StyleSheet 
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { 
    ImageCenter,
    TextCenter 
} from '../common';
import { 
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class BlockchainLoading extends Component {
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
        const { contentStyle, textStyle } = styles;
        return (
            <Modal
                animationType='slide'
                onRequestClose={() => console.log('Loading Done')}
                visible={this.props.loading || false}
                transparent
            >
                {this.renderBlurView()}
                <View style={style.fullCenter}>
                    <View style={contentStyle}>
                        <TextCenter
                            text={this.props.textState || 
                                'Hệ thống đang lấy dữ liệu\ntừ blockchain'}
                            style={this.props.textStyle || textStyle}
                        />
                        <ImageCenter
                            /*eslint-disable global-require */
                            source={require('../../img/blockchain.gif')}
                        />
                        <TextCenter
                            text={this.props.textRequest || 'Xin vui lòng đợi'}
                            style={this.props.textStyle || textStyle}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    contentStyle: {
        alignSelf: 'baseline',
        backgroundColor: Color.blackTransparent,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing_lg,
    },
    textStyle: {
        color: Color.background
    }
});

export { BlockchainLoading };
