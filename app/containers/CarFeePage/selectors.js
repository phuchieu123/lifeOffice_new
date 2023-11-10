import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCarFeePageDomain = state => state.CarFeePage || initialState;

const makeSelectCarFeePage = () =>
  createSelector(
    selectCarFeePageDomain,
    substate => substate,
  );

export default makeSelectCarFeePage;
export { selectCarFeePageDomain };
