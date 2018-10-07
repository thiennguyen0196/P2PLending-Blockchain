import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Timeline from 'react-native-timeline-listview';
import {
    Color,
    Size
} from '../../style/Theme';

class TimeLine extends Component {
    render() {
        const { circleStyle, descriptionStyle, separatorStyle, 
            timeContainerStyle, timeStyle, timeLineStyle, titleStyle } = styles;
        return (
            <Timeline
                {...this.props}
                circleColor={Color.grayLight}
                circleSize={26}
                descriptionStyle={descriptionStyle}
                circleStyle={circleStyle}
                innerCircle={'icon'}
                lineColor={Color.grayLight}
                lineWidth={3}
                options={{
                    removeClippedSubviews: false
                }}
                separatorStyle={separatorStyle}
                separator
                style={timeLineStyle}
                timeContainerStyle={timeContainerStyle}
                timeStyle={timeStyle}
                titleStyle={titleStyle}
            />
        );
    }
}

const styles = StyleSheet.create({
    circleStyle: {
        left: 102 + 8
    },
    descriptionStyle: {
        color: Color.gray,
        fontSize: Size.font_sm
    },
    separatorStyle: {
        backgroundColor: Color.grayLight
    },
    timeStyle: {
        alignSelf: 'center',
        color: Color.white,
        fontSize: Size.font_sm
    },
    timeContainerStyle: {
        backgroundColor: Color.primary,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing_sm,
        minWidth: 102
    },
    timeLineStyle: {
        marginHorizontal: Size.spacing,
        marginVertical: Size.spacing_sm
    },
    titleStyle: {
        color: Color.gray,
        fontSize: Size.font_lg,
        fontWeight: 'normal'
    }
});

export { TimeLine };
