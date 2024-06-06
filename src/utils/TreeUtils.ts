export const getAllNodeKeyByTree = (tree: any[] = [], keyName: string, keys: string[] = []) => {
    for (let item of tree) {
        keys.push(item[keyName])
        let parentNode = []
        if (item.children) {
            parentNode.push(...item.children)
        }
        if (parentNode && parentNode.length) {
            getAllNodeKeyByTree(parentNode, keyName, keys)
        }
    }
    return keys
}