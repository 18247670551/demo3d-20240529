export {}

declare global {

    // 类型可为空
    type Nullable<T> = T | null | undefined

    // 自定义必选
    type CustomRequired<T, K extends keyof T> = { [P in K]-?: T[P] } & Omit<T, K>

    // 自定义可选
    type CustomOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

    // 深层所有可选
    type DeepPartial<T> = {[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]}

    //type DeepPartial<T> = T extends Function? T: T extends object? { [P in keyof T]?: DeepPartial<T[P]> }: T

    // 类型拷贝对象中的某一部分
    type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>
    }

    type DeepReadonly<T extends Record<string | symbol, any>> = {
        readonly [K in keyof T]: DeepReadonly<T[K]>
    }


    /**
     * 登录响应
     */
    interface TokenPair {
        accessToken: string
        refreshToken: string
    }


    /**
     * 请求响应标准对象
     */
    interface R<T = any> {
        code: number
        msg: string
        data: T
    }

    /**
     * 请求响应标准对象, data为分页时
     */
    interface Page<T = any> {
        pageNum: number
        pageSize: number
        total: number
        records: T[]
        totalPage: number
        isFirst: boolean
        isLast: boolean
        hasPre: boolean
        hasNext: boolean
        pagePre: number | null
        pageNext: number | null
    }


    /**
     * 通用请求参数
     */
    interface BaseQuery {
        startTime?: String
        endTime?: String
        orders?: OrderItem[]
        simpleParam?: number | null
    }

    /**
     * 分页请求参数
     */
    interface PageQuery {
        pageNum: number
        pageSize: number
    }






    /**
     * query参数中的排序对象, {column: "create_time", asc: false}
     */
    interface OrderItem {
        column: string
        asc: boolean
    }


    /**
     * 编辑可用状态的请求通用参数
     */
    interface EditEnabled {
        id: string
        enabled: boolean
    }

    /**
     * 编辑禁用状态的请求通用参数
     */
    interface EditDisabled {
        id: string
        disabled: boolean
    }

    /**
     * 编辑状态的请求通用参数
     */
    interface EditStatus {
        id: string
        status: number
    }

}
