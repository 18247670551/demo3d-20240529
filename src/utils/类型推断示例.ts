
type JSTypeMap = {
    "string": string,
    "number": number,
    "boolean": boolean,
    "symbol": symbol,
    "bigint": bigint,
    "undefined": undefined,
    "function": Function,
}

type JSTypes = keyof JSTypeMap

type ArgsType<T extends JSTypes[]> = {
    [I in keyof T]: JSTypeMap[T[I]]
}

declare function addImpl<T extends JSTypes[]>(...args: [
    ...T,
    (...args: ArgsType<T>) => any
]): any


addImpl("boolean", "string", 'number', (a, b, c) => {})





