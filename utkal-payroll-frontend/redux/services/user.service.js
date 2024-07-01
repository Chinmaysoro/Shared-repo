import axios from 'axios';
import api from './api';

function signup(user) {
    return api.post(`v1/users`, user);
}
function login(user) {
    return api.post(`v1/authentication`, user);
}
function bulkRegistration(data) {
    return api.post(`v1/bulk-registration`, data);
}
function forgotPassword(data) {
    return api.post(`v1/users/forgetPassword`, data);
}
function getToken(data) {
    return api.post(`v1/users/getToken`, data);
}
function getUserList(user) {
    return api.get(`v1/users`, user);
}
function getCallHistory(user) {
    let date = {
        startdate: user?.startDate,
        endDate: user?.endDate
    };
    if (user) {
        return api.get(`v1/call-details?$populate[0]=createdBy&dateTime%5B%24gte%5D=${date.startdate}&dateTime%5B%24lte%5D=${date.endDate}`);
    } else {
        return api.get(`v1/call-details?$populate[0]=createdBy`);
    }
}
function deleteEmployee(user) {
    return api.delete(`v1/users/${user.id}`);
}
function updateUser(user) {
    return api.patch(`v1/users/${user.id}`, user);
}
export const userService = {
    signup,
    login,
    forgotPassword,
    getToken,
    getUserList,
    updateUser,
    bulkRegistration,
    getCallHistory,
    deleteEmployee
};
