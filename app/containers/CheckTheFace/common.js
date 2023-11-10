// import React from 'react';
// import { Camera } from "expo-camera";
// import { Icon } from "native-base";
// import styles from "./styles";
// import moment from 'moment';

// export const IN = 'IN';
// export const OUT = 'OUT';

// export const FRONT = Camera.Constants.Type.front
// export const BACK = Camera.Constants.Type.back

// export const initialSettings = [{
//     timeInCheck: false,
//     timeOutCheck: false,
//     timeInList: [{

//     }],
//     timeOutList: [{

//     }],
//     workingList: [{
//         work: moment('8', 'H'),
//         end: moment('17:30', 'HH:mm')
//     }]
// }]

// export const PROGRESS = {
//     ON_RECOGNIGE: { r_status: 0, msg: "Đang tiến hành nhận diện", r_statusColor: "yellow" },
//     RECOGNIGE_SUCCESS: { r_status: 2, msg: "Nhận diện thành công", r_statusColor: "green" },
//     RECOGNIGE_FAILURE: { r_status: 3, msg: "Nhận diện thất bại", r_statusColor: "red" },
//     ON_TIMEKEEPING: { tk_status: 1, msg: "Đang tiến hành chấm công", tk_statusColor: "orange" },
//     TIMEKEEPING_SUCCESS: { tk_status: 4, msg: "Chấm công thành công", tk_statusColor: "green" },
//     TIMEKEEPING_FAILURE: { tk_status: 5, msg: "Chấm công thất bại", tk_statusColor: "red" },
//     HAD_TIMEKEEPING: { tk_status: 6, msg: "Bạn đã chấm công", tk_statusColor: "aqua" },
// }

// export const getTimeKeepingStatus = (status, color) => {
//     switch (status) {
//         case PROGRESS.ON_TIMEKEEPING.tk_status:
//             return <Icon type="MaterialCommunityIcons" name="calendar-edit" style={{ ...styles.statusIcon, color }} />
//         case PROGRESS.TIMEKEEPING_SUCCESS.tk_status:
//             return <Icon type="MaterialCommunityIcons" name="calendar-star" style={{ ...styles.statusIcon, color }} />
//         case PROGRESS.TIMEKEEPING_FAILURE.tk_status:
//             return <Icon type="MaterialCommunityIcons" name="calendar-remove" style={{ ...styles.statusIcon, color }} />
//         case PROGRESS.HAD_TIMEKEEPING.tk_status:
//             return <Icon type="MaterialCommunityIcons" name="calendar-alert" style={{ ...styles.statusIcon, color }} />
//         default:
//             return null
//     }
// }

// export const getRecognizeStatus = (status, color) => {
//     switch (status) {
//         case PROGRESS.ON_RECOGNIGE.r_status:
//             return <Icon type="MaterialIcons" name="sentiment-neutral" style={{ ...styles.statusIcon, color }} />
//         case PROGRESS.RECOGNIGE_FAILURE.r_status:
//             return <Icon type="MaterialIcons" name="sentiment-very-dissatisfied" style={{ ...styles.statusIcon, color }} />
//         case PROGRESS.RECOGNIGE_SUCCESS.r_status:
//             return <Icon type="MaterialIcons" name="sentiment-very-satisfied" style={{ ...styles.statusIcon, color }} />
//         default:
//             return null
//     }
// }
