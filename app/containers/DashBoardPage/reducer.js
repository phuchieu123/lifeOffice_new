/*
 *
 * DashBoardPage reducer
 *
 */
import { produce } from 'immer';
import { GET_REPORT, GET_REPORT_SUCCESS, GET_REPORT_FAILURE } from './constants';

export const initialState = {
};

/* eslint-disable default-case, no-param-reassign */
const dashBoardPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
     
    }
  });

export default dashBoardPageReducer;
