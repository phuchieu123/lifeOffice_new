import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Content, Icon, Right } from 'native-base';

import { navigationRef } from '../../../RootNavigation';


export default RightHeader = props => {
    const { children, enableFilterModal, focus } = props
    const [handleOpenFilterModalSupper, setHandleOpenFilterModalSupper] = useState(false);

    useEffect(() => {
        if (!focus && handleOpenFilterModalSupper) handleFilterSupper()
    }, [focus, handleOpenFilterModalSupper])

    const handChaneleOpenFilterModalSupper = () => {
        setHandleOpenFilterModalSupper(true)
    }

    const handleFilterSupper = (obj) => {
        setHandleOpenFilterModalSupper(false)
    }

    return <>
        {children}
        {enableFilterModal &&
            <>
                <Icon
                    type="SimpleLineIcons"
                    name="settings"
                    style={{ color: '#fff', marginHorizontal: 10 }}
                    onPress={handChaneleOpenFilterModalSupper}
                />
                {/* <FilterModalSupper
                    {...props}
                    isVisible={handleOpenFilterModalSupper}
                    onClose={() => setHandleOpenFilterModalSupper(false)}
                    onSave={handleFilterSupper}
                /> */}
            </>
        }

    </>
}
