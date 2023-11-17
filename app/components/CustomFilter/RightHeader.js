import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FilterModal from './FilterModal';

export default RightHeader = props => {
    const { children, enableFilterModal, onSave } = props
    const [openFilterModal, setOpenFilterModal] = useState(false);

    const handleOpenFilterModal = () => {
        setOpenFilterModal(true)
    }

    const handleFilter = (obj) => {
        setOpenFilterModal(false)
        setTimeout(() => onSave(obj), 500)
    }

    return <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {children}
        {enableFilterModal &&
            <View>
                <Icon
                    name="filter"
                    type="FontAwesome"
                    style={{ color: '#fff', marginHorizontal: 10, fontSize: 28, }}
                    onPress={handleOpenFilterModal}
                />
                {/* <Text style={{ position: 'absolute', alignSelf: 'center', bottom: 0, right: 5, color: '#fff', fontSize: 9 }}>10</Text> */}
                <FilterModal
                    {...props}
                    isVisible={openFilterModal}
                    onClose={() => setOpenFilterModal(false)}
                    onSave={handleFilter}
                />
            </View>
        }
    </View>
}

