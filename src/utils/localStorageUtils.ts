
export default {

    set(key: string, value: any){
        localStorage.setItem(key, JSON.stringify(value))
    },

    get(key: string){
        try{
            const valueString = localStorage.getItem(key)
            if(valueString){
                return JSON.parse(valueString)
            }else{
                return null;
            }
        }catch (e){
            return null
        }
    },

    remove(key: string){
        localStorage.removeItem(key)
    },

}