import { repeat } from "lodash";
// type TestA = "a" | "b" | "c" | "d"
//
// function assertNeverDemo(testA: TestA) {
//     switch (testA) {
//         case "a":
//             // ...
//             break
//         case "b":
//             // ...
//             break
//         case "c":
//             // ...
//             break
//         default:
//             return assertNever(testA) // 如果有忽略的case, 此处将有异常
//     }
// }
export function assertNever(value) {
    throw new Error("类型检查错误 .assertNever(): 非 never 类型" + value);
}
export const getAllNodeKeyByTree = (tree, keyName, keys = []) => {
    for (let item of tree) {
        keys.push(item[keyName]);
        let parentNode = [];
        if (item.children) {
            parentNode.push(...item.children);
        }
        if (parentNode && parentNode.length) {
            getAllNodeKeyByTree(parentNode, keyName, keys);
        }
    }
    return keys;
};
export const timeOut = (fn, time) => {
    let timer = setTimeout(() => {
        fn();
        clearTimeout(timer);
    }, time);
};
export const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
/**
 * 从传入的url 中获取指定key的value
 */
export function getUrlParam(url, key) {
    url = url.replace(/^[^?]*\?/, "");
    const regexp = new RegExp(`(^|&)${key}=([^&#]*)(&|$|)`, "i");
    const paramMatch = url.match(regexp);
    return paramMatch ? paramMatch[2] : null;
}
export const hexFormat = (hex) => {
    hex = hex.replace(" ", '');
    let str = '';
    for (let i = 0; i < hex.length; i++) {
        str += hex[i];
        if (i % 2 == 1) {
            str += ' ';
        }
    }
    return str;
};
export const isTwoArray = (arr) => {
    return Array.isArray(arr[0]);
};
export const numberToNotNoneText = (str) => {
    if (!str || str === "0") {
        return '';
    }
    return str.toString();
};
export const pad = (source, len = 2, s = "0") => {
    return (Array(len).join(s) + source).slice(-len);
};
/**
 * 清除富文本中的标签
 */
export const richTextClearHtmlTag = (text) => {
    return text.replace(/<[^>]+>/g, '');
};
/**
 * 字符串模板替换
 * @param template
 * @param value
 * @param regex
 * @param defaultValue
 */
export const printf = (template, value, regex = /%s/g, defaultValue = " N/A ") => {
    return template.replace(regex, value || defaultValue);
};
/**
 * 生成随机字符串
 * @param len 生成个数
 */
export const randomString = (len) => {
    len = len || 10;
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const maxPos = str.length;
    let random_str = '';
    for (let i = 0; i < len; i++) {
        random_str += str.charAt(Math.floor(Math.random() * maxPos));
    }
    return random_str;
};
/**
 * 获取坐标偏移量
 * @param value 真实宽/高
 * @param scale 缩放倍数
 * @returns 坐标偏移量
 */
export const getCoordinateOffset = (value, scale) => {
    return (value / 2) * (scale - 1);
};
/**
 * 角度转弧度
 */
export const angleToRadian = (angle) => {
    return (angle * Math.PI) / 180;
};
/**
 * 求两点之间的中点坐标
 */
export const getCenterPoint = (p1, p2) => {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
};
/**
 * 坐标数组转换成path路径
 * @param position_arr
 * @returns
 */
export const positionArrayToPath = (position_arr) => {
    let path_str = '';
    for (let index = 0; index < position_arr.length; index++) {
        if (index === 0) {
            path_str += `M ${position_arr[index].x} ${position_arr[index].y}`;
        }
        else {
            path_str += ` L ${position_arr[index].x} ${position_arr[index].y}`;
        }
    }
    return path_str;
};
/**
 * 二的n次幂
 * @param n
 */
function 二的n次幂(n) {
    return 1 << n;
}
/**
 * 0/1 取反, 只需异或1
 * @param value
 */
export function toggle(value) {
    return value ^= 1;
}
// 5星打分
// export const rate = (start: number) => {
//     const starts = "★★★★★☆☆☆☆☆"
//     return starts.slice(5-start, 10 - start)
// }
/**
 * 任意星打分
 * console.log(rate(3, 10)) // "★★★☆☆☆☆☆☆☆"
 */
const rate = (star, totalStar = 5) => {
    const stars = repeat("★", totalStar) + repeat("☆", totalStar);
    return stars.slice(totalStar - star, totalStar * 2 - star);
};
//# sourceMappingURL=myUtils.js.map