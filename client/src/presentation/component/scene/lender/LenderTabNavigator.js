import React from 'react';
import { Icon } from 'react-native-elements';
import { 
    TabBarBottom,
    TabNavigator 
} from 'react-navigation';
import Invest from '../lender/invest/Invest';
import Management from '../lender/management/Management';
import Profile from '../lender/profile/Profile';
import {
    Color,
    Size
} from '../../../style/Theme';

export default TabNavigator({
        Management: { screen: Management, navigationOptions: { title: 'Quản Lý' } },
        Invest: { screen: Invest, navigationOptions: { title: 'Đầu Tư' } },
        Profile: { screen: Profile, navigationOptions: { title: 'Cá Nhân' } }
    },
    {
        initialRouteName: 'Management',
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Management') {
                    iconName = 'bank';
                } else if (routeName === 'Invest') {
                    iconName = 'shopping-cart';
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

