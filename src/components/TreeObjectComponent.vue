<template>
    <div class="tree-object-component" :style="style"
          @click.stop="itemClick"
          @item-click="itemClick"
          @item-delete="itemDelete">
        <div class="content-wrapper">
            <img v-if="this.$props.item.isFolder" src="@/assets/folder.svg">
            <img v-else src="@/assets/file.svg">
            <div class="name">{{item.name}}</div>
            <div class="button">
                <img src="../assets/edit.svg" @click.stop="itemEdit">
            </div>
            <div class="button-delete" @click.stop="itemDelete">
                <img src="../assets/delete.svg">
            </div>
        </div>
        <div class="sub-item-component">
            <TreeObjectComponent v-for="subitem in item.children"
                                 :key="subitem.id"
                                 :item="subitem"
                                 :clickedId="clickedId"
                                 @item-click="itemClick"
                                 @item-edit="itemEdit"
                                 @item-delete="itemDelete">
            </TreeObjectComponent>
        </div>
    </div>
</template>

<script>
    import { Options, Vue } from 'vue-class-component';

    @Options({
        components: {},
        props: {
            item: {type: Object, default: {}},
            clickedId: {type: Number, default: {}}
        },
        emits: ['item-click', 'item-delete', 'item-edit', 'changed'],
        watch: {},
    })
    export default class TreeObjectComponent extends Vue{

        itemClick(itemId, parentId){
            this.$emit('item-click',
                    typeof itemId === "object" ? this.$props.item.id : itemId,
                    typeof itemId === "object" ? this.$props.item.parentId :  parentId)
        }
        itemDelete(itemId, parentId){
            this.$emit('item-delete',
                    typeof itemId === "object" ? this.$props.item.id : itemId,
                    this.$props.item.parentId === 0 ? parentId : this.$props.item.parentId)
        }
        itemEdit(itemId, parentId, itemName){
            this.$emit('item-edit',
                    typeof itemId === "object" ? this.$props.item.id : itemId,
                    this.$props.item.parentId === 0 ? parentId : this.$props.item.parentId,
                    typeof itemId === "object" ? this.$props.item.name : itemName)
        }

        get style(){
            //присвоим computed свойство get style в DOM в style корневому объекту

            //вычислим выбран ли компонент и настроим поведение(поменяем цвет)
            let isClicked = this.$props.item.id === this.$props.clickedId ? "rgba(80,255,80,.4)" : "transparent"
            let isHovered = this.$props.item.id === this.$props.clickedId ? "rgba(80,255,80,.4)" : "rgba(0,225,225,.12)"

            //возвращаемые ключи применим в css нужным объектам
            return {
              "--is-clicked": isClicked,
              "--is-hovered": isHovered,
            }
        }

    }
</script>

<style scoped lang="scss">

  .tree-object-component{
    display: flex;
    width: 100%;
    min-height: 32px;
    flex-direction: column;

    .content-wrapper{
      display: flex;
      width: 100%;
      min-height: 32px;
      padding: 0 8px;
      box-sizing: border-box;
      align-items: center;
      background-color: var(--is-clicked);

      .name{
        display: flex;
        width: 100%;
        justify-content: start;
      }

      .button{
        display: flex;
        min-height: 32px;
        min-width: 32px;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin: 2px 2px;
        box-sizing: border-box;

        &:hover{
          background-color: rgba(0,255,0,.7);
        }

      }

      .button-delete{
        display: flex;
        min-height: 32px;
        min-width: 32px;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin: 2px 2px;
        box-sizing: border-box;

        &:hover{
          background-color: rgba(255,0,0,.7);
        }

      }

      &:hover{
        background-color: var(--is-hovered);
      }

    }

  }

  .sub-item-component{
    display: flex;
    width: 100%;
    padding-left: 24px;
    box-sizing: border-box;
    flex-direction: column;

  }

</style>