
import React from 'react';
import { View } from 'react-native';
import { Icon, Button } from 'native-base';

const ToggleIcon = (props) => {
    const { allowRemove, onRemove } = props;
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
            {allowRemove && (
                <Button transparent onPress={onRemove} iconRight>
                    <Icon type="FontAwesome" name="remove" color="red" style={styles.icon} />
                </Button>
            )}
            <Icon type="FontAwesome" name="caret-down" color="red" style={styles.icon} />
        </View>
    );
};

export default ToggleIcon


const styles = {
    icon: {
        fontSize: 16,
        color: '#000',
        paddingLeft: 0,
        paddingRight: 0,
    },
};