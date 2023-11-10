
import { GET_ADVANCE_REQUIRE, GET_ADVANCE_REQUIRE_FAILURE, GET_ADVANCE_REQUIRE_SUCCESS } from './constants';


export function getAdvanceRequire(data) {
    return {
        type: GET_ADVANCE_REQUIRE,
        data
    }
}
export function getAdvanceRequireSuccess(data) {
    return {
        type: GET_ADVANCE_REQUIRE_SUCCESS,
        data
    }
}
export function getAdvanceRequireFailure(data) {
    return {
        type: GET_ADVANCE_REQUIRE_FAILURE,
        data
    }
}
