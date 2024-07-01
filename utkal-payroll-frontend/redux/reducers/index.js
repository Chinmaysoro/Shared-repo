import { combineReducers } from 'redux';
import { userConstants } from '../constants';
import { alert } from './alert.reducer';
import { user } from './user.reducer';
import { department } from './department.reducer';
import { company } from './company.reducer';

const MainReducer = combineReducers({
    alert,
    user,
    department,
    company
});

const rootReducer = (state, action) => {
    if (action.type === userConstants.LOGOUT) {
        state = undefined;
    }
    return MainReducer(state, action);
};

export default rootReducer;
