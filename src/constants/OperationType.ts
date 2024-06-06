export enum OperationType {

    SMS = -1, //授权
    REGISTER = -2,
    LOGIN = -3,
    LOGOUT = -4,

    READ = 0,

    ADD = 10001,
    EDIT = 10002,
    DELETE = 10003,
    CLEAR = 10004,

    GRANT = 20001, //授权
    FORCE = 20002, //强退
    EXPORT = 20003, //导出
    IMPORT = 20004, //导入

}