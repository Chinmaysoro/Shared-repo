import { userConstants } from "../constants/user.constants";
import { userService } from "../services/user.service";
import { AuthenticationService, UserService } from '../services/feathers/rest.app';
import { alertActions } from "./alert.actions";
import TokenService from "../services/token.service";
import { toast } from "react-toastify";

function signup(user) {
  return (dispatch) => {
    dispatch(request(user));
    UserService
      .create({...user})
      .then((data) => {
        dispatch(success(data));
        const res = data?.data;
        // TokenService.setUser(res);
        dispatch(alertActions.success("Employee created Successfully"));
        toast("Employee created successfully", {
          hideProgressBar: true,
          autoClose: 4000,
          type: "success",
        });
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      });
  };
  function request(data) {
    return { type: userConstants.USER_SIGNUP_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.USER_SIGNUP_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.USER_SIGNUP_FAILURE, error };
  }
}

function login(user) {
  return (dispatch) => {
    dispatch(request(user));
    AuthenticationService.create(user)
      .then((data) => {
        dispatch(success(data));
        if (data?.accessToken) {
          const res = data;
          TokenService.setUser(res);
        } else {
          dispatch(alertActions.success("Invalid Email/password"));
          toast("Invalid Email/password", {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
        dispatch(alertActions.success("User Loggedin Successfully"));
        toast("User Loggedin Successfully", {
          hideProgressBar: true,
          autoClose: 4000,
          type: "success",
        });
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      });
  };

  function request(data) {
    return { type: userConstants.USER_LOGIN_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.USER_LOGIN_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.USER_LOGIN_FAILURE, error };
  }
}

function bulkRegistration(data) {
  return (dispatch) => {
    dispatch(request(data));
    userService.bulkRegistration(data).then(
      (result) => {
        dispatch(success(result));

        if (result?.data?.status === "success") {
          dispatch(alertActions.success("Employees created successfully"));
          toast("Employees created successfully", {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } else {
          dispatch(alertActions.error(result?.data?.message));
        }
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error?.toString()));
      }
    );
  };

  function request(data) {
    return { type: userConstants.BULK_USER_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.BULK_USER_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.BULK_USER_FAILURE, error };
  }
}

function forgotPassword(values) {
  return (dispatch) => {
    dispatch(request(values));
    userService
      .forgotPassword(values)
      .then((data) => {
        dispatch(success(data));
        dispatch(alertActions.success(data?.data?.message.toString()));
      })
      .catch((error) => dispatch(failure(error.toString())));
  };

  function request(data) {
    return { type: userConstants.FORGOT_PASSWORD_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.FORGOT_PASSWORD_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.FORGOT_PASSWORD_FAILURE, error };
  }
}
function logout() {
  toast("Logged out successfully", {
    hideProgressBar: true,
    autoClose: 4000,
    type: "success",
  });
  return { type: userConstants.LOG_OUT };
}

function refreshToken(refreshToken) {
  return (dispatch) => {
    dispatch(success(refreshToken));
  };
  function success(refreshToken) {
    return { type: userConstants.REFRESH_TOKEN, refreshToken };
  }
}

function getUserList(user) {
  return (dispatch) => {
    dispatch(request(user));
    userService
      .getUserList(user)
      .then((data) => {
        dispatch(success(data?.data));
        if (data?.status !== "success") {
          toast(data?.data?.message?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        toast(error.toString(), {
          hideProgressBar: true,
          autoClose: 4000,
          type: "error",
        });
      });
  };

  function request(data) {
    return { type: userConstants.GET_USER_LIST_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.GET_USER_LIST_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GET_USER_LIST_FAILURE, error };
  }
}

function updateUser(user) {
  return (dispatch) => {
    dispatch(request(user));
    userService
      .updateUser(user)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast("User name updated", {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } else {
          toast(data?.data?.status?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        toast(error.toString(), {
          hideProgressBar: true,
          autoClose: 4000,
          type: "error",
        });
      });
  };

  function request(data) {
    return { type: userConstants.USER_UPDATED_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.USER_UPDATED_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.USER_UPDATED_FAILURE, error };
  }
}

function enableUser(user) {
  return (dispatch) => {
    dispatch(request(user));
    userService
      .enableUser(user)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast(data?.data?.message, {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } else {
          toast(data?.data?.status?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        toast(error.toString(), {
          hideProgressBar: true,
          autoClose: 4000,
          type: "error",
        });
      });
  };

  function request(data) {
    return { type: userConstants.ENABLE_USER_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.ENABLE_USER_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.ENABLE_USER_FAILURE, error };
  }
}

function deleteEmployee(user) {
  return (dispatch) => {
    dispatch(request(user));
    userService
      .deleteEmployee(user)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast("Employee deleted successfully", {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } else {
          dispatch(failure(error.toString()));
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
      });
  };

  function request(data) {
    return { type: userConstants.DELETE_USER_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.DELETE_USER_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.DELETE_USER_FAILURE, error };
  }
}

function disableUser(user) {
  return (dispatch) => {
    dispatch(request(user));
    userService
      .disableUser(user)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast(data?.data?.message, {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } else {
          toast(data?.data?.status?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        toast(error.toString(), {
          hideProgressBar: true,
          autoClose: 4000,
          type: "error",
        });
      });
  };

  function request(data) {
    return { type: userConstants.DISABLE_USER_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.DISABLE_USER_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.DISABLE_USER_FAILURE, error };
  }
}

function getCallHistory(data){
  return (dispatch) => {
    dispatch(request(data));
    userService
      .getCallHistory(data)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status !== "success") {
          dispatch(failure(error.toString()));
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
      });
  };

  function request(data) {
    return { type: userConstants.GET_CALL_HISTORY_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.GET_CALL_HISTORY_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GET_CALL_HISTORY_FAILURE, error };
  }
}

function getUserRole(data) {
  return (dispatch) => {
    dispatch(request(data));
    userService
      .getUserRole(data)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status !== "success") {
          toast(data?.data?.status?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        toast(error.toString(), {
          hideProgressBar: true,
          autoClose: 4000,
          type: "error",
        });
      });
  };

  function request(data) {
    return { type: userConstants.GET_USER_ROLE_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.GET_USER_ROLE_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.GET_USER_ROLE_FAILURE, error };
  }
}

function changeUserRole(data) {
  return (dispatch) => {
    dispatch(request(data));
    userService
      .changeUserRole(data)
      .then((data) => {
        dispatch(success(data));
        if (data?.data?.status === "success") {
          toast(data?.data?.message?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } else {
          toast(data?.data?.status?.toString(), {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        toast(error.toString(), {
          hideProgressBar: true,
          autoClose: 4000,
          type: "error",
        });
      });
  };

  function request(data) {
    return { type: userConstants.CHANGE_USER_ROLE_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.CHANGE_USER_ROLE_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.CHANGE_USER_ROLE_FAILURE, error };
  }
}

export const userActions = {
  signup,
  login,
  forgotPassword,
  logout,
  refreshToken,
  getUserList,
  updateUser,
  enableUser,
  disableUser,
  getUserRole,
  changeUserRole,
  bulkRegistration,
  getCallHistory,
  deleteEmployee
};