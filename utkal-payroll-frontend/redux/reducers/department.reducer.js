import { departmentConstants } from '../constants/department.constants';
export function department(state = {}, action) {
    switch (action.type) {
        case departmentConstants.GET_DEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case departmentConstants.GET_DEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                departments: action?.data
            };
        case departmentConstants.GET_DEPARTMENT_FAILURE:
            return { ...state, loading: false };

        case departmentConstants.ADD_DEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case departmentConstants.ADD_DEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                departments: action?.data
            };
        case departmentConstants.ADD_DEPARTMENT_FAILURE:
            return { ...state, loading: false };

        default:
            return state;
    }
}
