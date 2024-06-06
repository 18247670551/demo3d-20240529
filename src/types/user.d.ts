export {}

declare global {

    interface UserInfo {

        clientType: string
        loginTime: string

        id: string
        name: string
        phone: string

        avatar: string
    }

    interface LoginUser {
        phone: string
        password: string
    }

}