import axios from "axios";
import api from "./api";

function fetchDepartments(department) {
  return api.get(`v1/department`, department);
}
function addDepartment(data) {
  return api.post(`v1/department`, data);
}
function updateDepartment(data) {
  return api.patch(`v1/department/${data.id}`, data);
}
function deleteDepartment(data) {
  return api.delete(`v1/department/${data.id}`);
}
export const departmentService = {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
};