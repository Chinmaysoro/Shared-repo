import { companyConstants } from '../constants/company.constants';
export function company(state = {}, action) {
    switch (action.type) {
        case companyConstants.GET_COMPANY_REQUEST:
            return {
                ...state,
                loading: true
            };
        case companyConstants.GET_COMPANY_SUCCESS:
            return {
                ...state,
                loading: false,
                companies: action?.data
            };
        case companyConstants.GET_COMPANY_FAILURE:
            return { ...state, loading: false };

        case companyConstants.CREATE_COMPANY_REQUEST:
            return {
                ...state,
                loading: true
            };
        case companyConstants.CREATE_COMPANY_SUCCESS:
            return {
                ...state,
                loading: false,
                companies: action?.data
            };
        case companyConstants.CREATE_COMPANY_FAILURE:
            return { ...state, loading: false };

        default:
            return state;
    }
}
