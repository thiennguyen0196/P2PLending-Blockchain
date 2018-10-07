import React, { Component } from 'react';
import {
    Dimensions,
    View,
    StyleSheet 
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ImageCenter } from '../common';
import { banners } from '../../../utils/MockDataUtils';
import { 
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class SliderAd extends Component {

    state = { activeSlide: 0 }

    renderPagination() {
        const { activeSlide } = this.state;
        const { containerDotStyle, dotStyle } = styles;
        return (
            <Pagination
                dotsLength={banners.length}
                activeDotIndex={activeSlide}
                containerStyle={containerDotStyle}
                dotStyle={dotStyle}
                inactiveDotStyle={dotStyle}
                inactiveDotOpacity={0.3}
                inactiveDotScale={1.0}
            />
        );
    }

    renderSliderImg({ item }) {
        return (
            <ImageCenter
                resizeMode={'cover'}
                source={item.img}
                style={StyleSheet.flatten([
                    style.full, 
                    { 
                        height: Dimensions.get('window').width / Size.ratio_2_1,
                        width: Dimensions.get('window').width 
                    }
                ])}
            />
        );
    }

    render() {
        const { containerStyle } = styles;
        return (
            <View style={containerStyle}>
                <Carousel
                    autoplay
                    autoplayDelay={300}
                    data={banners}
                    loop
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    renderItem={this.renderSliderImg.bind(this)}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                />
                {this.renderPagination()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: Color.white,
        height: (Dimensions.get('window').width / Size.ratio_2_1)
    },
    containerDotStyle: {
        position: 'absolute', 
        bottom: -20, 
        left: 0, 
        right: 0
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderColor: Color.primaryDark,
        borderRadius: Size.radius,
        borderWidth: 1,
        marginHorizontal: Size.spacing_xs,
        backgroundColor: Color.white
    }
});

export { SliderAd };
