import http from "@/service/http";
export const getUserInfo = () => http.get(`/user/getUserInfo`);
export const logout = () => http.get(`/user/logout`);
//# sourceMappingURL=userApi.js.map