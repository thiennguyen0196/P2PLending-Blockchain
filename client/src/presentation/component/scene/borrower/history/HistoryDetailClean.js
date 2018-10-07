import React, { Component } from 'react';
import { 
    ActivityIndicator,
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { Card } from 'react-native-elements';
import { 
    ButtonCustom,
    ErrorView,
    TimeLine,
    TextCenter
} from '../../../common';
import Detail from '../Detail';
import { onGetSettlement } from '../../../../../domain';
import { ErrorMsg } from '../../../../../Constant';
import DataUtils from '../../../../../utils/DataUtils';
import StringUtils from '../../../../../utils/StringUtils';
import { 
    Color,
    Size 
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
class HistoryDetailClean extends Component {
    static navigationOptions = {
        headerTitle: 'Chi Tiết Khoản Đã Vay',
    };

    state = { 
        error: '',
        isLoadFirstTime: true,
        loading: false,
        loan: null,
        loanContractId: null,
        settlement: null
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onGetData();
        });
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

    onGetData() {
        const { loanContractId } = this.state;
        this.setState({ loading: true });
        onGetSettlement(loanContractId)
            .then(result => {
                console.log(result);
                this.setState({ loading: false, isLoadFirstTime: false });
                if (!result.data ||
                    !Array.isArray(result.data)) {
                    this.setState({ 
                        error: ErrorMsg.COMMON,
                        settlement: null
                    });
                    return;
                }
                this.setState({ settlement: result.data });
            })
            .catch(error => {
                this.setState({ 
                    error: error.msg, 
                    isLoadFirstTime: false,
                    loading: false, 
                    settlement: null
                });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    render() {
        const { error, isLoadFirstTime, loading, loan, loanContractId, settlement } = this.state;
        const timeline = DataUtils.combineSettlementTimelineBorrowerData(settlement || null);
        const { params } = this.props.navigation.state;
        const transactionId = params ? params.transactionId : null;
        if (error) {
            return (
                <ErrorView
                    onPress={this.onGetData.bind(this)}
                    error={error}
                    loading={loading}
                />
            );
        }
        if (isLoadFirstTime) {
            return (
                <ActivityIndicator
                    color={Color.primary}
                    size='large'
                    style={style.absoluteCenter}
                />
            );
        }
        return (
            <ScrollView 
                contentContainerStyle={style.fullScroll}
                refreshControl={
                    <RefreshControl
                        colors={[Color.primary, Color.orange]}
                        refreshing={loading} 
                        onRefresh={this.onGetData.bind(this)}
                        tintColor={Color.primary}
                    />
                }
            >
                <Card containerStyle={style.cardFull}>
                    <TextCenter 
                        style={style.txtCaption}
                        text='Mã hợp đồng khoản vay' 
                    />
                    <TextCenter 
                        style={style.txtPrimary}
                        text={loanContractId ? `${StringUtils.formatId(loanContractId)}` : 'BLANK'} 
                    />
                </Card>
                <Text style={style.txtTitle}>TIẾN ĐỘ THANH TOÁN</Text>
                <TimeLine data={timeline} />

                <Text style={style.txtTitle}>KHOẢN VAY</Text>
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
    }
});


export default HistoryDetailClean;
