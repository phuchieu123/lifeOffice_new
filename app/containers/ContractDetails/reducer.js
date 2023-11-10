import { produce } from 'immer';
import { GET_CONTRACT_DETIAILS,GET_CONTRACT_DETIAILS_SUCCESS,GET_CONTRACT_DETIAILS_FAILURE } from "./constants";



export const initialState = {
  isLoading: false,
  contractDetails: null,
};
/* eslint-disable default-case, no-param-reassign */
const contractDetailsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_CONTRACT_DETIAILS:
        draft.isLoading = true;
        draft.contractDetails = null;
        draft.contract = {};
        break;
      case GET_CONTRACT_DETIAILS_SUCCESS:
        draft.isLoading = false;
        draft.contractDetails = true
        draft.contract = action.data;
        break;
      case GET_CONTRACT_DETIAILS_FAILURE:
        draft.isLoading = false;
        draft.contractDetails = false;
        break;
    }
  });

export default contractDetailsReducer;