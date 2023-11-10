import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectWaterIndicatorsListPageDomain = state => state.WaterIndicatorsListPage || initialState;

const makeSelectWaterIndicatorsListPage = () =>
  createSelector(
    selectWaterIndicatorsListPageDomain,
    substate => substate,
  );

export default makeSelectWaterIndicatorsListPage;
export { selectWaterIndicatorsListPageDomain };
