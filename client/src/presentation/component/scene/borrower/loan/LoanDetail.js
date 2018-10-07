import React, { Component } from 'react';
import { 
    ScrollView,
    StyleSheet
} from 'react-native';
import { Card } from 'react-native-elements';
import { 
    ButtonCustom,
    TextCenter 
} from '../../../common';
import Detail from '../Detail';
import StringUtils from '../../../../../utils/StringUtils';
import { 
    Color, 
    Size 
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
class LoanDetail extends Component {
    static navigationOptions = {
        headerTitle: 'Chi Tiết Khoản Vay',
    };

    render() {
        const { buttonStyle, cardStyle } = styles;
        const { params } = this.props.navigation.state;
        console.log(params);
        const data = params ? params.data : null;
        const contractId = params ? params.contractId : null;
        const transactionId = params ? params.transactionId : null;
        return (
            <ScrollView contentContainerStyle={style.fullScroll}>
                <Card containerStyle={cardStyle}>
                    <TextCenter 
                        style={style.txtCaption}
                        text='Mã hợp đồng khoản vay' 
                    />
                    <TextCenter 
                        style={style.txtPrimary}
                        text={contractId ? `${StringUtils.formatId(contractId)}` : 'BLANK'} 
                    />
                </Card>
                <Detail data={data || null} />
                <ButtonCustom
                    buttonActiveStyle={buttonStyle}
                    icon={{
                        name: 'link', 
                        type: 'feather'
                    }}
                    onPress={() => 
                        this.props.navigation.navigate('WebTransaction', { transactionId })}
                    title='XEM GIAO DỊCH'
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginBottom: Size.spacing,
        marginHorizontal: Size.spacing_xlg,
        marginTop: 0
    },
    cardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: Size.spacing_lg,
        padding: Size.spacing_xs
    }
});

export default LoanDetail;
