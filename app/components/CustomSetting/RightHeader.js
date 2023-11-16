import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { DateRangePicker } from '../DateRangePicker';
import FilterModalSupper from './FilterModalSupper';
import NotificationPage from '../../containers/NotificationPage';
import { Alert } from 'react-native';
import * as RootNavigation from '../../RootNavigation';
import Message from '../../containers/Message';
export default 
RightHeader = props => {
    const { children, enableFilterModal, onSave, view } = props
    const [handleOpenFilterModalSupper, setHandleOpenFilterModalSupper] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);


    const handleOpenFilterModal = () => {
        setOpenFilterModal(true)
    }
    const handChaneleOpenFilterModalSupper = () => {
        setHandleOpenFilterModalSupper(true)
    }

    const handleFilterSupper = (obj) => {
        setHandleOpenFilterModalSupper(false)
        setTimeout(() => onSave(obj), 500)
    }


    return <>
        {children}
        {enableFilterModal &&
            <>

                <Icon
                    type="SimpleLineIcons"
                    name="settings"
                    style={{ color: '#fff', marginHorizontal: 10 , fontSize: 25}}
                    onPress={handChaneleOpenFilterModalSupper}
                    disabled={view === true}
                />
                <FilterModalSupper
                    {...props}
                    isVisible={handleOpenFilterModalSupper}
                    onClose={() => setHandleOpenFilterModalSupper(false)}
                    onSave={handleFilterSupper}
                   

                />
            </>
        }

    </>
}
