import TreeObject from "@/lib/TreeObject";

export default{
    actions: {
        initItems(ctx){
                const items = [
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
                ctx.commit("updateItems", items)
        },
        setItems(ctx, items){
            ctx.commit("updateItems", items)
        },
        setClickedId(ctx, id){
            ctx.commit("updateClickedId", id)
        },
        setClickedParentId(ctx, id){
            ctx.commit("updateClickedParentId", id)
        },
        setIsModal(ctx, isModal){
            ctx.commit("updateIsModal", isModal)
        },
        setModalTitle(ctx, modalTitle){
            ctx.commit("updateModalTitle", modalTitle)
        },
        setModalText(ctx, modalText){
            ctx.commit("updateModalText", modalText)
        },
        setModalType(ctx, modalType){
            ctx.commit("updateModalType", modalType)
        },
    },
    mutations: {
        updateItems: function(state, items){
            state.items = items
        },
        updateClickedId(state, id){
            state.clickedId = id
        },
        updateClickedParentId(state, id){
            state.clickedParentId = id
        },
        updateIsModal(state, isModal){
            state.isModal = isModal
        },
        updateModalTitle(state, modalTitle){
            state.modalTitle = modalTitle
        },
        updateModalText(state, modalText){
            state.modalText = modalText
        },
        updateModalType(state, modalType){
            state.modalType = modalType
        },
    },
    state: {
        items: [],
        clickedId: -1,
        clickedParentId: -1,
        isModal: false,
        modalTitle: "",
        modalText: "",
        modalType: "",
    },
    getters: {
        getItems: (state) => state.items,
        getClickedId: (state) => state.clickedId,
        getClickedParentId: (state) => state.clickedParentId,
        getIsModal: (state) => state.isModal,
        getModalTitle: (state) => state.modalTitle,
        getModalText: (state) => state.modalText,
        getModalType: (state) => state.modalType,
    },
}