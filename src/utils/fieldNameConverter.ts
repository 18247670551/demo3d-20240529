/**
 * 驼峰转下划线
 */
export const camelToUnderscore = (name: string): string  =>{
    return name.replace(/([A-Z])/g,"_$1").toLowerCase()
}

/**
 * 下划线转驼峰
 */
export const underscoreToCamel = (name: string): string  => {
    return name.replace(/_(\w)/g, (all, letter) =>{
        return letter.toUpperCase()
    })
}