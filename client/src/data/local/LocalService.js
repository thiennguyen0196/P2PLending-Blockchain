import { AsyncStorage } from 'react-native';

const PHONE_NUMBER = 'PHONE_NUMBER';
const TOKEN = 'TOKEN';
const FLAG_DIALOG = 'FLAG_DIALOG';

export const deleteAll = () => {
    return AsyncStorage.clear();
};

export const getPhoneNumber = () => {
    return AsyncStorage.getItem(PHONE_NUMBER);
};

export const getUserToken = () => {
    return AsyncStorage.getItem(TOKEN);
};

export const getFlag = () => {
    return AsyncStorage.getItem(FLAG_DIALOG);
};

export const setFlag = (value) => {
    return AsyncStorage.setItem(FLAG_DIALOG, value);
};

export const saveUserInfo = (phone, token) => {
    return AsyncStorage.multiSet([[PHONE_NUMBER, phone], [TOKEN, token]]);
};
