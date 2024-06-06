import {Random} from "mockjs"

export default [
    {
        url: "/mock/testGet",
        method: "get",
        timeout: 3000,
        response: (params: { url: string, body: any, query: any, headers: any }) => {
            return {
                code: 0, msg: "mock请求 /test/get 成功", data: {
                    url: params.url,
                    body: params.body,
                    query: params.query,
                    headers: params.headers,
                    name: Random.cname(), //随机生成中文名字
                    age: Random.integer(18,40),//随机生成18-40的数字
                    birth: Random.date(), //随机生成年月日
                    title: Random.ctitle(),//随机生成标题
                    price: Random.integer(11, 400),//随机生成11-400的数字
                    sourceAddress: Random.county(true),//随机生成省市县级城市
                    image: Random.image('100x100'),//随机生成100*100的图片
                    randomNumber:Random.integer(1,100), //随机生成1-100的数字
                }
            }
        }
    },
]