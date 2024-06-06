import {Ref} from "vue"

export const show = (isVisible: Ref<boolean>) => {
    isVisible.value = true
}
export const hide = (isVisible: Ref<boolean>) => {
    isVisible.value = false
}

export const showLoading = (loading: Ref<boolean>) => {
    loading.value = true
}
export const hideLoading = (loading: Ref<boolean>) => {
    loading.value = false
}