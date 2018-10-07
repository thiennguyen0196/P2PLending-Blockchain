import React from 'react';
import { Icon } from 'react-native-elements';
import { 
    TabBarBottom,
    TabNavigator 
} from 'react-navigation';
import History from '../borrower/history/History';
import Loan from '../borrower/loan/Loan';
import Profile from '../borrower/profile/Profile';
import {
    Color,
    Size
} from '../../../style/Theme';

export default TabNavigator({
        Loan: { screen: Loan, navigationOptions: { title: 'Khoản Vay' } },
        History: { screen: History, navigationOptions: { title: 'Lịch Sử' } },
        Profile: { screen: Profile, navigationOptions: { title: 'Cá Nhân' } }
    },
    {
        initialRouteName: 'Loan',
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Loan') {
                    iconName = 'bank';
                } else if (routeName === 'History') {
                    iconName = 'history';
                } else if (routeName === 'Profile') {
                    iconName = 'user-circle-o';
                }
                return (
                    <Icon
                        color={tintColor} 
                        name={iconName}
                        size={Size.icon_sm}
                        type='font-awesome'
                    />
                );
            },
        }),
        animationEnabled: false,
        tabBarComponent: TabBarBottom,
        tabBarOptions: {
            activeTintColor: Color.primary,
            labelStyle: {
                fontSize: Size.font_sm
            },
            inactiveTintColor: Color.grayLight,
            style: {
                backgroundColor: Color.white,
            }
        },
        tabBarPosition: 'bottom',
        swipeEnabled: false,
    }
);

