import React from 'react';
import { Icon } from 'native-base';

export const icons = ({ name }) => {
    let iconName;
    switch (name) {
        case 'search':
            iconName = 'search';
            break;
        case 'keyboard-arrow-up':
            iconName = 'arrow-up';
            break;
        case 'keyboard-arrow-down':
            iconName = 'arrow-down';
            break;
        case 'close':
            iconName = 'times';
            break;
        case 'check':
            iconName = 'check';
            break;
        case 'cancel':
            iconName = 'times';
            break;
        default:
            iconName = null;
            break;
    }
    return <Icon name={iconName} type="FontAwesome5" style={name === 'cancel' ? styles.icon2 : styles.icon} />;
};

const styles = {
    icon: {
        fontSize: 16,
        color: '#000',
        paddingLeft: 5,
        paddingRight: 5,
    },
    icon2: {
        fontSize: 16,
        color: '#FFF',
        paddingLeft: 5,
        paddingRight: 5,
    },
};