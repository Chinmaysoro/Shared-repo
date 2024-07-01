import { departmentConstants } from "../constants/department.constants";
import { departmentService } from "../services/department.service";
import { alertActions } from "./alert.actions";
import { toast } from "react-toastify";

function fetchDepartments(department) {
  return (dispatch) => {
    dispatch(request(department));
    departmentService.fetchDepartments(department).then(
      (result) => {
        dispatch(success(result));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: departmentConstants.GET_DEPARTMENT_REQUEST };
  }
  function success(data) {
    return { type: departmentConstants.GET_DEPARTMENT_SUCCESS, data };
  }
  function failure(error) {
    return { type: departmentConstants.GET_DEPARTMENT_FAILURE, error };
  }
}

function addDepartment(data) {
  return (dispatch) => {
    dispatch(request(data));
    departmentService.addDepartment(data).then(
      (result) => {
        dispatch(success(result));

        if (result?.data?.status === "success") {
          dispatch(alertActions.success("Department created successfully"));
          toast("Department created successfully", {
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
    return { type: departmentConstants.ADD_DEPARTMENT_REQUEST, data };
  }
  function success(data) {
    return { type: departmentConstants.ADD_DEPARTMENT_SUCCESS, data };
  }
  function failure(error) {
    return { type: departmentConstants.ADD_DEPARTMENT_FAILURE, error };
  }
}

function updateDepartment(department) {
  return (dispatch) => {
    dispatch(request(department));
    departmentService
      .updateDepartment(department)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast("Department name updated", {
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
    return { type: departmentConstants.UPDATE_DEPARTMENT_REQUEST, data };
  }
  function success(data) {
    return { type: departmentConstants.UPDATE_DEPARTMENT_SUCCESS, data };
  }
  function failure(error) {
    return { type: departmentConstants.UPDATE_DEPARTMENT_FAILURE, error };
  }
}

function deleteDepartment(user) {
  return (dispatch) => {
    dispatch(request(user));
    departmentService
      .deleteDepartment(user)
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
    return { type: departmentConstants.DELETE_DEPARTMENT_REQUEST, data };
  }
  function success(data) {
    return { type: departmentConstants.DELETE_DEPARTMENT_SUCCESS, data };
  }
  function failure(error) {
    return { type: departmentConstants.DELETE_DEPARTMENT_FAILURE, error };
  }
}

export const departmentAction = {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
};