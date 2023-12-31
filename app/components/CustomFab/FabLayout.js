import React from 'react';
import {TouchableOpacity} from 'react-native'
import theme from '../../utils/customTheme';

export default FabLayout = props => {
    const { children, onPress, backgroundColor = theme.fabBackgroundColor, style  } = props

    return <TouchableOpacity
        style={{ backgroundColor, opacity: 0.9, ...style,  }}
        position="bottomRight"
        onPress={onPress} >
        {children}
    </TouchableOpacity>
}