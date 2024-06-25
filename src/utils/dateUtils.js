export const timestampFormat = (timestamp) => {
    if (!timestamp) {
        return '';
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = (month < 10 ? '0' + month : month);
    const day = date.getDate();
    const dayStr = (day < 10 ? '0' + day : day);
    const hours = date.getHours();
    const hoursStr = (hours < 10 ? '0' + hours : hours);
    const minutes = date.getMinutes();
    const minutesStr = (minutes < 10 ? '0' + minutes : minutes);
    const seconds = date.getSeconds();
    const secondsStr = (seconds < 10 ? '0' + seconds : seconds);
    return `${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
};
export const timestampNoYearFormat = (timestamp) => {
    if (!timestamp) {
        return '';
    }
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const monthStr = (month < 10 ? '0' + month : month);
    const day = date.getDate();
    const dayStr = (day < 10 ? '0' + day : day);
    const hours = date.getHours();
    const hoursStr = (hours < 10 ? '0' + hours : hours);
    const minutes = date.getMinutes();
    const minutesStr = (minutes < 10 ? '0' + minutes : minutes);
    const seconds = date.getSeconds();
    const secondsStr = (seconds < 10 ? '0' + seconds : seconds);
    return `${monthStr}-${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
};
export const secondsToMs = (seconds) => {
    if (!seconds) {
        return "";
    }
    const m = Math.floor(seconds / 60);
    const mStr = (m < 10 ? '0' + m : m);
    const s = seconds % 60;
    const sStr = (s < 10 ? '0' + s : s);
    return `${mStr} : ${sStr}`;
};
//# sourceMappingURL=dateUtils.js.map