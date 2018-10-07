import React, { Component } from 'react';
import { 
    ScrollView,
    StyleSheet
} from 'react-native';
import { Card } from 'react-native-elements';
import { 
    ButtonCustom,
    ErrorView,
    TextCenter
} from '../../../common';
import Detail from '../Detail';
import { ErrorMsg } from '../../../../../Constant';
import StringUtils from '../../../../../utils/StringUtils';
import {
    Color,
    Size
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
class HistoryDetailFail extends Component {
    static navigationOptions = {
        headerTitle: 'Chi Tiết Khoản Vay Thất Bại',
    };

    state = { 
        error: '',
        loan: null
    };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            this.setState({ 
                loan: params ? params.loan : null,
                loanContractId: params ? params.loanContractId : null
            });
        }
    }

    render() {
        const { error, loan, loanContractId } = this.state;
        const { params } = this.props.navigation.state;
        const transactionId = params ? params.transactionId : null;
        if (error) {
            return (
                <ErrorView error={error} />
            );
        }
        return (
            <ScrollView contentContainerStyle={style.fullScroll}>
                <Card containerStyle={styles.containerCardStyle}>
                    <TextCenter 
                        style={style.txtCaption}
                        text='Mã hợp đồng khoản vay' 
                    />
                    <TextCenter 
                        style={style.txtPrimary}
                        text={loanContractId ? `${StringUtils.formatId(loanContractId)}` : 'BLANK'} 
                    />
                </Card>

                <Detail data={loan ? loan.info || null : null} />

                <ButtonCustom
                    buttonActiveStyle={styles.buttonStyle}
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
    containerCardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: Size.spacing_lg,
        padding: Size.spacing_xs
    }
});

export default HistoryDetailFail;
