import http from "@/service/http"

export const testGet = (): Promise<R<void>> => http.get(`/testGet`)