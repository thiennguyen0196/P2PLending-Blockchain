import {
    StyleSheet
} from 'react-native';
import { Header } from 'react-navigation';
import {
    Color,
    Size
} from '../style/Theme';

export default StyleSheet.create({
    absoluteCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    alignRow: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cardFull: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: 0,
        padding: Size.spacing_xs
    },
    full: {
        flex: 1
    },
    fullScroll: {
        flexGrow: 1
    },
    fullCenter: {
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    fullCenterScroll: {
        alignContent: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
    list: {
        paddingVertical: Size.spacing_xs
    },
    iconHeader: {
        marginLeft: Size.spacing_xs,
        marginRight: Size.spacing
    },
    imgSpacingBottom: {
        marginBottom: Size.spacing_sm
    },
    txtCaption: {
        color: Color.gray,
        fontSize: Size.font_sm,
        marginBottom: Size.spacing_xs
    },
    txtGray: {
        color: Color.gray,
        fontSize: Size.font_sm,
        marginBottom: Size.spacing_xs
    },
    txtGreen: {
        color: Color.green,
    },
    txtHeader: {
        color: Color.primary,
        fontSize: Size.font_xxlg
    },
    txtPrimary: {
        color: Color.primary,
        fontSize: Size.font
    },
    txtRed: {
        color: Color.red
    },
    txtYellow: {
        color: Color.yellow
    },
    txtTitle: {
        color: Color.primaryDark,
        fontSize: Size.font,
        fontWeight: 'bold',
        marginBottom: Size.spacing_sm,
        marginHorizontal: Size.spacing,
        marginTop: Size.spacing_lg
    },
    txtTitleWhite: {
        color: Color.white,
        fontSize: Size.font,
        fontWeight: 'bold',
        marginBottom: Size.spacing_sm,
        marginHorizontal: Size.spacing,
        marginTop: Size.spacing_lg
    },
    viewPadding: {
        height: Header.HEIGHT
    }
});

