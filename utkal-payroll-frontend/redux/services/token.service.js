import { useDispatch } from "react-redux";
import { userActions } from "../actions/user.actions";

const getLocalRefreshToken = () => {
  const userData = JSON.parse(localStorage.getItem("creuto-user"));
  return userData?.user?.refresh_token;
};
const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("creuto-user"));
  return user?.token;
};
const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("creuto-user"));
  user.token = token;
  localStorage.setItem("creuto-user", JSON.stringify(user));
};
const getUser = () => {
  return JSON.parse(localStorage.getItem("creuto-user"));
};

const setUser = (res) => {
  localStorage.setItem(
    "creuto-user",
    JSON.stringify({
      token: res?.accessToken,
      user: res?.user,
    })
  );
};
const removeUser = () => {
  localStorage.removeItem("creuto-user");
};
const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser
};
export default TokenService;
