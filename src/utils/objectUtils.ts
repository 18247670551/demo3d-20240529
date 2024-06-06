
export {isNone, isNotNone}

const isNone = (obj: any): Boolean => {
    if(obj === null || obj === undefined){
        return true
    }

    //不能用 obj instanceof String,
    // const str = new String("test"); str instanceof String;为true  typeof str == 'string';为false
    // const str ="test"; str instanceof String;为false  typeof str == 'string';为true
    if(typeof obj === "string"){
        return obj.trim().length === 0
    }

    if(obj instanceof Array){
        return obj.length === 0
    }

    return false
}

const isNotNone = (obj: any): Boolean => {
    return !isNone(obj)
}