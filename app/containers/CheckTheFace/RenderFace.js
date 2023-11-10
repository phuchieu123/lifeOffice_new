import React from 'react';
import { View } from 'native-base';
import styles from './styles';

const RenderFace = (props) => {
    const { face, ...rest } = props
    const { bounds, rollAngle, yawAngle } = face || {};

    return (
        !face ? null : <View
            {...rest}
            // transform={[
            //     { perspective: 600 },
            //     // { rotateZ: `${rollAngle.toFixed(0)}deg` },
            //     // { rotateY: `${yawAngle.toFixed(0)}deg` },
            // ]}
            style={[
                styles.face,
                {
                    ...bounds.size,
                    left: bounds.origin.x,
                    top: bounds.origin.y,
                },
            ]}
        />
    );
};

export default RenderFace