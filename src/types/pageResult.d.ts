export {}

declare global {

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

    interface BaseQuery {
        startTime?: String
        endTime?: String
        orders?: OrderItem[]
        simpleParam?: number | null
    }

    interface PageQuery {
        pageNum: number
        pageSize: number
    }

}
