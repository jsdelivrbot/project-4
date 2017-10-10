<template>
  <transition name="edit" appear>
    <div class="editPanel" v-show='showEditPanel' @click.stop='clickPanel'>
       <div class="edit-panel">
          <div class="details-panel-header">
            <p id="taskid" class="details-panel-header-title">
                <span>{{currentCardInfo.taskId}}</span>
            </p>
            <i id="closePanel" class="icon-close icon-wrong" title="Close"@click="closeEditPanel"></i>
          </div>
          <div class="details-panel-fields">
            <div class="field-wrapper sel-title">
              <p class="paragraph" title="Click to edit" v-show="showParagraph" @click.stop="switchInput">
                <span >{{currentCardInfo.values[1].value}}</span>
              </p>
              <div class="input-wrapper" v-if="!showParagraph">
                <input
                  type="text"
                  class="t-textbox"
                  v-model="currentCardInfo.values[1].value"
                  ref="editInput"
                  placeholder=""
                  @blur.stop="switchParagraph"
                  @keyup.stop ='toolBtnSave($event)'
                >
                <i class="icon-wrong input-button-clear right" title="clear" @click.stop="clearInputValue"></i>
              </div>
            </div>
          </div>
          <div class='status-bar'>Status
            <Poptip placement="bottom" width="200" v-model='showStatusPanelPop'>
              <Button @click.stop='showStatusPop'>
                    <!--{{currentCardInfo.values[0].value}}-->
                    {{cuStatus}}
                    <Icon type="arrow-down-b"></Icon>
              </Button>
              <div class="api" slot="content">
                <ul class='panel-status-list'>
                  <li class='panel-status-item' 
                      v-for='statusItem in DEV.devStatusList' 
                      :class="{dropItemHigh:cuStatus ==statusItem.ChoiceName}" 
                      @click.stop='menuClick(statusItem)'>
                    {{statusItem.ChoiceName}}
                  </li>
                </ul>
              </div>
            </Poptip>
          </div>
          <div class='assignWrapper' :class="{assignbg:currentCardInfo.values[2].value !=' '}">
             <div class='innerWrapper' @click.stop='assignBar' v-show='showAssignInput'>
               <i class='fa fa-user panel-icon'></i>
               <span class='defult-assign'>assign Owner</span>
             </div>
             <div class='owner-avatar' @click.stop='assignBar'>
               <div class='avatar-bg avatar-co'>{{currentCardInfo.values[2].value | assignedName}}</div>
               <div class='avatar-name avatar-co'>{{currentCardInfo.values[2].value}}</div>
             </div>
             <div class="assignBox" v-show='showAssignList'>
               <Input v-model="ownerName" placeholder="assign owner" style="width: 328px" @on-blur.stop='searchBlur' @on-change='searchOwner'></Input>
               <ul class='assign-list'>
                  <li v-for='item in projectMember' class='assign-item' @click='clickAssignOwner(item)'>
                    <div class='assign-item-avatar assign-item-co'>{{item.ChoiceName | assignedName}}</div>
                    <span class='assign-item-name assign-item-co'>{{item.ChoiceName}}</span>
                    <Icon type="checkmark" class="owner-check"  v-if="item.ChoiceName == owner"></Icon>
                  </li>
                </ul>
             </div>
             <Icon type="ios-plus-outline" class='add-icon'></Icon>
          </div>
          <div class='dateWrapper greyBg'>
             <div class='innerWrapper' @click.stop='dateBar' v-show='!showlabelInput'>
               <i class='fa fa-calendar panel-icon'></i>
               <span class='defult-assign'>add date</span>
             </div>
             <Icon type="ios-plus-outline" class='add-icon'></Icon>
          </div>
          <div class='labelWrapper greyBg'>
             <div class='innerWrapper' @click='labelBar' v-show='!showlabelInput'>
               <i class='fa fa-paint-brush panel-icon'></i>
               <span class='defult-assign'>add label</span>
             </div>
             <Icon type="ios-plus-outline" class='add-icon'></Icon>
          </div>
          <div class='attachWrapper'  @click.stop='attachBar' :class="{greyBg:!attachItems}">
             <div class='innerWrapper'>
               <i class='fa fa-paperclip panel-icon'></i>
               <span class='defult-assign'>add attachments(0)</span>
             </div>
             <div class='attach-field' v-show='attachItems'>
               <Icon type="ios-plus-outline" class='attach-icon attach-co'></Icon>
               <span class='attach-co'>Add Attachment </span>
             </div>
             <Icon type="ios-plus-outline" class='add-icon' v-show="!attachItems" @click.stop='attachBar'></Icon>
             <Icon type="ios-close-empty" class='add-icon' v-show="attachItems" @click.stop='attachBarClose'></Icon>
          </div>
          <div class='pointWrapper greyBg'>
             <div class='innerWrapper' @click='pointBar' v-show='!showlabelInput'>
               <i class='icon-playing-cards panel-icon'></i>
               <span class='defult-assign'>add points</span>
             </div>
             <Icon type="ios-plus-outline" class='add-icon'></Icon>
          </div>
          <div class='checkWrapper greyBg'>
             <div class='innerWrapper' @click='labelBar' v-show='!showlabelInput'>
               <i class='fa fa-list panel-icon'></i>
               <span class='defult-assign'>checklist(0)</span>
             </div>
             <Icon type="ios-plus-outline" class='add-icon'></Icon>
          </div>
          <div class="edit-comments">
            <div class=edit-comments-tittle>
              <div class="comments-count left">0 Comments</div>
              <div class="comments-history right">
                <span class="icon-checkmark pp-checkbox__checkmark-animate">
                  Show history
                </span>
              </div>
              <div class="clearfix"></div>
            </div>
            <div class="edit-newComments-container"
                 :class="{addBorder:addBorderStyle}"
            >
              <div class="edit-smarttextarea">
                <!--<div class="edit-comment_tip">
                  <p>Comment and type @ to notify other people.</p>
                </div>-->
                <textarea class="edit-textarea"
                  placeholder="Comment and type @ to notify other people."
                  @focus="commentsTextAreaFocus"
                  @blur="commentsTextAreaBlur"
                >
                </textarea>
              </div>
              <div class="edit-newComments-belt" v-show="commentsBelt">
                <ul class="edit-belt-container left">
                  <li class="belt-tooltip-wrapper left">
                        <i class="icon-person"></i>
                  </li>
                  <li class="belt-tooltip-wrapper left">
                      <i class="icon-clip"></i>
                  </li>
                  <div class="clearfix"></div>
                </ul>
                <label class="edit-comments-button right">
                  Comment
                </label>
                <div class="clearfix"></div>
              </div>
            </div>
            <div class="comments-content">
              <div class="comments-content-header">
                <div class="edit-avatar left">jc</div>
                <div class="edit-currenInfo left">
                  <span class="edit-name">test</span>
                  <span class="edit-time">10:00</span>
                </div>
                <div class="icon-dots right">
                  <i class="icon-dots-vertical"></i>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="comments-box">
               
              </div>
              <p class="link-text">Like</p>
            </div>
          </div>
        </div>
        <Modal
            title="Attachment"
            v-model="attachModal"
            class-name="vertical-center-modal">
        </Modal>
    </div>
    </transition>
</template>
<script>
  import Vue from 'vue';
  import {mapState,mapMutations,mapActions} from 'vuex';
  export default {
    created() {
      this.assignedName();
      this.getPerson();
      this.getPriority();
    },
    props: {
      currentCardInfo: {
        type: Object,
        required: true
      }
    },
    data: function(){
      return {
        showParagraph: true,
        showDesPlaceholder: true,
        blur: false,
        hasAvatar: true,
        descriptionToolbar: '',
        iconPerson: false,
        iconPlayingCards: true,
        liIndex:'',
        assignPerson:[ ],
        assigneeName: ' ',
        selectAssign: false,
        caretDown: true,
        iconCalendarField: true,
        listStatus: " ",
        currentStatusShow: true,
        commentsBelt: '',
        addBorderStyle: '',
        showAssignInput:false,
        showAssignList: false,
        prioritys:[],
        showlabelInput:false,
        showStatusPanelPop:false,
        cuStatus:'',
        owner:'',
        userAvatarShow:false,
        ownerName:'',
        attachItems:false,
        attachModal:false
      }
    },
    computed: {
      editTime: function() {// update edit time
        let now = new Date();
        let year = now.getFullYear();
        let day = now.getDate();
        let month = now.getMonth()+1;
        let hour = now.getHours();
        let minute = now.getMinutes();
        day = day<10 ? '0'+day : day;
        month = month<10 ? '0'+month : month;
        return day+"/"+month+"/"+year+" "+hour+":"+minute;
      },
      statusText: function(){
        var status = this.currentCardInfo.status;//获取父组件传递的status
        var statusName = "";
        switch( status){
          case 1:{
            statusName = "To Do";
            break;
          }
          case 2:{
            statusName = "In Progress";
            break;
          }
          case 3:{
            statusName = "QA Floater Verify";
            break;
          }
          case 4:{
            statusName = "Close Done";
            break;
          }
          default:
            break;
        }
        return statusName;
      },
      ...mapState(['showEditPanel','DEV','projectMember','projectId'])
    },
    mounted(){
     
    },
    methods: {
      clickAssignOwner(item){
        // this.owner = item.ChoiceName;
        //console.log(item)
        
        var statusIdsArr = this.DEV.devStatusIds;
        var statusId = this.currentCardInfo.values[0].choiceid;
        var statusIndex;
        for(var i=0;i<statusIdsArr.length;i++) {
          if(statusId == statusIdsArr[i]){
            statusIndex = i;
            break;
          }
        }
        //console.log(this.currentCardInfo.taskId);
        var tasks = this.DEV.devBoardTasks[statusIndex].children;
        var taskIndex;
        for(var j=0;j<tasks.length;j++) {
          if(this.currentCardInfo.taskId == tasks[j].taskId) {
            taskIndex = j;
          }
        }
        //console.log(statusIndex,taskIndex)
        var taskObj = this.DEV.devBoardTasks[statusIndex].children[taskIndex];
        // console.log(item)
        var newTaskObj = {
          choiceid:item.ChoiceId,
          id:108,
          name:"Assigned To",
          value:item.ChoiceName,
        }
        taskObj.values[2]=newTaskObj;
        // console.log(taskObj)
        this.DEV.devBoardTasks[statusIndex].children[taskIndex].values[2]=newTaskObj;

        // console.log(this.DEV.devBoardTasks[statusIndex].children[taskIndex]);
        this.editDevTask({"statusIndex":statusIndex,"taskIndex":taskIndex,taskObj:this.DEV.devBoardTasks[statusIndex].children[taskIndex]})
        this.showAssignList = false;
      },
      assignBar(){
        this.showAssignInput = false;
        
        if(this.showAssignList) {
          this.showAssignList = false;
        }else {
          this.showAssignList = true;
        }
        $('.add-icon').hide();
      },
      labelBar(){
        // this.showlabelInput = true;
      },
      getPriority(){
        var priority = DevTrackApi+'ChoiceList?projectId='+this.projectId+'&fieldId=104';
        this.axios.get(priority).then(res=>{
          this.prioritys = res.data.Data;
        },err=>{
          console.log(err)
        })
      },
      menuClick(item){
        this.cuStatus =item.ChoiceName;
        this.showStatusPanelPop = false;
      },
      clickPanel(){
        this.showStatusPanelPop =false;
        // this.showAssignList = false;
      },
      showStatusPop(){
        this.showStatusPanelPop = true;
      },
      assignedName(){
        Vue.filter('assignedName', function(value='') {
          let arr =value.split(' ');
          let list=[];
          for(var i=0; i<arr.length; i++) {
            list.push(arr[i].charAt(0));
          }
          let last = list.join("");
          return last;
        })
      },
      switchInput(){//编辑文本和图片内容
        
        this.showParagraph = false;
        this.$refs.editInput.value = this.$refs.editInput.value;
          if( this.currentCardInfo.cardImage) {
            var imgSrc = this.currentCardInfo.cardImage;//图片路径
            this.$nextTick(( ) => {
              this.$refs.editInput.value = this.$refs.editInput.value + '<span>'+'<img'+' '+'src='+"\'"+imgSrc+"\'"+'>'+'</span>';
            })
          }
      },
      clearInputValue(){// clear input value
        this.$refs.editInput.value= ' '
      },
      switchParagraph(){
        this.showParagraph = true;
      },
      switchTextArea(){
        this.showDesPlaceholder = false;
      },
      textAreaBlur(){
        this.blur = true;
      },
      textAreaFocus(){
        this.blur = false;
        this.descriptionToolbar = true;
      },
      toolBtnSave(e) {
       
      },
      toolBtnCancel() {
        this.descriptionToolbar = false;
        this.showDesPlaceholder = true;
      },
      closeEditPanel(){
        this.changeEditPanelStatus(false);
      },
      assignSelectList(){
        this.assigneeName = false;
        this.selectAssign = true;
      },
      selectPerson(event,index) {
        this.currentCardInfo.values[7].value = this.assignPerson[index];
        this.assigneeName = true;
        this.selectAssign = false;
        this.liIndex = index;
        // if( index == 0) {删除时，该列隐藏
        //   this.assigneeName = false;
        // }
      },
      dateSelect(){
        this.iconCalendarField = false;
      },
      editPanelStatus(){
        this.currentStatusShow = false;
      },
      statusListLi(event,index){// choose status
        this.currentStatusShow = true;
        this.$emit('listStatusIndex',index);
        this.$refs.statusText.innerHTML= this.listStatus[index].ChoiceName;
        this.currentCardInfo.values[0].value = this.listStatus[index].ChoiceName;
      },
      commentsTextAreaFocus() {
        this.addBorderStyle = true;
        this.commentsBelt = true;
      },
      commentsTextAreaBlur(){
        this.addBorderStyle = false;
        this.commentsBelt = false;
      },
      getDatePicker() { //edit panel time
        this.iconCalendarField = true;
      },
      dateFilter() { //自定义时间过滤器
        Date.prototype.format = function(format)
        {
          var o ={
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(),    //day
            "h+" : this.getHours(),   //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
            "S" : this.getMilliseconds() //millisecond
          }
          if(/(y+)/.test(format))
            format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
          for(var k in o)
            if(new RegExp("("+ k +")").test(format))
              format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
          return format;
        };
        Vue.filter('date',function (value) {
          var today = new Date(value);
          var localeString = today.toLocaleString();
          var ddd = new Date(localeString);
          return ddd.format('yyyy/MM/dd');
        })
      },
      getPerson(){
        let projectId = this.projectId,pageSize,pageIndex,getCount,languageId,column;
        const TASK_URL = DevTrackApi+'task/Query';
        this.$http.post(TASK_URL,{
                  "token": APIToken,
                  "projectId": 181,
                  "showAll": false,
                  "pageIndex": 0,
                  "getCount": false,
                  "sortby": { "fieldId": 101, "order": "asc" },
                  "fields": [601,101,102,103,104,105,106,107,108,201,202,305],
                  "languageId": 0
                })
          .then( response =>{
                   let tasks = response.body.tasks;
                   let assignPerson= [];
                   $.each(tasks,function(index,value){
                     let values = value.values[7].value;
                    //  assignPerson.push(values);
                   });
                  let temp = new Array();
                  for(let i in assignPerson) {//delete duplicate person
                      if(temp.indexOf(assignPerson[i]) == -1 && assignPerson[i] !== '') {
                        temp.push(assignPerson[i]);
                      }
                  }
                  this.assignPerson = temp;
                  this.$emit("owner",this.assignPerson);
              },error =>{
                 console.log(error);
            })
      },
      searchOwner(){
          let searchValue = this.ownerName;
          let filter = searchValue.toUpperCase();
          let projectBaseArr = $('.assign-list>li');
          for (let i=0; i<projectBaseArr.length; i++) {
              var item = projectBaseArr[i].innerHTML;
              if ( item.toUpperCase().indexOf(filter) > -1) {
                  projectBaseArr[i].style.display = ""; 
              }else {
                  projectBaseArr[i].style.display = "none"; 
              }
          }
      },
      searchBlur(){
        this.showAssignList=false;
      },
      attachBar(){
        if(this.attachItems) {
          this.attachItems = false;
        }else {
          this.attachItems = true;
          this.attachModal = true;
        }
        //this.attachItems = true;
      },
      attachBarClose(){
        this.attachItems = false;
        console.log("cloase")
      },
      dateBar(){},
      pointBar(){},
      checkWrapper(){},
      ...mapMutations(['editDevTask','changeEditPanelStatus','changeNewTaskTitle','changeTempId','changeNewTaskFlag'])
    },
    watch:{
      currentCardInfo:function(){
        if(this.currentCardInfo.values[0].value !== ''){
          this.cuStatus =this.currentCardInfo.values[0].value;

          //this.showAssignInput=true;
          this.owner = this.currentCardInfo.values[2].value;
        }
      }
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
  @import './editPanel.scss';
  @import './cover.css';
</style>
