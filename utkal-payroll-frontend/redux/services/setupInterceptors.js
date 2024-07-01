import { userActions } from "../actions/user.actions";
import instance from "./api";
import TokenService from "./token.service";
const setup = (store) => {
  instance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        // x-access-token using for nodejs
        // config.headers["x-access-token"] = token;
        
        // authorization using for featherjs
        config.headers["authorization"] = `Bearer ${token}`;
        // config.headers["content-type"] = "multipart/form-data";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const { dispatch } = store;
  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig?.url !== "/authentication" && err.response) {
        // Access Token was expired
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const rs = await instance.put("/api/v1/users/getToken", {
              refresh_token: TokenService.getLocalRefreshToken(),
            });
            const { token, refresh_token } = rs.data?.data;
            dispatch(userActions.refreshToken(refresh_token));
            TokenService.updateLocalAccessToken(token);
            return instance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};
export default setup;
