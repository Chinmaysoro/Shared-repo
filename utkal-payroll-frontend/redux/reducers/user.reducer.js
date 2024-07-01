import { userConstants } from "../constants/user.constants";
export function user(
  state = {
    loggedIn: false,
    accessToken: null,
    user: null,
  },
  action
) {
  switch (action.type) {
    case userConstants.USER_SIGNUP_REQUEST:
      return {
        // signup: true,
        ...state,
        loading: true,
      };
    case userConstants.USER_SIGNUP_SUCCESS:
      return {
        // signup: false,
        // stored_user: action?.data?.data?.data,
        ...state,
        loading: false,
        stored_user: action?.data?.data?.data,
      };
    case userConstants.USER_SIGNUP_FAILURE:
      return { 
        // signup: false 
        loading: false
      };

    case userConstants.USER_LOGIN_REQUEST:
      return {
        loggedIn: true,
      };
    case userConstants.USER_LOGIN_SUCCESS:
      return {
        loggedIn: true,
        accessToken: action?.data?.accessToken,
        user: action?.data?.user,
      };
    case userConstants.USER_LOGIN_FAILURE:
      return { loggedIn: false, ...state };

    case userConstants.BULK_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.BULK_USER_SUCCESS:
      return {
        ...state,
        loading: true,
        all_users: action?.data,
      };
    case userConstants.BULK_USER_FAILURE:
      return { ...state, loading: false };

    case userConstants.GET_USER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.GET_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        all_users: action?.data,
      };
    case userConstants.GET_USER_LIST_FAILURE:
      return { ...state, loading: false };

    case userConstants.GET_CALL_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.GET_CALL_HISTORY_SUCCESS:
      return {
        ...state,
        loading: true,
        all_users: action?.data,
      };
    case userConstants.GET_CALL_HISTORY_FAILURE:
      return { ...state, loading: false };

    case userConstants.USER_UPDATED_REQUEST:
      return {
        ...state,
        loading: true,
        userUniqId: action?.data?.userUniqId,
      };
    case userConstants.USER_UPDATED_SUCCESS:
      return {
        ...state,
        all_users: state?.all_users?.map((user) => {
          if (user?.uniq_id === state?.userUniqId) {
            return action?.data?.data?.user_data?.[0];
          }
          return user;
        }),
        loading: true,
      };
    case userConstants.USER_UPDATED_FAILURE:
      return { ...state, loading: false };

    case userConstants.NEW_USER_INVITED_REQUEST:
      return {
        ...state,
        user_invited: false,
      };
    case userConstants.NEW_USER_INVITED_SUCCESS:
      return {
        ...state,
        user_invited: true,
      };
    case userConstants.NEW_USER_INVITED_FAILURE:
      return { ...state, user_invited: false };

    case userConstants.ENABLE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        userUniqId: action?.data?.userUniqId,
      };
    case userConstants.ENABLE_USER_SUCCESS:
      return {
        ...state,
        loading: true,
        all_users: state?.all_users?.map((user) => {
          if (user?.uniq_id === state?.userUniqId) {
            return { ...user, is_active: 1 };
          }
          return user;
        }),
      };
    case userConstants.ENABLE_USER_FAILURE:
      return { ...state, loading: false };

    case userConstants.DISABLE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        userUniqId: action?.data?.userUniqId,
      };
    case userConstants.DISABLE_USER_SUCCESS:
      return {
        ...state,
        loading: true,
        all_users: state?.all_users?.map((user) => {
          if (user?.uniq_id === state?.userUniqId) {
            return { ...user, is_active: 0 };
          }
          return user;
        }),
      };
    case userConstants.DISABLE_USER_FAILURE:
      return { ...state, loading: false };

    case userConstants.GET_USER_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.GET_USER_ROLE_SUCCESS:
      return {
        ...state,
        loading: true,
        all_Roles: action?.data?.data?.data,
      };
    case userConstants.GET_USER_ROLE_FAILURE:
      return { ...state, loading: false };

    case userConstants.CHANGE_USER_ROLE_REQUEST:
      return {
        ...state,
        user_role_changed: false,
      };
    case userConstants.CHANGE_USER_ROLE_SUCCESS:
      return {
        ...state,
        user_role_changed: true,
      };
    case userConstants.CHANGE_USER_ROLE_FAILURE:
      return { ...state, user_role_changed: false };

    case userConstants.FORGOT_PASSWORD_REQUEST:
      return { loading: true };
    case userConstants.FORGOT_PASSWORD_SUCCESS:
      return { loading: false };
    case userConstants.FORGOT_PASSWORD_FAILURE:
      return { loading: false };

    case userConstants.LOG_OUT:
      return { loggedOut: true };
    case userConstants.COMPANY_USERS_REQUEST:
      return {
        ...state,
      };
    case userConstants.COMPANY_USERS_SUCCESS:
      return {
        ...state,
        companyUsers: action?.data?.data?.user_data,
      };
    case userConstants.COMPANY_USERS_FAILURE:
      return { ...state };
    case userConstants.REFRESH_TOKEN:
      return {
        ...state,
        user: {
          ...state.user,
          refresh_token: action?.refreshToken,
        },
      };
    default:
      return state;
  }
}
