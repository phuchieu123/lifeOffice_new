import _ from 'lodash';
import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;
export const makeSelectGlobal = () => createSelector(selectGlobal, (substate) => substate);

export const makeSelectClientId = () => createSelector(selectGlobal, (globalState) => globalState.appInfo && globalState.appInfo.clientId);

export const makeSelectSocket = () => createSelector(selectGlobal, (globalState) => globalState.socket);
export const makeSelectSocketError = () => createSelector(selectGlobal, (globalState) => globalState.socketError);

export const makeSelectProfile = () => createSelector(selectGlobal, (globalState) => globalState.profile || {});
export const makeSelectUserRole = (code) => createSelector(selectGlobal, (globalState) => _.get(globalState.userRoles, `${code}`) || {});

export const makeSelectDepartments = () => createSelector(selectGlobal, (globalState) => globalState.departments);
export const makeSelectDepartmentsByLevel = () => createSelector(selectGlobal, (globalState) => globalState.departmentsLevel);

export const makeSelectViewConfig = (moduleCode, type = 'editDisplay') => createSelector(selectGlobal, (globalState) => {
    return _.get(globalState.viewConfig, `${moduleCode}.${type}`) || {}

});
export const makeSelectKanbanBosConfigs = () => createSelector(selectGlobal, (globalState) => globalState.kanbanBosConfigs);
export const makeSelectKanbanTaskConfigs = () => createSelector(selectGlobal, (globalState) => globalState.kanbanTaskConfigs);

export const hrmSourceCode = () => createSelector(selectGlobal, (globalState) => globalState.hrmSourceCode || {});
export const crmSourceCode = () => createSelector(selectGlobal, (globalState) => globalState.crmSourceCode || {});

export const makeSelectKanbanData = () => createSelector(selectGlobal, (globalState) => globalState.kanbanData);

export const makeSelectHasApprove = () => createSelector(selectGlobal, (globalState) => globalState.hasApprove);
export const makeSelectHasDriver = () => createSelector(selectGlobal, (globalState) => globalState.hasDriver);
export const makeSelectCallData = () => createSelector(selectGlobal, (globalState) => globalState.callData);
export default makeSelectGlobal
