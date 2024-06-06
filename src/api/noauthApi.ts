import http from "@/service/http"

export const login = (form: LoginUser): Promise<R<TokenPair>> => http.post(`/noauth/login`, form)

