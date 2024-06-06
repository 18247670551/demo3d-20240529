import http from "@/service/http"

export const getUserInfo = (): Promise<R<UserInfo>> => http.get(`/user/getUserInfo`)
export const logout = (): Promise<R<boolean>> => http.get(`/user/logout`)