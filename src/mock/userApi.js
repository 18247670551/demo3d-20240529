import dayjs from "dayjs";
import { Random } from "mockjs";
export default [
    {
        url: "/mock/user/getUserInfo",
        method: "get",
        timeout: 3000,
        response: () => {
            return {
                code: 0,
                msg: "成功",
                data: {
                    clientType: "web",
                    loginTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    id: Random.integer(1000000, 99999999).toString(),
                    name: Random.cname(),
                    phone: "18999999999",
                    avatar: "",
                }
            };
        }
    },
    {
        url: "/mock/user/logout",
        method: "get",
        timeout: 3000,
        response: () => {
            return {
                code: 0,
                msg: "成功"
            };
        }
    },
];
//# sourceMappingURL=userApi.js.map