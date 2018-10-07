import { Alert } from 'react-native';

const ConfirmDialog = (title, message, isShowCancelBtn) => {
    return new Promise((resolve, reject) => {
        let btnArr = null;
        if (isShowCancelBtn) {
            btnArr = [
                { text: 'Hủy bỏ', onPress: () => reject() },
                { text: 'OK', onPress: () => resolve() }
            ];
        } else {
            btnArr = [
                { text: 'OK', onPress: () => resolve() }
            ];
        }
        Alert.alert(
            title,
            message,
            btnArr,
            { cancelable: false }
        );
    });
};

export { ConfirmDialog };
