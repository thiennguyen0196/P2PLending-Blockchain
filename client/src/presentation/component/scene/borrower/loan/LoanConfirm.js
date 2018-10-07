import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView
} from 'react-native';
import { 
    ButtonCustom,
    ConfirmDialog 
} from '../../../common';
import { Action } from '../../../../../Constant';
import Detail from '../Detail';
import { Size } from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
class LoanConfirm extends Component {
    static navigationOptions = {
        headerTitle: 'Xác Nhận Khoản Vay',
    };

    state = { data: null }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        this.setState({ data: params ? params.data : null });
    }

    onButtonPress() {
        const { data } = this.state;
        ConfirmDialog(
            'Xác nhận tạo khoản vay',
            'Bạn có chắc chắn muốn thực hiện khoản vay này?',
            true
        ).then(() => this.props.navigation.navigate('Gateway', { data, action: Action.CREATE_LOAN })
        ).catch(() => console.log('Cancel Confirm Create Loan'));
    }

    renderButton() {
        const { buttonStyle } = styles;
        return (
            <ButtonCustom 
                onPress={this.onButtonPress.bind(this)}
                buttonActiveStyle={buttonStyle}
                title='XÁC NHẬN'
            />
        );
    }

    render() {
        const { data } = this.state;
        return (
            <ScrollView contentContainerStyle={style.fullScroll}>
                <Detail
                    data={data || null}
                    highlight
                />

                {this.renderButton()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginBottom: Size.spacing,
        marginTop: 0,
        marginHorizontal: Size.spacing_lg
    },
});

export default LoanConfirm;
