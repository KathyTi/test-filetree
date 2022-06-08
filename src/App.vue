<template>
    <div class="file-tree-component">
        <div class="header">
            Components Tree
            <div class="buttons-wrapper">
                <div class="button" @click.stop="getAddFileWindow">
                    <img src="@/assets/addfile.svg" alt="Add file">
                </div>
                <div class="button" @click.stop="getAddFolderWindow">
                    <img src="@/assets/addfolder.svg" alt="Add folder">
                </div>
            </div>
        </div>
        <div class="file-tree-wrapper">
            <TreeObjectComponent v-for="item in getters.items"
                                 :key="item.id"
                                 :item="item"
                                 :clickedId="getters.clickedId"
                                 @item-click="itemClick"
                                 @item-edit="getEditNameWindow"
                                 @item-delete="itemDelete">
            </TreeObjectComponent>
        </div>


    </div>
    <teleport to="body" :disabled="!getters.isModal">
        <ModalWindow v-if="getters.isModal"
                     :title="getters.modalTitle"
                     :modalText="getters.modalText"
                     :type="getters.modalType"
                     @accept="accept"
                     @changed="textChanged"
                     @get-close="$store.dispatch('setIsModal', false), $store.dispatch('setModalText', '')"></ModalWindow>
    </teleport>
</template>

<script>
    import { Options, Vue } from 'vue-class-component';
    import TreeObject from "@/lib/TreeObject";
    import TreeObjectComponent from "./components/TreeObjectComponent";
    import ModalWindow from "./components/ModalWindow";

    @Options({
      components: {TreeObjectComponent,ModalWindow},
      props: {},
      emits: [],
      watch: {},
    })
    export default class App extends Vue{

        //буфферная переменная списка для манипуляций и записи в vuex
        tree = []

        mounted(){
            this.$store.dispatch("initItems")
            this.tree = this.getters.items
        }

        get getters(){
            return{
                items: this.$store.getters.getItems,
                clickedId: this.$store.getters.getClickedId,
                isModal: this.$store.getters.getIsModal,
                clickedParentId: this.$store.getters.getClickedParentId,
                modalTitle: this.$store.getters.getModalTitle,
                modalText: this.$store.getters.getModalText,
                modalType: this.$store.getters.getModalType,
            }
        }


        textChanged(text){
            this.$store.dispatch("setModalText",text)
        }

        itemClick(itemId, parentId){
            this.$store.dispatch("setClickedId",itemId)
            this.$store.dispatch("setClickedParentId",parentId)
        }

        itemDelete(itemId, parentId){
            this.$store.dispatch("setIsModal",false)
            for(let i = 0; i < this.tree.length; i++){
                let e = this.tree[i]

                if(e.id === parentId){
                    this.recursionChecking(this.tree, e, itemId, "delete")
                }
                else if(e.id === itemId){
                    this.tree = this.tree.filter(c => {
                        return c.id !== e.id
                    })
                    this.$store.dispatch("setItems", this.tree)
                }
            }
            this.$store.dispatch("setClickedId",-1)
            this.$store.dispatch("setClickedParentId",-1)
        }

        recursionChecking(parent, child, itemId, type){
            if(child.children.length > 0){
                child.children.forEach(subchild => {
                    if(subchild.id === itemId){
                        if(type === "delete"){
                            child.children = child.children.filter(el => {
                                return el.id !== subchild.id
                            })
                        }
                        else if(type === "edit"){
                            subchild.name = this.getters.modalText
                            child.children = this.sortFolderData(child.children)
                        }
                        else if(type === "addfile" || type === "addfolder"){
                            if(subchild.isFolder){
                                type === "addfile"
                                    ? subchild.children.push(new TreeObject(new Date().getTime(), this.getters.modalText, false, [], subchild.id))
                                    : subchild.children.push(new TreeObject(new Date().getTime(), this.getters.modalText, true, [], subchild.id))
                                subchild.children = this.sortFolderData(subchild.children)
                            }
                            else{
                                type === "addfile"
                                    ? child.children.push(new TreeObject(new Date().getTime(), this.getters.modalText, false, [], child.id))
                                    : child.children.push(new TreeObject(new Date().getTime(), this.getters.modalText, true, [], child.id))
                                child.children = this.sortFolderData(child.children)
                            }
                        }
                        this.$store.dispatch("setItems", this.tree)
                    }
                    else{
                        this.recursionChecking(child, subchild, itemId, type)
                    }
                })
            }
        }

        getAddFileWindow(){
            this.$store.dispatch("setModalTitle","Add File")
            this.$store.dispatch("setModalType","addfile")
            this.$store.dispatch("setModalText","")
            this.$store.dispatch("setIsModal",true)
        }
        getAddFolderWindow(){
            this.$store.dispatch("setModalTitle","Add Folder")
            this.$store.dispatch("setModalType","addfolder")
            this.$store.dispatch("setModalText","")
            this.$store.dispatch("setIsModal",true)
        }
        getEditNameWindow(itemId, parentId, itemName){
            this.$store.dispatch("setClickedId",itemId)
            this.$store.dispatch("setClickedParentId",parentId)
            this.$store.dispatch("setModalTitle","Edit Name")
            this.$store.dispatch("setModalType","edit")
            this.$store.dispatch("setModalText",itemName)
            this.$store.dispatch("setIsModal",true)
        }

        accept(itemName, type){
            this.$store.dispatch("setIsModal",false)
            this.tree = this.getters.items

            //ничего не выбрано и тип действия - добавление файла/папки
            if(this.getters.clickedId === -1 && this.getters.clickedParentId === -1 && (type === "addfile" || type === "addfolder")){
                //добавим
                type === "addfile"
                    ? this.tree.push(new TreeObject(new Date().getTime(), itemName, false, [], 0))
                    : this.tree.push(new TreeObject(new Date().getTime(), itemName, true, [], 0))

                //и отсортируем
                this.tree = this.sortFolderData(this.tree)
                this.$store.dispatch("setItems", this.tree)
            }

            //иначе
            else{
                for(let i = 0; i < this.tree.length; i++){
                    let e = this.tree[i]

                    //id === выбранному объекту  -  работаем с ним
                    if(e.id === this.getters.clickedId){
                        //далее действуем в зависимости от типа подтверждаемого действия
                        if(type === "delete"){
                            this.tree = this.tree.filter(c => {
                                return c.id !== e.id
                            })
                        }
                        else if(type === "edit"){
                            e.name = itemName
                            this.tree = this.sortFolderData(this.tree)
                        }
                        else if(type === "addfile" || type === "addfolder"){
                            //если папка
                            if(e.isFolder){
                                type === "addfile"
                                    ? e.children.push(new TreeObject(new Date().getTime(), itemName, false, [], e.id))
                                    : e.children.push(new TreeObject(new Date().getTime(), itemName, true, [], e.id))
                                e.children = this.sortFolderData(e.children)
                            }
                            //если файл
                            else{
                                type === "addfile"
                                    ? this.tree.push(new TreeObject(new Date().getTime(), itemName, false, [], 0))
                                    : this.tree.push(new TreeObject(new Date().getTime(), itemName, true, [], 0))
                                this.tree = this.sortFolderData(this.tree)
                            }
                        }
                        this.$store.dispatch("setItems", this.tree)
                        break
                    }

                    //запускаем проверку содержимого папки на предмет наличия выбранного объекта
                    else{
                        this.recursionChecking(this.tree, e, this.getters.clickedId, type)
                    }
                }
            }
        }

        sortFolderData(data){
            let folders = data.filter(e => e.isFolder)
            let files = data.filter(e => !e.isFolder)

            folders = folders.sort(
                (prev, next) => prev.name.localeCompare(next.name)
            )
            files = files.sort(
                (prev, next) => prev.name.localeCompare(next.name)
            )

            return [...folders, ...files]
        }

    }
</script>

<style lang="scss">

    html body{
        margin: 0;
    }

    #app{
        display: flex;
        width: 100vw;
        height: 100vh;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        background-color: #eee;
        padding: 32px;
        box-sizing: border-box;

    }

    .file-tree-component{
        display: flex;
        width: 100%;
        height: 100%;
        padding: 24px;
        justify-content: start;
        flex-direction: column;
        flex: 1;
        background-color: #fff;
        border-radius: 24px;
        box-shadow: 0 0 24px 4px rgba(0,0,0,0.24);
        box-sizing: border-box;
        overflow: hidden;

        .header{
            display: flex;
            height: 64px;
            width: 100%;
            justify-content: space-between;
            font-size: 32px;
            font-weight: bold;

            .buttons-wrapper{
                display: flex;

                .button{
                    display: flex;
                    height: 32px;
                    width: 32px;
                    cursor: pointer;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    box-sizing: border-box;
                    margin: 6px 6px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

                    &:hover{
                        background-color: rgba(0,255,0,.5);
                    }

                }

            }

        }
        .file-tree-wrapper{
            display: block;
            width: 100%;
            overflow-y: auto;
        }
    }

</style>
