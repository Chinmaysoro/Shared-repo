import axios from "axios";
import api from "./api";

function fetchCompanies(companies) {
  return api.get(`v1/company`, companies);
}
function createCompany(data) {
  return api.post(`v1/company`, data);
}
function updateCompany(data) {
  return api.patch(`v1/company/${data.id}`, data);
}
function deleteCompany(data) {
  return api.delete(`v1/company/${data.id}`);
}
export const companyService = {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany
};