import http from "@/service/http";
export const login = (form) => http.post(`/noauth/login`, form);
//# sourceMappingURL=noauthApi.js.map