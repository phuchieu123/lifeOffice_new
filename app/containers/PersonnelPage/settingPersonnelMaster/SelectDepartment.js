import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectDepartments, makeSelectDepartmentsByLevel } from '../../App/selectors';
import CustomMultiSelect from 'components/CustomMultiSelect';

const SelectDepartment = props => {
    const { departments, onChange, selectedItems, onRemoveSelectedItem } = props

    return <CustomMultiSelect
        {...props}
        items={departments}
    />
}

const mapStateToProps = createStructuredSelector({
    departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(SelectDepartment);