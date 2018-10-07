import React, { Component } from 'react';
import { 
    Text,
    View,
    StyleSheet 
} from 'react-native';
import { 
    Card, 
    Icon 
} from 'react-native-elements';
import {
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class ItemNotification extends Component {
    render() {
        const { data } = this.props;
        const { cardStyle, containerIconStyle, containerTxtViewStyle, txtBigStyle } = styles;
        return (
            <Card
                containerStyle={cardStyle}
                flexDirection='row'
            >
                <Icon
                    containerStyle={containerIconStyle}
                    color={data.iconColor}
                    name={data.iconName}
                    reverse
                    size={Size.icon_sm}
                    type={data.iconType}
                />
                <View style={containerTxtViewStyle}>
                    <Text style={txtBigStyle}>
                        {data.notiName}
                    </Text>
                    <Text style={style.txtCaption}>
                        {data.notiDescription}
                    </Text>
                </View>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: 0,
        padding: Size.spacing_xs
    },
    containerIconStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        margin: Size.spacing_sm
    },
    containerTxtViewStyle: {
        justifyContent: 'center',
        marginHorizontal: Size.spacing_xs
    },
    txtBigStyle: {
        color: Color.gray,
        fontSize: Size.font_lg,
        fontWeight: 'bold',
        marginBottom: Size.spacing_xs
    }
});

export { ItemNotification };
