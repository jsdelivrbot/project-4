<template>
    <div class="languageList">
        <div class="currentSelect" @click="showLanguageList" :class="{customClass:isClass}">
            {{listData[0]}}
            <i class="fa fa-caret-down caret" v-show="caretTop"></i>
            <i class="fa fa-caret-up caret" v-show="!caretTop"></i>
        </div>
        <ul class="list" v-show="listShow && listData.length">
            <li v-for="item in listData" 
                class="list-item" 
                @click="selectThis(item)"
                :class="{activeClass:language == item}">{{ item }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped="" type="text/css">
 @import './listSelect.scss';
</style>

<script>
import Vue from 'vue'
let listData = []
export default {
    mounted(){
        console.log(this.isClass)
    },
    props:{
        "listData":{
            type:Array,
            default:[]
        },
        "isClass":{
            type:Boolean
        }
    },
    data: function() {
        return {
            language:'Urgent',
            //languages: listData,
            listShow: false,
            caretTop: true,
            ///listData:[]           

        }
    },
    name:'Select',
    methods:{
        showLanguageList(){
            var show = this.listShow;
            if (show) {
                this.listShow = false;
                this.caretTop = true;
            }else {
                this.listShow = true;
                this.caretTop = false;

            }
        },
        selectThis(item){
            this.language = item;
            this.listShow = false;
            this.caretTop = true;
        },
    }
}

</script>