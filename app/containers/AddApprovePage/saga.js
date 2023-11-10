import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as constants from './constants';
import request, { requestApprove } from '../../utils/request';
import { REQUEST_METHOD } from '../../utils/constants';
import { API_APPROVE, API_OVERTIME, API_TAKE_LEAVE, MEETING_SCHEDULE } from '../../configs/Paths';
import ToastCustom from '../../components/ToastCustom';
import { addApproveFailure, addApproveOverTimeFailure, addApproveOverTimeSuccess, addApproveSuccess, addMeetingScheduleFailure, addMeetingScheduleSuccess, approveMeetingScheduleFailure, approveMeetingScheduleSuccess, approveOnleaveFailure, approveOnleaveSuccess, onleaveFailure, onleaveSuccess } from './actions';
import moment from 'moment';
import { makeSelectKanbanData } from '../App/selectors';

export function* addApprove(action) {
    let { data } = action;
    try {
        const url = yield call(API_APPROVE);

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(data),
        };

        const response = yield call(request, url, body);
        console.log(response, url);

        if (response) {
            yield put(addApproveSuccess());
            ToastCustom({ text: 'Thêm phê duyệt thành công', type: 'success' })
        } else {
            yield put(addApproveFailure());
            ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
        }
    } catch (err) {
        yield put(addApproveFailure());
        ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
    }
}
export function* addApproveOverTime(action) {

    let { data } = action;


    try {
        const url = yield call(API_OVERTIME);


        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({
                hrmEmployeeId: data.dataInfo,
                timeStart: data.timeStart,
                timeEnd: data.timeEnd,
                month: data.month,
                year: data.year
            }),
        };

        const response = yield call(request, url, body);

        const urlAprove = yield call(API_APPROVE);


        const bodyApprove = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({
                dataInfo: {
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                    month: data.month,
                    year: data.year,
                    updatedAt: data.overTimeDate
                },
                description: data.reason,
                overTimeDate: moment(data.overTimeDate).format('DD/MM/YYYY'),
                groupInfo: data.approveGroup,
                clientId: yield select(makeSelectKanbanData()),
                content: "",
                dynamicForm: "",
                collectionCode: 'HrmOverTime',
                field: null,
                name: data.name,
                subCode: data.subCode
            }),
        };

        const responseApprove = yield call(request, urlAprove, bodyApprove);

        if (responseApprove) {
            yield put(addApproveSuccess());
            ToastCustom({ text: 'Thêm phê duyệt thành công', type: 'success' })
        }
        else {
            yield put(addApproveFailure());
            ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })

        }

        if (response) {
            yield put(addApproveOverTimeSuccess());
            ToastCustom({ text: 'Thêm phê duyệt thành công', type: 'success' })
        }
        else {
            yield put(addApproveOverTimeFailure());
            ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
        }


    } catch (err) {

        yield put(addApproveFailure());
        yield put(addApproveOverTimeFailure());
        ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
    }
}


export function* addMeetingSchedule(action) {


    let { data } = action;

    try {
        const url = yield call(MEETING_SCHEDULE);

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({
                // createdBy: { name: data.createdBy.name, employeeId: data.createdBy._id },
                address: data.location ? data.location : '',
                createdBy: data.createdBy,
                timeEnd: data.timeEnd,
                timeStart: data.timeStart,
                date: data.timeStart,
                name: data.name,
                from: "5e0464fd09ea5f2a2c249306",
                kanbanStatus: "1",
                link: "Calendar/working-calendar",
                people: data.people,
                approved: data.approved,
                typeCalendar: '2',
                organizer: null,
                result: "",
                content: "",
                customers: []
            }),
            body: JSON.stringify(data)
        };

        const response = yield call(request, url, body);


        const urlWordOut = yield call(API_APPROVE);


        const bodyWordOut = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({

                approveGroup: "61e22b959ed5d607e382437c",
                clientId: yield select(makeSelectKanbanData()),
                collectionCode: "Calendar",
                content: "",
                convertMapping: "5d832729c252b2577006c5ab",
                dataInfo: {
                    address: data.location ? data.location : '',
                    createdBy: data.createdBy,
                    timeEnd: data.timeEnd,
                    timeStart: data.timeStart,
                    date: data.timeStart,
                    name: data.name,
                    from: "5e0464fd09ea5f2a2c249306",
                    kanbanStatus: "1",
                    link: "Calendar/working-calendar",
                    people: data.people,
                    approved: data.approved,
                    typeCalendar: '2',
                    organizer: null,
                    result: "",
                    content: "",
                    customers: []
                },
                description: "",
                dynamicForm: "",
                field: null,
                groupInfo: [{ order: 0, person: "614bd399fb2e4269d2ed6075", approve: 0, reason: "" }],
                name: data.name,
                subCode: ""

            }),
        };


        const responseWordOut = yield call(request, urlWordOut, bodyWordOut);



        if (responseWordOut) {
            ToastCustom({ text: 'Thêm phê duyệt công tác thành công tuyet voi', type: 'success' })
            yield put(approveMeetingScheduleSuccess());
        }


        else {
            yield put(approveMeetingScheduleFailure());
            ToastCustom({ text: 'Thêm phê duyệt công tác thất bại', type: 'danger' })
        }

        if (response) {
            ToastCustom({ text: 'Thêm phê duyệt công tác thành công', type: 'success' })
            yield put(addMeetingScheduleSuccess());
        } else {
            yield put(addMeetingScheduleFailure());
            ToastCustom({ text: 'Thêm phê duyệt công tác thất bại', type: 'danger' })
        }


    } catch (err) {
        yield put(addMeetingScheduleFailure());
        ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
    }


}



export function* addOnleave(action) {
    let { data } = action;

    try {
        const url = yield call(API_TAKE_LEAVE);

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({
                hrmEmployeeId: data.hrmEmployeeId,
                organizationUnitId: data.organizationUnitId,
                type: data.type,
                date: data.date,
                toDate: data.toDate,
                handover: data.handover
            }),
        };

        const response = yield call(request, url, body);


        const urlOnleave = yield call(API_APPROVE);



        const bodyOnleave = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({
                dataInfo: {
                    hrmEmployeeId: data.hrmEmployeeId,
                    organizationUnitId: data.organizationUnitId,
                    type: data.type,
                    date: data.date,
                    toDate: data.toDate,
                    handover: data.handover
                },
                approveGroup: data.approveGroup,
                description: data.description,
                clientId: yield select(makeSelectKanbanData()),
                collectionCode: "TakeLeave",
                content: "",
                convertMapping: "5d832729c252b2577006c5ab",
                dynamicForm: "",
                field: null,
                groupInfo: [{ order: 0, person: "61c295bff6e1d40a725f4176", approve: 0, reason: "" }],
                name: 'Nghỉ Phép' + '_' + new Date().getTime(),

            }),
        };
        const responseTakeLeave = yield call(request, urlOnleave, bodyOnleave);


        if (responseTakeLeave) {
            yield put(approveOnleaveSuccess());
            ToastCustom({ text: 'Thêm phê duyệt thành công', type: 'success' })
        } else {
            yield put(approveOnleaveFailure());
            ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
        }

        if (response) {
            yield put(onleaveSuccess());
            ToastCustom({ text: 'Thêm phê duyệt thành công', type: 'success' })
        } else {
            yield put(onleaveFailure());
            ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
        }
    } catch (err) {
        yield put(onleaveFailure());
        ToastCustom({ text: 'Thêm phê duyệt thất bại', type: 'danger' })
    }
}



// Individual exports for testing
export default function* addApprovePageSaga() {
    yield takeLatest(constants.ADD_APPROVE, addApprove);
    yield takeLatest(constants.ADD_APPROVE_OVER_TIME, addApproveOverTime);
    // yield takeLatest(constants.ADD_APPROVE_SUCCESS_ISLOADING, addApproveAllIsLoading);
    yield takeLatest(constants.ADD_MEETING_SCHEDULE, addMeetingSchedule);
    yield takeLatest(constants.ADD_ON_LEAVE, addOnleave);

}