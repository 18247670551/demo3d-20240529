import { defineStore } from "pinia";
import { ref } from "vue";
import localStorageUtils from "@/utils/localStorageUtils";
export const useUserStore = defineStore("userStore", () => {
    const innerUser = ref(null);
    const innerToken = ref(null);
    const innerRefreshToken = ref(null);
    function getUser() {
        return innerUser.value;
    }
    function getToken() {
        return innerToken.value;
    }
    function getRefreshToken() {
        return innerRefreshToken.value;
    }
    function init() {
        const user = localStorageUtils.get("user");
        const token = localStorageUtils.get("token");
        const refreshToken = localStorageUtils.get("refresh-token");
        if (user && token && refreshToken) {
            innerUser.value = user;
            innerToken.value = token;
            innerRefreshToken.value = refreshToken;
            return true;
        }
        return false;
    }
    // 登录成功, 保存用户数据
    function setLogin(accessToken, refreshToken) {
        innerToken.value = accessToken;
        localStorageUtils.set("token", accessToken);
        innerRefreshToken.value = refreshToken;
        localStorageUtils.set("refresh-token", refreshToken);
    }
    function setUser(user) {
        innerUser.value = user;
        localStorageUtils.set("user", user);
    }
    //退出登录, 清除用户数据
    function clearLogin() {
        innerUser.value = null;
        localStorageUtils.remove("user");
        innerToken.value = null;
        localStorageUtils.remove("token");
        innerRefreshToken.value = null;
        localStorageUtils.remove("refresh-token");
    }
    function isLogin() {
        return !!innerToken.value;
    }
    function getUserId() {
        return innerUser.value?.id;
    }
    function getUserName() {
        return innerUser.value?.name;
    }
    function getUserPhone() {
        return innerUser.value?.phone;
    }
    function getUserAvatar() {
        return innerUser.value?.avatar;
    }
    return { init, getUser, setUser, getUserId, getToken, getRefreshToken, setLogin, clearLogin, isLogin, getUserName, getUserPhone, getUserAvatar };
});
//# sourceMappingURL=userStore.js.map