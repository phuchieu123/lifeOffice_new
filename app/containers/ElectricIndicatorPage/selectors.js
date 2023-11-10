import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectElectricIndicatorsListPageDomain = state => state.ElectricIndicatorsListPage || initialState;

const makeSelectElectricIndicatorsListPage = () =>
  createSelector(
    selectElectricIndicatorsListPageDomain,
    substate => substate,
  );

export default makeSelectElectricIndicatorsListPage;
export { selectElectricIndicatorsListPageDomain };
