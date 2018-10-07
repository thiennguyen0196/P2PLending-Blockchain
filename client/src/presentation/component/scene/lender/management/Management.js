import { 
    TabBarTop,
    TabNavigator 
} from 'react-navigation';
import ManagemenOverall from './ManagemenOverall';
import ManagementWaiting from './ManagementWaiting';
import ManagementSuccess from './ManagementSuccess';
import {
    Color,
    Size
} from '../../../../style/Theme';

export default TabNavigator({
        ManagemenOverall: { 
            screen: ManagemenOverall, 
            navigationOptions: { title: 'Tổng Quan' } 
        },
        ManagementSuccess: { 
            screen: ManagementSuccess, 
            navigationOptions: { title: 'Thành Công' } 
        },
        ManagementWaiting: { 
            screen: ManagementWaiting, 
            navigationOptions: { title: 'Đang Đợi' } 
        }
    },
    {
        initialRouteName: 'ManagemenOverall',
        animationEnabled: true,
        tabBarComponent: TabBarTop,
        tabBarOptions: {
            activeTintColor: Color.primary,
            labelStyle: {
                fontSize: Size.font_sm
            },
            inactiveTintColor: Color.gray,
            indicatorStyle: {
                backgroundColor: Color.primary
            },
            upperCaseLabel: false,
            style: {
                backgroundColor: Color.white
            }
        },
        tabBarPosition: 'top',
        swipeEnabled: true,
    }
);

