import React, { Component } from 'react';
import { 
    Dimensions,
    View,
    Text,
    StyleSheet 
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { 
    Color,
    Size
} from '../../style/Theme';

class PieChart extends Component {

    state = { 
        pieSize: (Dimensions.get('window').width - (Size.spacing * 2)) / 2,
        pieData: [
            { x: ' ', y: 0 },
            { x: ' ', y: 0 },
            { x: ' ', y: 100 }
        ],
        renderFirstTime: true
    }

    componentDidMount() {
        this.setState({ renderFirstTime: false });
    }

    componentWillReceiveProps(nextProps) {
        const { renderFirstTime } = this.state;
        if (renderFirstTime === false) {
            this.setState({ pieData: nextProps.data });
        }
    }

    renderDescriptItem(description, color) {
        const { descripStyle, descriptBlockStyle, descriptTxtStyle } = styles;
        return (
            <View 
                style={descripStyle}
                key={color.toString()}
            >
                <View 
                    style={StyleSheet.flatten([descriptBlockStyle, 
                        { backgroundColor: color || Color.grayLightExtreme }])} 
                />
                <Text style={descriptTxtStyle}>{description || 'BLANK'}</Text>
            </View>
        );
    }

    renderDescription() {
        const { containerDescripStyle } = styles;
        if (this.props.colors) {
            return (
                <View style={containerDescripStyle}>
                    {
                        this.props.colors.map((color, i) => {
                            if (this.props.descripts && 
                                this.props.descripts.length === this.props.colors.length) {
                                    return this.renderDescriptItem(this.props.descripts[i], color);
                            }
                            return this.renderDescriptItem(null, color);
                        })
                    }
                </View>  
            );
        }
        return (
            <View style={containerDescripStyle}>
                {this.renderDescriptItem(null, null)}
            </View> 
        );
    }

    render() {
        const { pieSize, pieData } = this.state;
        const { containerStyle, pieStyle } = styles;
        return (
            <View style={containerStyle}>
                <View style={pieStyle}>
                    <VictoryPie
                        {...this.props}
                        animate={{
                            duration: 1000,
                        }}
                        colorScale={this.props.data ? 
                            (this.props.colors || [Color.grayLightExtreme]) : 
                            [Color.grayLightExtreme]}
                        data={pieData}
                        padding={0}
                        height={pieSize}
                        width={pieSize}
                        style={{ 
                            labels: { 
                                fill: Color.white, 
                                fontSize: Size.font_sm 
                            } 
                        }}
                    />
                </View>
                {this.renderDescription()}
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: Size.spacing
    },
    containerDescripStyle: {
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    descripStyle: {
        flexDirection: 'row',
        marginVertical: Size.spacing_xs,
    },
    descriptBlockStyle: {
        borderRadius: Size.radius_sm,
        marginRight: Size.spacing_xs, 
        height: Size.icon_xs,
        width: Size.icon_xs
    },
    descriptTxtStyle: {
        alignSelf: 'center',
        color: Color.gray,
        flex: 1, 
        fontSize: Size.font_sm
    },
    pieStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginRight: Size.spacing,
        width: (Dimensions.get('window').width - (Size.spacing * 2)) / 2,
        height: (Dimensions.get('window').width - (Size.spacing * 2)) / 2,
    }
});

export { PieChart };
