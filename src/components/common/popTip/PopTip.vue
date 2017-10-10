<template>
    <transition name="popTransition" appear>
        <div id="popTip" class="popTip" v-show="DEV.devPopTip" @click.stop="poptipClick">
         <i class="fa fa-sort-up arrow"></i>
        <div class="popTipContent">
            <div class="pop-title">
                <h3 class="left">Assign Task</h3>
                <a href="javascript:void(0)" class="pop-manage right">Manage</a>
            </div>
            <Input v-model="findMember" placeholder="Find Member" @on-change="inputFocus"></Input>
            <ul class="member-list">
                <li class="member-item" v-for="member in projectMember" @click.stop="chooseMember(member)">
                    <div class="member-abbr left"
                        :class="member.ChoiceName | assignedName"
                        :title="member.ChoiceName"
                        >
                    {{member.ChoiceName | assignedName}}
                    </div>
                    <div class="member-name left">
                    {{member.ChoiceName}}
                    <Icon type="checkmark" class="check" v-show="memberInfo" v-if="member.ChoiceName == memberInfo.values[2].value"></Icon>
                    </div>
                    <div class="clearfix"></div>
                </li>
            </ul>
            <div class="add-member">
                <div class="add-icon left">
                    <i class="ivu-icon ivu-icon-plus-round"></i>
                </div>
                <a href="javascript:void(0)" class="add-text left" @click="addMember($event)">Add Members</a>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
    </transition>
        
</template>
<script>
    import Vue from 'vue'
    import { mapState,mapMutations,mapActions } from 'vuex';
    export default {
        props:['memberInfo'],
        created(){
            this.assignedName();
           // console.log(this.projectMember)
           this.getMember();
        },
        mounted(){
           
        },
        data:function(){
            return {
                projectMember:[],
                findMember:'',
                member:[]
            }
        },
        computed:{
            ...mapState(['DEV','projectId'])
        },
        methods:{
            assignedName() {
                Vue.filter('assignedName', function(value) {
                let arr =value.split(' ');
                let list=[];
                for(var i=0; i<arr.length; i++) {
                    list.push(arr[i].charAt(0));
                }
                let last = list.join("");
                return last;
                })
            },
            getMember(){
                const MEMBER_URL = DevTrackApi+'ChoiceList?'+'&projectId='+this.projectId+'&fieldId=108'+'&languageId=0';
                this.axios.get(MEMBER_URL).then(res=>{
                    this.projectMember = res.data.Data;
                    console.log(res.data.Data)
                },err=>{
                    console.log(err)
                })
            },
            poptipClick(){
                $('#popTip').show();
            },
            chooseMember(member){
               var statusId = this.memberInfo.values[0].choiceid;
               var taskId = this.memberInfo.taskId;
               let statusIndex = 0;
               var status = this.DEV.devStatusIds;
               for(let i=0;i<status.length;i++) {
                   if(statusId == status[i]){
                       statusIndex = i;
                       break;
                   } 
               }
               
               var taskIndex = 0;
               var tasks = this.DEV.devBoardTasks[statusIndex].children;
               for(let j=0;j<tasks.length;j++) {
                   if(taskId == tasks[j].taskId){
                       taskIndex = j;
                       break;
                   } 
               }


                //$('#popTip').hide();
                Vue.set(this.DEV.devBoardTasks[statusIndex].children[taskIndex].values[2],'value', member.ChoiceName);
                let _this = this;
                let projectId = this.projectId;
                //let taskId =this.DEV.devBoardTasks[statusIndex].children[taskIndex].taskId;
                let memberName = member.ChoiceName;
                let memberId = member.ChoiceId;
                let memberObj = {
                taskId: taskId,
                projectId: projectId,
                data: [ {id:108,value:member.ChoiceName,ChoiceId:member.ChoiceId}]
                }
                
               // this.changeAssignMember(memberObj);
                //$('.ivu-poptip-popper').hide();
                // this.saveEditTask(memberObj);
                this.changeDevPopTip(false);

            },
            inputFocus(){
                let searchValue = this.findMember ;
                let filter = searchValue.toUpperCase();
                let projectBaseArr = $('.member-list>li');
                for (let i=0; i<projectBaseArr.length; i++) {
                    var item = projectBaseArr[i].innerHTML;
                    if ( item.toUpperCase().indexOf(filter) > -1) {
                        projectBaseArr[i].style.display = ""; 
                    }else {
                        projectBaseArr[i].style.display = "none"; 
                    }
                }
            },
            addMember(e){
                // $('.ivu-poptip-popper').hide();
                // $('.boardsBackend').css("background","#fff");
                // this.modal = true;
                // this.changeBoardsBackend(true)
                this.changeDevModal(true)
            },
            ...mapMutations(['changeDevPopTip','changeDevModal']),
            ...mapActions(['changeAssignMember'])
        },
        watch:{
           
        }
    }
</script>
<style lang="scss" scoped="" type="text/css">
  @import 'popTip.scss';
</style>