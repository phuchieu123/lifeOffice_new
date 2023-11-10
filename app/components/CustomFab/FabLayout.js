import React from 'react';
import { Fab } from 'native-base';
import theme from '../../utils/customTheme';

export default FabLayout = props => {
    const { children, onPress, backgroundColor = theme.fabBackgroundColor, style = {} } = props

    return <Fab
        style={{ backgroundColor, opacity: 0.9, ...style }}
        position="bottomRight"
        onPress={onPress} >
        {children}
    </Fab>
}