<template>
    <div class="file-tree-wrapper">
        <div class="header">
            Components Tree
            <div class="buttons-wrapper">
                <div class="button" @click.stop="getAddFileWindow">
                    <img src="@/assets/addfile.svg">
                </div>
                <div class="button" @click.stop="getAddFolderWindow">
                    <img src="@/assets/addfolder.svg">
                </div>
            </div>
        </div>
        <TreeObjectComponent v-for="item in tree"
                             :key="item.id"
                             :item="item"
                             :clickedId="clickedId"
                             @item-click="itemClick"
                             @item-edit="getEditNameWindow"
                             @item-delete="itemDelete">
        </TreeObjectComponent>
    </div>
    <teleport to="body" :disabled="!isModal">
        <ModalWindow v-if="isModal" :isFolder="modalIsFolder"
                     :title="modalTitle"
                     :modalText="modalText"
                     :type="modalType"
                     @accept="accept"
                     @changed="textChanged"
                     @get-close="isModal = false, modalText = ''"></ModalWindow>
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
    watch: {
        clickedId(n){
            console.log("CLICKED_ID:", n)
        },
        clickedParentId(n){
            console.log("CLICKED_PID:", n)
        },
    },
  })
  export default class App extends Vue{

    tree = []
    clickedId = -1
    clickedParentId = -1
    isModal = false
    modalTitle = ""
    modalIsFolder = false
    modalText = ""
    modalType = ""

    mounted(){
        this.tree = [
            new TreeObject(1, "Dir 1", true, [
                new TreeObject(11, "Dir 1-1", true, [
                    new TreeObject(111, "File 1-1-1", false, [], 11),
                ], 1),
                new TreeObject(12, "File 1-2", false, [], 1),
            ], 0),
            new TreeObject(2, "Dir 2", true, [
                new TreeObject(21, "Dir 2-1", true, [
                    new TreeObject(22, "File 2-2", false, [], 21),
                ], 2),
            ], 0),
            new TreeObject(20, "File 2", false, [], 0),
        ]
    }

    textChanged(text){
      this.modalText = text
    }
    itemClick(itemId, parentId){
        console.log("CATCHED:", itemId)
        this.clickedId = itemId
        this.clickedParentId = parentId
    }
    itemDelete(itemId, parentId){
        console.log("CATCHED:", itemId)
        console.log("CATCHEDP:", parentId)
        this.tree.forEach(e => {
            console.log("FEACH:", e.id)
            if(e.id === parentId){
                console.log("MATCH:", e.id)
                this.recursionChecking(this.tree, e, itemId, "delete")
            }
            else if(e.id === itemId){
                console.log("PARENT MATCH:", e.id)
                this.tree = this.tree.filter(c => {
                    return c.id !== e.id
                })
            }
        })
        this.clickedId = -1
        this.clickedParentId = -1
        console.log("FILTERED:", this.tree)
    }
    recursionChecking(parent, e, itemId, type){
        console.log("RCHECK:", e.children.length)
        if(e.children.length > 0){
            e.children.forEach(c => {
                if(c.id === itemId){
                    //console.log("DELETE:", c.id)
                    if(type === "delete"){
                        e.children = e.children.filter(d => {
                            return d.id !== c.id
                        })
                    }
                    else if(type === "edit"){
                        console.log("EDDDDDIT", e.name)
                        console.log("EDDDDDIT", this.modalText)
                        c.name = this.modalText
                    }
                    else if(type === "addfile" || type === "addfolder"){
                        console.log("HERE1")
                        if(c.isFolder){
                            type === "addfile"
                                ? c.children.push(new TreeObject(new Date().getTime(), this.modalText, false, [], c.id))
                                : c.children.push(new TreeObject(new Date().getTime(), this.modalText, true, [], c.id))
                        }
                        else{
                            type === "addfile"
                                ? e.children.push(new TreeObject(new Date().getTime(), this.modalText, false, [], e.id))
                                : e.children.push(new TreeObject(new Date().getTime(), this.modalText, true, [], e.id))
                        }
                    }
                }
                else{
                    this.recursionChecking(e, c, itemId, type)
                }
            })
        }
    }
    getAddFileWindow(){
        this.modalTitle = "Add File"
        this.modalType = "addfile"
        this.isModal = true
        this.modalText = ""
    }
    getAddFolderWindow(){
        this.modalType = "addfolder"
        this.modalTitle = "Add Folder"
        this.isModal = true
        this.modalText = ""
    }
    getEditNameWindow(itemId, parentId, itemName){
        console.log("cID", itemId)
        this.modalType = "edit"
        this.clickedId = itemId
        this.clickedParentId = parentId
        this.modalTitle = "Edit Name"
        this.isModal = true
        this.modalText = itemName
    }

    accept(itemName, type){
        //console.log("============")
        //console.log("modalText:", this.modalText)
        //console.log("itemName:", itemName)
        //console.log("this.clickedId:", this.clickedId)
        //console.log("this.clickedParentId:", this.clickedParentId)
       this.isModal = false
        if(this.clickedId === -1 && this.clickedParentId === -1 && (type === "addfile" || type === "addfolder")){
            type === "addfile"
                ? this.tree.push(new TreeObject(new Date().getTime(), itemName, false, [], 0))
                : this.tree.push(new TreeObject(new Date().getTime(), itemName, true, [], 0))
        }
        else{
            this.tree.forEach(e => {
                console.log("id:", e.id)
                console.log("parentId:", this.clickedParentId)
                console.log("clickedId:", this.clickedId)
                /*if(e.id === this.clickedParentId){
                    console.log("MATCH:", e.id)
                    this.recursionChecking(this.tree, e, this.clickedId, type)
                }
                else */if(e.id === this.clickedId){
                    console.log("PARENT MATCH:", e.id)
                    if(type === "delete"){
                        this.tree = this.tree.filter(c => {
                            return c.id !== e.id
                        })
                    }
                    else if(type === "edit"){
                        e.name = itemName
                    }
                    else if(type === "addfile" || type === "addfolder"){
                        console.log("HERE2")
                        if(e.isFolder){
                            type === "addfile"
                                ? e.children.push(new TreeObject(new Date().getTime(), itemName, false, [], e.id))
                                : e.children.push(new TreeObject(new Date().getTime(), itemName, true, [], e.id))
                        }
                        else{
                            type === "addfile"
                                ? this.tree.push(new TreeObject(new Date().getTime(), itemName, false, [], 0))
                                : this.tree.push(new TreeObject(new Date().getTime(), itemName, true, [], 0))
                        }
                    }
                }
                else{
                    this.recursionChecking(this.tree, e, this.clickedId, type)
                }
            })
        }

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

    .file-tree-wrapper{
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
    }

</style>
