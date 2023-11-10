/*
 *
 * LoginPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {

};

const hrmReportPage = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.CLEANUP:
        break;
    }
  });

export default hrmReportPage;
