
const defaultTopId = '0000000000000000000'

const defaultPageQuery = {pageNum: 1, pageSize: 50}

const blankPage = {
    pageNum: 1,
    pageSize: 50,
    records: [],
    total: 0,
    totalPage: 1,
    isFirst: false,
    isLast: false,
    hasPre: false,
    hasNext: false,
    pagePre:  null,
    pageNext:  null,
}


export {defaultTopId, defaultPageQuery, blankPage}