import _ from "lodash";
import { MockLoginPhone, MockLoginPassword } from "@/constants/mock";
import { Random } from "mockjs";
export default [
    {
        url: "/mock/noauth/login",
        method: "post",
        timeout: 3000,
        response: (params) => {
            // todo 彩蛋
            const roll = _.random(0, 10);
            if (roll < 3) {
                const msg = "你中奖了, 模拟登录, 随机数(1-10), 小于3失败, 你roll了 " + roll;
                console.log(msg);
                return { code: 1, msg };
            }
            if (params.body.phone == MockLoginPhone && params.body.password == MockLoginPassword) {
                return { code: 0, msg: "成功", data: { accessToken: Random.string(200), refreshToken: Random.string(150) } };
            }
            else {
                return { code: 1, msg: "用户名或密码错误" };
            }
        }
    },
];
//# sourceMappingURL=noauthApi.js.map