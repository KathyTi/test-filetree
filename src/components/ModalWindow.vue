<template>
  <div class="modal-widow" @click.stop="getClose">
      <div class="window" @click.stop="true">
          <div class="header">{{title}}</div>
          <div class="content">
              <InputFieldComponent
                      placeholder="Input Name"
                      :text="modalText"
                      @submitted="accept"
                      @changed="changed"></InputFieldComponent>
          </div>
          <div class="footer">
              <div class="button" @click.stop="getClose">
                  <img src="@/assets/close.svg">
              </div>
              <div class="button" @click.stop="accept">
                  <img src="@/assets/check.svg">
              </div>
          </div>
      </div>
  </div>
</template>

<script>
    import { Options, Vue } from 'vue-class-component';
    import InputFieldComponent from "./InputFieldComponent";

    @Options({
        components: {InputFieldComponent},
        props: {
            type: {type: String, default: ""},
            title: {type: String, default: ""},
            modalText: {type: String, default: ""},
        },
        emits: ['get-close','accept','changed'],
        watch: {},
    })
    export default class ModalWindow extends Vue{

        getClose(){
            this.$emit('get-close')
        }

        accept(){
            if(this.$props.modalText.length > 0){
                this.$emit('accept', this.$props.modalText, this.$props.type)
            }
        }

        changed(text){
            this.$emit('changed', text)
        }

    }
</script>

<style scoped lang="scss">

    .modal-widow {
        display: flex;
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,.3);
        justify-content: center;
        align-items: center;
        left: 0;
        top: 0;

        .window {
            display: flex;
            width: 400px;
            background-color: #fff;
            border-radius: 24px;
            box-shadow: 0 0 24px 4px rgba(0,0,0,0.24);
            z-index: 5;
            flex-direction: column;
            padding: 0 16px;
            box-sizing: border-box;

            .header {
                display: flex;
                width: 100%;
                min-height: 64px;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                font-size: 32px;
            }

            .content {
                display: flex;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
                padding: 16px 0;
            }

            .footer {
                display: flex;
                width: 100%;
                min-height: 64px;
                justify-content: end;
                align-items: center;

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