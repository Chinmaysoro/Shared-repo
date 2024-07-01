import { companyConstants } from "../constants/company.constants";
import { companyService } from "../services/";
import { alertActions } from "./alert.actions";
import { toast } from "react-toastify";

function fetchCompanies(company) {
  return (dispatch) => {
    dispatch(request(company));
    companyService.fetchCompanies(company).then(
      (result) => {
        dispatch(success(result));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: companyConstants.GET_COMPANY_REQUEST };
  }
  function success(data) {
    return { type: companyConstants.GET_COMPANY_SUCCESS, data };
  }
  function failure(error) {
    return { type: companyConstants.GET_COMPANY_FAILURE, error };
  }
}

function createCompany(data) {
  return (dispatch) => {
    dispatch(request(data));
    companyService.createCompany(data).then(
      (result) => {
        dispatch(success(result));

        if (result?.data?.status === "success") {
          dispatch(alertActions.success("company created successfully"));
          toast("company created successfully", {
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
    return { type: companyConstants.CREATE_COMPANY_REQUEST, data };
  }
  function success(data) {
    return { type: companyConstants.CREATE_COMPANY_SUCCESS, data };
  }
  function failure(error) {
    return { type: companyConstants.CREATE_COMPANY_FAILURE, error };
  }
}

function updateCompany(company) {
  return (dispatch) => {
    dispatch(request(company));
    companyService
      .updateCompany(company)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast("Company updated successfully", {
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
    return { type: companyConstants.UPDATE_COMPANY_REQUEST, data };
  }
  function success(data) {
    return { type: companyConstants.UPDATE_COMPANY_SUCCESS, data };
  }
  function failure(error) {
    return { type: companyConstants.UPDATE_COMPANY_FAILURE, error };
  }
}

function deleteCompany(user) {
  return (dispatch) => {
    dispatch(request(user));
    companyService
      .deleteCompany(user)
      .then((data) => {
        dispatch(success(data));

        if (data?.data?.status === "success") {
          toast("Company deleted successfully", {
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
    return { type: companyConstants.DELETE_COMPANY_REQUEST, data };
  }
  function success(data) {
    return { type: companyConstants.DELETE_COMPANY_SUCCESS, data };
  }
  function failure(error) {
    return { type: companyConstants.DELETE_COMPANY_FAILURE, error };
  }
}

export const companyActions = {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany
};