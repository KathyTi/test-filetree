export default class TreeObject{

    id
    parentId
    name
    isFolder
    children

    constructor(id, name, isFolder, children, parentId = 0){

        this.id = id
        this.name = name
        this.isFolder = isFolder
        this.children = children
        this.parentId = parentId

    }


}