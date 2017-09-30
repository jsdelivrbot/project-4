<template>
  <div id="boardsView" class="boards" @click='closePop'>
    <transition name="fade" mode="out-in" appear>
      <div class="po-test-side-list" v-show='showBackLogList'>
          <div class="po-side-list-header">
              <i-button id="closeBackLog" size="small" class="pull-right" @click="closeBackLog">
                <Icon  type="close-round"></Icon>
              </i-button>
              <div class="pull-left" title="">
                  <p class='left title-common ' :class="'backlog'+backLogIcon" >
                    <span v-if='backLogRootPath.text'>{{backLogRootPath.text}}</span>
                    <span v-if='backLogFolderPath.text'>/{{backLogFolderPath.text}}</span>
                  </p>
              </div>
        </div>
        <div class="po-side-list-content" id='po-side-list-content'>
              <!--begin test-->
                <div class='backLogList' v-dragula="backLogList" service="develop-service" drake="drakecopy">
                  <div class="list_item" v-for='backLogItem in DEV.backLogList' :key="backLogItem">
                      {{ backLogItem}}
                  </div>
                </div>
              <!--end test-->
         </div>
      </div>
    </transition>
    <div class="boards-title" :class="{haspadding:showBackLogList,hasRightPadding:hasRightPadding}">
        <div class="wrapper">
          <div class='container'
               v-for='(list,$statusIndex) in DEV.devBoardTasks' 
               :status="list.ChoiceId"
               >
             <div class='status-menu' :class="'list'+$statusIndex">
                {{list.ChoiceName}}
                <span class="totalTask right">{{list.children.length}}/{{ list.total }}</span>
             </div>
             <div class="boardcontent"
                   :status="list.ChoiceId"
                   :id="$statusIndex"
                   :name="list.ChoiceName"
                   v-dragula="boardcontent"
                   service="develop-service" 
                   drake="drakecopy">
                <span class="to-add-card" @click="addNewTask" v-show='$statusIndex == 0'>
                  <div class="add-card-wrapper">
                    <div class="add-card-box" id="add-card-box" title="New Task">
                      <span class="icon-ad">+</span>
                    </div>
                    <div class="form-box" id="form-box">
                      <div class="form-box-content">
                        <div class="form-input-wrapper">
                          <input
                            type="text"
                            maxlength="200"
                            :status="list.ChoiceId"
                            placeholder="New Task"
                            class="newinput"
                            ref ='newTaskTitle'
                            v-model="newTaskTitle"
                            @keyup.enter ='addTask($event)'
                          >
                        </div>
                        <span class="icon-btn form-input-btn" :status="list.ChoiceId" @click.stop="addTask($event)">+</span>
                      </div>
                    </div>
                  </div>
                </span>
                <div class='action-card'
                    v-for='(item,$taskIndex) in list.children' 
                    :key="item.taskId" 
                    :id="'task'+item.taskId" 
                    :owner="item.values[2].value"
                    @click.stop='editTask(item,$event)'
                    :class="{active: cardActive == item.taskId}">
                  <div class="card-content right" style="width:20%;" id="card-content" v-if="item.values.assigned !== ''">
                       <p class="right bg-content"
                          :title="item.values[2].value"
                          :class="item.values[2].value | assignedName" 
                          @click.stop="changeAssign(item,$event)">
                          <!--:class="{'bg-content': isNaN(item.values[2].value) ? true : false,'bg-content-number': !isNaN(item.values[2].value) ? true : false}" -->
                         {{item.values[2].value | assignedName}}
                       </p>
                  </div>
                  <h4 class="card-msg left" style="width:80%;">
                        <p>{{item.values[1].value}}</p>
                  </h4>
                  <div class="clearfix"></div>
                  <div class="card-meta">
                      <div class="card-properties left">
                        <i class="icon-planlet"></i>
                        <i class="icon-calendar"></i>
                      </div>
                      <p class="id-badge right">ID:{{item.taskId}}</p>
                      <div class="clearfix"></div>
                  </div>
                </div>
             </div>
          </div>
        </div>
    </div>
    <div class="invite-wrapper" id="invite-wrapper">
        <Modal v-model="DEV.modal" @on-cancel="modalCancel" title="Invite Member" ok-text="ok" cancel-text="cancel" @on-ok="inviteOk">
            <div class="member-info member-co">
              <label>Email address or name</label><br>
              <Input v-model="personEmail" placeholder="Enter recipients ..." style="width: 300px"></Input>
            </div>
            <div class="member-mes member-co">
              <label>Personal message</label>
              <Input v-model="personMes" type="textarea" :rows="4" placeholder="this is optional..."></Input>
            </div>
            <div class="member-choose">
              <Radio v-model="memberChoose">Send invite via Email</Radio>
            </div>
        </Modal>
    </div>  
    <edit-panel
      v-show:editPanelShow="showEditPanel"
      :currentCardInfo="cardInfo"
      :transferedProjectId = "projectId"
      >
    </edit-panel>
    <popTip :memberInfo="curMember"></popTip>
    
  </div>
</template>
<script>
  import Vue from 'vue';
  import editPanel from '../../common/editPanel/EditPanel';
  import folder from '../../common/folder/Folder';
  import popTip from '../../common/popTip/PopTip'
  import { VueEditor } from 'vue2-editor';
  import { mapState,mapMutations,mapActions,mapGetters} from 'vuex';
  export default {
    beforeCreate(){
    },
    created () {
      var _this = this;
      this.$dragula.createService({
        name: 'develop-service',
        drake: {
            drakecopy: {
              copy: false,
            }
        }
      }).on({
          'develop-service:removeModel': ({name, el, source, dragIndex, model}) => {
          el.classList.remove('ex-moved');
      },
      'develop-service:dropModel': ({name, el, source, target, dragIndex, dropIndex, model}) => {
        this.tempIndex= Number($(target).attr("id"));
        
      },
      accepts: ({el, target}) => {
        return true ;
      },
      drag: ({el, source, target, container}) => {
        el.classList.remove('ex-moved')
        el.classList.remove('active');
      },
      drop: (opts) => {
        if($('#boardsView').length > 0){
          const {el, container, source} = opts
          if(container == null){
            opts.drake.remove();
          }
          else if($(source).hasClass('backLogList') && $(container).hasClass('boardcontent')){
            // list to boards
            $(container).find('.list_item').css({"color":"transparent","display": "none"});
            let newTitle = $(el).text().trim();
            let dropedStatusId = $(container).attr('status');
            let dropedStatusName = $(container).attr('name');
            let dropedStatusIndex = $(container).attr('id')
            const CREATE_TASK_BOARD =DevTrackApi +'Task/Create';
            var taskObj = {
              projectId: _this.projectId,
              subprojectId: _this.subProjectId,
              statusId: dropedStatusId,
              taskId: 0,
              data: [
                    {id: 101, value: newTitle}
                  ]
            }
            this.axios.post(CREATE_TASK_BOARD,taskObj).then(res=>{
                if(res.data.Success) {
                  var taskId = res.data.Data.Data;
                  var taskObj = {
                    taskId:taskId,
                    values:[
                      {chioceid:dropedStatusId,id:601,name:'Progress Status',value:dropedStatusName},
                      {id:101,name:'Title',value:newTitle},
                      {id:108,name:'',value:''}
                    ]
                  }
                  // 更新视图
                  this.DEV.devBoardTasks[dropedStatusIndex].children.unshift(taskObj);
                  
                  this.changeDevBoardTasks(this.DEV.devBoardTasks);
                  $(container).find('.list_item').remove();
                }else {
                  console.log("The http response false")
                }
              },err=>{
                console.log(err)
            })
          }
          else if($(opts.source).hasClass('boardcontent') == true && $(opts.container).hasClass('boardcontent') == true)  
          //board to board
          { 
              let taskid = $(opts.el).attr('id').replace(/[^0-9]/ig,"");// get taskid
              // console.log(taskid)
              let sourceStatusId= $(opts.source).attr('status');
              let targetStatusId= $(opts.container).attr('status');
              let sourceIndex= $(opts.source).attr('id');
              let targetIndex= $(opts.container).attr('id');

              _this.currentStatus =$(opts.el).parent().attr('name')
              if(typeof(_this.currentStatus) !== undefined){
                const MOVED_URL = DevTrackApi+'task/Update';
                this.axios.post(MOVED_URL,{
                  token: APIToken,
                  projectId:_this.projectId,
                  taskId:taskid,
                  data:[{id:601,choiceid:targetStatusId}]
                }).then(res=>{
                  if(res.status == 200){
                    let title = $(opts.el).find('h4').text().trim();
                    let owner = $(opts.el).attr("owner");
                    let devBoardTasks = this.DEV.devBoardTasks;
                    let prevsiblingsCount =$(opts.el).prevAll().length;
                    //console.log(devBoardTasks)
                    for(let i=0; i<devBoardTasks.length;i++) {
                      if(devBoardTasks[i].ChoiceId == targetStatusId){
                        let statusName = devBoardTasks[i].ChoiceName;
                        let childrenObj = {
                          "taskId": taskid,
                          "values":[
                            {choiceid: targetStatusId,id:601,name:'Progress Status',value:statusName},
                            {id:'101',name:'title',value:title},
                            {choiceid:'14',id:'108',name:'Assigned',value:owner},
                          ]
                        }
                        //"values": { "status": targetStatusId,"title": title, "assigned": owner}
                        let childrenCount = devBoardTasks[i].children.length;
                        
                        if( childrenCount > 0){
                          if( prevsiblingsCount == 1){
                            devBoardTasks[i].children.unshift(childrenObj);
                            this.tempTask  = devBoardTasks[i].children;
                            console.log("this is a test")
                          }else if( prevsiblingsCount == childrenCount - 1){
                            devBoardTasks[i].children.push(childrenObj);
                          }else{
                                devBoardTasks[i].children.splice(prevsiblingsCount - 1, 0, childrenObj);
                          }
                        }else {
                          devBoardTasks[i].children.push(childrenObj);
                        }
                        //remove old task in old status 
                        for(let j = 0 ; j < devBoardTasks.length; j++){
                          if(devBoardTasks[j].ChoiceId == sourceStatusId){
                            var found = false;
                            var k = 0;
                            for(; k < devBoardTasks[j].children.length; k++){
                              if( taskid == devBoardTasks[j].children[k].taskId){
                                  found = true;
                                  break;
                              }
                            }
                            if(found){
                              devBoardTasks[j].children.splice(k,1);
                              break;
                            }
                          }
                          $(opts.source).children("div[id=" +'task'+taskid +"]").remove();
                        }
                        
                        //this.changeDevBoardTasks(devBoardTasks);
                        break;
                      }
                    }
                    
                  }
                },err=>{
                  console.log(err)
                })
                //opts.drake.remove();
              }
          }else if($(source).hasClass('boardcontent') && $(container).hasClass('backLogList')){
          // board to list
            let itemTitle = $(el).find('h4').text().trim();
            let taskId = Number($(el).find('.card-meta').text().trim().replace(/[^0-9]/ig,''));
            $(container).find('.action-card').css({"color":"transparent","display": "none"});
            const CREATE_BACKLOG =DevTrackApi +'Task/Create';
            // var taskObj = {
            //   projectId: _this.projectId,
            //   subprojectId: _this.backLogId,
            //   statusId: '',
            //   data: [
            //         {id: 101, value: itemTitle}
            //       ]
            // }
            var taskObj = {
                "FieldValues": [
                  {
                    "id": 101,
                    "name": "title",
                    "value": itemTitle,
                  }
                ],
                "SubProjectId": _this.backLogId,
                "IsNew": true,
                "ProjectId": _this.projectId
            }
            this.axios.post(CREATE_BACKLOG,taskObj).then(res=>{
             // console.log(res)
                if(res.data.Success) {
                  var taskId = res.data.Data.Data;
                  var backlogItem  =itemTitle; 
                  this.DEV.backLogList.unshift(backlogItem);
                  // 更新backlog视图
                 this.addBackLogList(this.DEV.backLogList);
                 $(container).find('.action-card').remove();
                }else {
                  console.log("The http response when create backlog item")
                }
              },err=>{
                console.log(err)
            })
            //delete task in boards view
            const DEL_TASK = DevTrackApi +'Task/Delete';
            
          }
          el.classList.add('ex-moved');
        }
        // opts.drake.remove();
      },
      over: ({el, container}) => {
        var overTagName = $(container).get(0).tagName.toLowerCase();// hover table or div
        var elTagName = $(el).get(0).tagName.toLowerCase();// dragged element tr or div
        if( overTagName == 'div'){
            if(elTagName !== 'div'){
              $(el).children().css({"margin-left":"16px"})
              $(el).children().css({"width":"144px","border-radius":"5px"});
            }
        }
        var tagName = $(el).get(0).tagName.toLowerCase();
        if (tagName == 'div')  {
            el.classList.add('ex-moved')
            el.classList.add('bg-placeholder');
        }else {
          el.classList.add('tr-ex-moved');
        }
      },
      out: ({el, container}) => {
        el.classList.add('ex-moved')
        el.classList.remove('bg-placeholder')
      }
    });
      this.uppercaseFilter();
      this.assignedName();
      this.cardInfo = {};
      this.initBackLog();
      
      var defaultHeight = $(window).height();
      window.onresize = function(event) {
        _this.initGUI();

        // for poptip
        var winHeight = $(window).height();
        var changedHeight = defaultHeight-winHeight;
        var popDefault = $('.member-list').height();
        $('.member-list').css("height",popDefault-changedHeight);
         
      };
      this.getBoardViewTasks();
      // this.$nextTick(function(){
      //   this.getDatas();
      // })
      
      //this.detailPanelHide();
    },
    mounted() {
      var _this = this;
      this.initGUI();
      this.getScrollHeight();
      this.getMembers({projectId:_this.$route.query.projectId});
      //this.detailPanelHide();
    },
    data: function() {
      return {
        hasRightPadding: false,
        tempIndex: 0,
        list:[],
        currentStatus:'',
        GroupByItems: [
          { name: 'None'},
          { name: 'Status Group'},
        ],
        showSettingPopTip:false,
        ListByValue: 'StatusBy',
        GroupByValue: 'None',
        showAssignedPop: false,
        newTaskTitle: '',
        ListItems: [],
        parentTxt: '',
        childTxt: '',
        project: '',
        isClick: false,
        boardcontent:[],
        box: [ ],
        end: '',
        settingListShow: false,//show status list
        isTransform: false,
        tasks: [ ],//store all project tasks
        filterByItems: [
          { name: 'Followed by',icon:'followby'},
          { name: 'Assigned by',icon:'assigned'},
          { name: 'Due date',icon:'duedate'},
          { name: 'Tags',icon:'tags'},
          { name: 'Status by',icon:'statusby'}
        ],
        isSearchPanelShow: false,
        cardInfo: {},//data
        statusList: [ ],
        selectedStatusIndex: [], //use for store selected status to display
        subProjects: [],
        selectContent: '',
        sprints: '',
        folders: '',
        folderList: '',
        pathIconType: '',
        memberChoose: false,
        personEmail:'',
        personMes:'',
        findMember:'',
        cardActive:'',
        tempTask:[],
        curMember:''
      }
    },
    computed: {
      backLogIcon() {
          if ((this.backLogRootPath.text == '') && (this.backLogFolderPath.text =='')) {
            return this.$store.state.backLogRootPath.subType;
          }else {
            return this.$store.state.backLogRootPath.subType;
          }
      },
      pathIcon() {
        if ((this.parentTxt == '') && (this.childTxt =='')) {
          return this.$store.state.subProjectType;
        }else {
          return this.pathIconType;
        }
      },
      proId() {
        return this.$store.state.projectId;
      },
      subId() {
        return this.$store.state.subProjectId;
      },
      isBoardsBackend:{
        get(){
          this.$store.state.isBoardsBackend;
        },
        set(){

        }
      },
      ...mapState(['DEV','linkedSpaceName','projectMember','backLogList','backLogId','showBackLogList','boardViewTasks','members','projectId','subProjectId','currentTaskId','boardViewTasks','backLogId','backLogList','backLogRootPath','backLogFolderPath','showEditPanel','newTaskId'])
    },
    methods: {
      getBoardViewTasks(){
        var routerParam = this.$route.query;
        var queryObj = {"ProjectId":routerParam.subProjectId,"PrefIds": [3000044]};
        this.axios.post(GET_HISTORY_INFO,queryObj).then(res=>{
          var folderId ;
          var statusIds=[];
          if(res.data.Data.length>0) {
            folderId = res.data.Data[0].PreferenceValue;
            statusIds = this.DEV.devStatusIds;
          }else {
            folderId = routerParam.subProjectId;
            statusIds = this.DEV.devStatusIds;
          }
            
            
          this.getDevBoardTasks({statusIds:statusIds,subProjectId:folderId});
        },err=>{
          console.log(err)
        })
      },
      getDatas(){
        let queryObj = this.$route.query;
        let projectId = queryObj.projectId;
        let subProjectId = queryObj.subProjectId;
        if(!queryObj.hasOwnProperty('folderId')) {
          //没有folderId
          this.changeIds({projectId:queryObj.projectId,subProjectId:subProjectId});
          this.getStatusList();
          let statusIds = this.DEV.devStatusIds;
          this.$nextTick(function(){
            this.getDevBoardTasks({statusIds:statusIds,subProjectId:subProjectId});
          })
        }else {
           if(queryObj.hasOwnProperty('projectId') && queryObj.hasOwnProperty('subProjectId') && queryObj.hasOwnProperty('folderId')){
             // console.log(queryObj)
              this.changeIds({projectId:queryObj.projectId,subProjectId:subProjectId});
              this.changeDevFolderId(queryObj.folderId);
              this.getStatusList();
              let statusIds = this.DEV.devStatusIds;
              this.$nextTick(function(){
                this.getDevBoardTasks({statusIds:statusIds,subProjectId:queryObj.folderId});
              })
           }
        }
      },
      getScrollHeight(){
        let _this = this;
        var arr = [];
        $('.boardcontent').scroll(function(){
          let columnScrollTop = $(this).scrollTop(); // scroll height
          let columnHeight = $(this).height();//column height
          let allContentHeight = $(this)[0].scrollHeight; // need scroll height
          if(columnScrollTop + columnHeight >= allContentHeight){
            let statusId = Number($(this).attr('status'));
            arr.push(statusId)
            let statusIndex = $(this).attr('id');
            _this.devLoadingTask({"statusId":arr,'statusIndex':statusIndex})
            }else if(columnScrollTop == 0){
              // reach top
              console.log("top");
            }
          })
      },
      detailPanelHide(){
        var _this = this;
          $('#development').click(function(e){
            e.stopPropagation();
            var clickClassName = e.target.className;
            _this.cardActive = '';
            _this.changeEditPanelStatus({b:false});
            if(clickClassName  == 'editPanel'){
              _this.changeEditPanelStatus({b:true});
            }
            //set member poptip
            $('#popTip').hide();
            if(clickClassName  == 'popTip'){
              $('#popTip').show();
            }
            if(clickClassName  != 'ivu-poptip-popper'){
              $('.ivu-poptip-popper').hide();
            }
            
          })
      },
      initGUI() {
       $('.po-test-side-list').height(window.innerHeight-107);
        $('.wrapper').height(window.innerHeight-107).width(window.innerWidth).
            css('display','inline-block').css('position','relative').css('overflow-x','scroll').css('overflow-y','hidden');
        $('.boardcontent ').height(window.innerHeight-163);
        $('#boards').height(window.innerHeight-107).width(window.innerWidth);
        if($('.po-test-side-list:visible').length > 0)
        {
          $('.wrapper').width(window.innerWidth-350);
        }
      },
      initBackLog() {
        this.showBackLogList = false;
      },
      editTask(item,e) {
          $('#popTip').hide();
          if (this.cardActive =='' || this.cardActive != item.taskId) {
            this.cardActive = item.taskId;
            this.changeEditPanelStatus({b:true});
            this.cardInfo = item;
            console.log(this.cardInfo)
          }else {
            this.cardActive = '';
            this.changeEditPanelStatus({b:false});
            this.cardInfo = {};
          }
      },
      closePop(){
          this.isSearchPanelShow = false;
          this.isBoardsBackend = false;
          $(".search-mes").removeClass("transform");
      },
      addNewTask(){
        $("#add-card-box").css('display',"none");
        $("#form-box").css('display',"block");
      },
      uppercaseFilter( ){//定义字母大写过滤器
        Vue.filter('uppercase', function(value) {
          if (!value) { return ''}
          value = value.toString()
          return value.toUpperCase();
        })
      },
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
      changeSecondLevel(text,subType){
        this.$store.commit({
          type: 'changeSecondLevel',
          text: text,
          subType: subType
        })
      },
      searchTask() {
      },
      closeBackLog() {
       this.backLogListShow(false);
      },
      backLogListShow(flag) {
        this.$store.commit({
          type:'switchBackLog',
          backLoglist: flag
        })
      },
      changeBackLogId(id) {
        this.$store.commit({
          type: 'changeBackLogId',
          backLogId: id
        })
      },
      addTask(event) {
        var _this = this;
        var newTitle = this.newTaskTitle;
        var curStatusId = $(event.currentTarget).attr("status");
       if( newTitle != '') {
          const CREATE_TASK =DevTrackApi +'Task/Create';
          var createObj ={
            projectId: _this.projectId,
            subprojectId: _this.subProjectId,
            statusId: curStatusId,
            taskId: 0,
            data: [
                  {id: 101, value: newTitle}
                ]
          }
          this.axios.post(CREATE_TASK,createObj).then(res=>{
            if(res.data.Success) {
              var taskId = res.data.Data.Data;
              var taskObj = {
                taskId:taskId,
                values: [
                  {choiceid:curStatusId,id:601,name:"Progress Status",value:""},
                  {id:101,name:"Title",value:newTitle},
                  {choiceid:'',id:108,name:"Assigned To",value:''}
                ]
              }
              console.log(taskObj)
              // 更改vuex state
              this.DEV.devBoardTasks[0].children.unshift(taskObj);
               this.changeDevBoardTasks(this.DEV.devBoardTasks);
              this.newTaskTitle=''
            }
          },err=>{
            console.log(err)
          })
       }
      },
      changeAssign(cardInfo,e){
        var name = cardInfo.values[2].value;
        if(name != ''){
          // var state = $('#popTip').css('display');
          var state =this.DEV.devPopTip;
          if(state == false){
            this.changeDevPopTip(true);
            var rect = e.target.getBoundingClientRect();
            var left = rect.left;
            var top = rect.top;
            $('#popTip').css({
              "display":"block",
              "position":"absolute",
              "left":rect.left-100,
              "top": rect.top+30-100,
              "z-index":10000
            })
          }else {
            //$('#popTip').css('display',"none")
            this.changeDevPopTip(false)
          }
        }
        this.curMember = cardInfo;


        $('.ivu-poptip-popper').hide();
      },
      addMember(e){
        $('.ivu-poptip-popper').hide();
        $('.boardsBackend').css("background","#fff");
        this.modal = true;
        this.changeBoardsBackend(true)
      },
      modalCancel(){
        this.modal = false;
        this.changeBoardsBackend(false)
      },
      inputFocus(e){
          e.stopPrapagation();
      },
      inviteOk(){
        this.changeBoardsBackend(false)
      },
      chooseMember(statusId,statusIndex,taskIndex,member){
        //console.log(statusId,statusIndex,taskIndex,member)
        Vue.set(this.DEV.devBoardTasks[statusIndex].children[taskIndex].values[2],'value', member.ChoiceName);
        let _this = this;
        let projectId = this.projectId;
        let taskId =this.DEV.devBoardTasks[statusIndex].children[taskIndex].taskId;
        let memberName = member.ChoiceName;
        let memberId = member.ChoiceId;
        let memberObj = {
          taskId: taskId,
          projectId: projectId,
          data: [ {id:108,value:member.ChoiceName,ChoiceId:member.ChoiceId}]
        }
        
        this.changeAssignMember(memberObj);
        $('.ivu-poptip-popper').hide();
        this.saveEditTask(memberObj);
        //this.devLoadingTask({"statusId":statusId,'statusIndex':statusIndex})
      },
      showProjectList(){
        let projectId = this.$route.query.projectId;
        const PROJECTS = DevTrackApi + 'SubProject/GetTree';
        this.axios.post(PROJECTS,{
                "IncludeClosed": true,
                SubProjectId: 0,
                projectId: projectId,
          }).then(res=>{
              if(res.data.Success) {
                let projectList = res.data.Data.nodes;
                this.addSpaceList(projectList);
                for(let i=0;i<projectList.length;i++) {
                  if(projectList[i].subprojectId == this.subProjectId){
                    this.changeContent({selectContent:projectList[i].subprojectName});
                   this.changeCurPath({"subprojectName":projectList[i].subprojectName,
                    subprojectType:projectList[i].subprojectType});
                    break;
                  }
                }
                this.spaceList = res.data.Data.nodes;
              }
            },err=>{
              console.log(err)
          })
      },
      ...mapMutations(['changeDevPopTip','changeCurPath','changeDevFolderId','addSpaceList','changeCurPath','changeContent','changeLinkedName','changeLinkedSpaceShow','changeDevBoardTasks','addBackLogList','changeBoardViewTasks','addBackLogList','changeBoardViewTasks','changeCurrentTaskId','changeEditPanelStatus','switchBackLog','changeIds','changeNewTaskTitle','getNewTaskId','changeNewTaskFlag','changeTempId','changeBoardsBackend']),
      ...mapActions(['getDevBoardTasks','getStatusList','getMembers','saveEditTask','changeAssignMember','addATask','upDateBoardsDisplay','getTasksData','devLoadingTask','updateTaskMoved'])
    },
    watch:{
      showEditPanel: function() {
        let showEditPanel = this.showEditPanel;
        let showBackLogList = this.showBackLogList;
        if( showEditPanel === true) {
            $('.wrapper').width($(window).width()-350);
        }else {
            $('.wrapper').width($(window).width());
        }
      },
      subProjectId: function(){
        //this.getDatas();
      }
    },
    components: {
      editPanel,
      VueEditor,
      folder,
      popTip
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
  @import './boards.scss';
  @import 'poptip.scss';
</style>
