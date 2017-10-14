<template>
  <div id="statusGroup" class="statusGroup" @click='closePop'>
    <transition name="fade" mode="out-in" appear>
      <div class="po-test-side-list" v-show='showBackLogList'>
          <div class="po-side-list-header">
               Release BackLog
              <i-button id="closeBackLog" size="small" class="pull-right" @click="closeBackLog">
                <Icon  type="close-round"></Icon>
              </i-button>
              <div class="pull-left" title="">
                  <!--<p class='left title-common ' :class="'backlog'+backLogIcon" >
                    <span v-if='backLogRootPath.text'>{{backLogRootPath.text}}</span>
                    <span v-if='backLogFolderPath.text'>/{{backLogFolderPath.text}}</span>
                  </p>-->
              </div>
        </div>
        <div class="po-side-list-content" id='po-side-list-content'>
              <!--begin test-->
                <div class='backLogList' id='backLogList'>
                  <div class="list_item" v-for='backLogItem in DEV.backLogList' :key="backLogItem">
                      {{ backLogItem}}
                  </div>
                </div>
              <!--end test-->
         </div>
      </div>
    </transition>
    <div class="boards-title" :class="{haspadding:showBackLogList,hasRightPadding:hasRightPadding}">
        <div class="wrapper" id="wrapper">
          <div class='container'
                id='container'
               v-for='(list,$statusIndex) in testData' 
               :status="list.ChoiceId"
               >
             <div class='status-menu' :class="'list'+$statusIndex">
                {{list.ChoiceName}}
                <span class="totalTask right">{{list.children.length}}/{{ list.total }}</span>
             </div>
             <div class="boardcontent connectedSortable" 
                  :status="list.ChoiceId"
                  :index='$statusIndex'
                  v-dev-scroll='scrollFun'
                >
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
                      :id="'task'+item.taskId" 
                      :status="item.values[0].choiceid"
                      :owner="item.values[2].value"
                      @click.stop='editTask(item,$event)'
                      v-show="actionCardShow"
                      :class="{active: cardActive == item.taskId}">
                    <div class="card-content right" style="width:20%;" id="card-content" v-if="item.values.assigned !== ''">
                        <p class="right bg-content"
                            :class="{bgColor:item.values[2].value.length>0}"
                            :title="item.values[2].value" 
                            @click.stop="changeAssign(item,$event)">
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
                  <!--<div class="group-dashed-box connectedSortable">-->
                    <div class="group-item" v-for='status in list.statusBox' :title='status.value'>
                       {{status.value}}
                    </div>
                  <!--</div>-->
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
    <!--v-show:editPanelShow="showEditPanel"        :transferedProjectId = "projectId"-->
    <edit-panel
      :currentCardInfo="cardInfo"
      >
    </edit-panel>
    <popTip :memberInfo="curMember"></popTip>
  </div>
</template>
<script>
  import Vue from 'vue';
  import editPanel from '../../common/editPanel/EditPanel.vue';
  import folder from '../../common/folder/Folder';
  import popTip from '../../common/popTip/PopTip';
  import { mapState,mapMutations,mapActions,mapGetters} from 'vuex';
  export default {
    
    created () {
      var _this = this;
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
      this.initGUI();


      // document.onkeypress=function(e){
      //   if(e.keyCode == 97) {
      //     console.log("97")
      //   }
      // }
      
    },
    updated(){
      // this.initGUI();
    },
    mounted() {
      var _this = this;
      
      //this.getScrollHeight();
      this.getMembers({projectId:_this.$route.query.projectId});
      this.scrollDirective();
      this.sortBackLog();
      
      this.initGUI();
    },
    data: function() {
      return {
        testData:[
            {
                ChoiceId:3,
                ChoiceName:"QA Review",
                IsActive:true,
                OrderNo:0,
                "children": [
                    {
                        "taskId": 104,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "In Progress",
                                "choiceid": 38
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[From DevTest]: New Web GUI"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Matt Peterson",
                                "choiceid": 15
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "Medium",
                                "choiceid": 3
                            }
                        ]
                    },
                    {
                        "taskId": 2195,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "In Progress",
                                "choiceid": 38
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[Documentation]Extract Request Content"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Matt Peterson",
                                "choiceid": 15
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "-1"
                            }
                        ]
                    },
                    {
                        "taskId": 2196,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "In Progress",
                                "choiceid": 38
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[Windows Development]Extract Request Content"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Matt Peterson",
                                "choiceid": 15
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "-1"
                            }
                        ]
                    }
                ],
                "statusBox":[
                  {  "id": 601,
                  "name": "Progress Status",
                  "value": "In Progress",
                  "choiceid": 38}],
                "total": 3
            },
            {
                ChoiceId:40,
                ChoiceName:"close and done",
                IsActive:true,
                OrderNo:0,
                "children": [
                    {
                        "taskId": 111,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "close",
                                "choiceid": 41
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[Windows Development]Web Remove 64k limitation on Memo Sizes"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Pamela Miller ",
                                "choiceid": 18
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "Urgent",
                                "choiceid": 1
                            }
                        ]
                    },
                    {
                        "taskId": 112,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "to be close",
                                "choiceid": 45
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[QA]Web Remove 64k limitation on Memo Sizes"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Matt Peterson",
                                "choiceid": 15
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "Urgent",
                                "choiceid": 1
                            }
                        ]
                    },
                    {
                        "taskId": 113,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "done",
                                "choiceid": 42
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[Mobile Development]Web Remove 64k limitation on Memo Sizes"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Pamela Miller ",
                                "choiceid": 18
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "Urgent",
                                "choiceid": 1
                            }
                        ]
                    },
                    
                ],
                "statusBox":[ {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "close",
                                "choiceid": 41
                            },{
                                "id": 601,
                                "name": "Progress Status",
                                "value": "to be close",
                                "choiceid": 45
                            },
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "working now",
                                "choiceid": 78
                            }],
                "total": 3
            },
            {
                ChoiceId:43,
                ChoiceName:"do work",
                IsActive:true,
                OrderNo:0,
                "children": [
                    {
                        "taskId": 234,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "edit",
                                "choiceid": 51
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[QA]Web Remove 64k limitation on Memo Sizes"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Matt Peterson",
                                "choiceid": 15
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "Urgent",
                                "choiceid": 1
                            }
                        ]
                    },
                    {
                        "taskId": 154,
                        "values": [
                            {
                                "id": 601,
                                "name": "Progress Status",
                                "value": "edit",
                                "choiceid": 51
                            },
                            {
                                "id": 101,
                                "name": "Title",
                                "value": "[Mobile Development]Web Remove 64k limitation on Memo Sizes"
                            },
                            {
                                "id": 108,
                                "name": "Assigned To",
                                "value": "Pamela Miller ",
                                "choiceid": 18
                            },
                            {
                                "id": 104,
                                "name": "Priority",
                                "value": "Urgent",
                                "choiceid": 1
                            }
                        ]
                    },
                    
                ],
                "statusBox":[
                  {
                    "id": 601,
                    "name": "Progress Status",
                    "value": "edit",
                    "choiceid": 51
                            },{
                                "id": 601,
                                "name": "Progress Status",
                                "value": "eidt new ",
                                "choiceid": 234
                            },{
                                "id": 601,
                                "name": "Progress Status",
                                "value": "update and edit",
                            "choiceid": 35}
                            ],
                "total": 2
            },
        ],
        dashedShow:false,
        actionCardShow:true,
        divX:'',
        divY:'',
        //statusBox:[],
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
      ...mapState(['DEV','linkedSpaceName','projectMember','backLogList','backLogId','showBackLogList','boardViewTasks','members','projectId','subProjectId','currentTaskId','boardViewTasks','backLogId','backLogList','backLogRootPath','backLogFolderPath','showEditPanel','newTaskId'])
    },
    updated(){
      this.sortBackLog();
      this.dragAnddrop();
      //this.initGUI();
      
    },
    methods: {
      groupItemOver(){
        $('.group-item').sortable({
          out: function( event, ui ) {
            $(ui.item).css("background","red")
          }
          
        })
      },
      scrollDirective(){
        Vue.directive('devScroll',{
          inserted:function(el,binding){
            var fun =binding.value;
            el.addEventListener('scroll',function(e){
              var wrapper = $(el).height();
              var top = $(el)[0].scrollTop;
              var boardcontentHeight = $(el)[0].scrollHeight
              console.log(wrapper,top,boardcontentHeight)
              fun(wrapper,top,boardcontentHeight,el)
            })
          }
        })
      },
      scrollFun(wrapper,top,box,el){
        var _this = this;
        if(wrapper + top == box) {
          var index = $(el).attr('index');
          var statusId = this.DEV.devStatusIds[index];
          _this.devLoadingTask({"statusId":statusId,'statusIndex':index})
         console.log("reach bottom")
        }
      },
      dragAnddrop(){
        var _this = this;
        var initStatusId;
        var indexObj ={
          oldStatusId:'',
          newStatusId:'',
          taskId:'',
          taskIndex:'',
          owner:'',
          title:''
        };
        

        //defind task Obj 
        var task = {
          "taskId": '',
          "groupStatusId":'',
          "values": []
        };
        // $('.wrapper').on('mousemove',function(e){
        //   _this.divX = e.clientX;
        //   _this.divY = e.clientY;
        //   var clientX = e.clientX;
        //   var clientY = e.clientY;
        //   var offsetX = e.offsetX;
        //   var offsetY = e.offsetY;
        //   console.log("clientX:"+clientX,"clientY:"+clientY,"offsetX:"+offsetX,"offsetY:"+offsetY)
        // })
        $( ".boardcontent" ).sortable({
            connectWith: ".connectedSortable",
            placeholder: "ui-group-placeholder",
            cursor: "move",
            start:function(event, ui ){
              //start
              var groupStatusId = $(event.target).attr('status');
              var taskId = $(ui.item).attr('id').replace(/[^0-9]/ig,"");
              var taskStatusId = $(ui.item).attr('status');
              var owner = $(ui.item).attr('owner');
              var title = $(ui.item).find('h4').text().trim();

              var tempArr = [
                {
                    "id": 601,
                    "name": "Progress Status",
                    "value": " ",
                    "choiceid": taskStatusId
                },
                {
                    "id": 101,
                    "name": "Title",
                    "value": title
                },
                {
                    "id": 108,
                    "name": "Assigned To",
                    "value": owner,
                    "choiceid": ''
                },
              ]
              task.taskId = taskId;
              task.groupStatusId = groupStatusId;
              task.values = tempArr;
            },
            over:function(event, ui){
               // indexObj.oldStatusId = $(event.target).attr('status');
                var groupStatusId = task.groupStatusId;
                var curOverStatusId = $(event.target).attr('status');//over status

                //获取每个group 包含的status
                var overStatusIndex;
                var allTasks = _this.testData;
                for(let i=0;i<allTasks.length;i++) {
                  if(curOverStatusId == allTasks[i].ChoiceId) {
                    overStatusIndex = i;
                    break;
                  }
                }
                var storeStatusArr = [];
                allTasks[overStatusIndex].children.forEach(task=>{
                  storeStatusArr.push(task.values[0])
                })
                _this.statusBox = storeStatusArr;
                //_this.actionCardShow = false;
               
               if (curOverStatusId !== groupStatusId) {
                  $(event.target).find('.action-card').hide();
                  $(event.target).find('.ui-group-placeholder').hide();
                  // $(event.target).find('.group-dashed-box').show();
                  $(event.target).find('.group-item').show();
                  
                  $(event.target).find('ui-group-placeholder').css({
                    background:'transparent',
                    height:0
                  })

                  //begin 
                  $('.group-dashed-box>.group-item').css('background','#eee')
                  $('.group-dashed-box>.group-item').css('color','#333');
                 
                  
                  

                  
                  
                  // $(event.target).find('.ui-group-placeholder').css({
                  //   position:"absolute",
                  //   top:_this.divY+'px',
                  //   left:_this.divX+'px',
                  //   height:'20px',
                  //   background:"red"
                  // })
                  
                  

               }else {
                  $(event.target).find('.action-card').show();
                  $(event.target).find('.ui-group-placeholder').show();
                  // $(event.target).find('.group-dashed-box').hide();
                  $(event.target).find('.group-item').hide();

                  


               }
               //console.log(curOverStatusId,groupStatusId);
               
            },
            out:function(event,ui){
               $(event.target).find('.action-card').show();
                $(event.target).find('.ui-group-placeholder').show();
                //$(event.target).find('.group-dashed-box').hide();
                $(event.target).find('.group-item').hide();
                
                $(event.target).find('.ui-group-placeholder').css({
                    position:"relative",
                    width:'250px',
                    height:'100px',
                    margin: '16px',
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    border:'2px dashed #ccc'
                  })
            },
            receive:function(event,ui){
              //console.log(task)
             // console.log("receive")
           
            },
            change:function(event, ui){
               console.log("chanage")
               
            },
        }).disableSelection();


       // console.log(this.DEV.folderId);
        
      },
      sortBackLog(){
        // backLogList
        $( "#backLogList" ).sortable({
            connectWith: ".connectedSortable",
            placeholder: "ui-backlog-placeholder",
            cursor: "move",
            start:function(event, ui ){
              console.log(ui)
            },
            over:function(){
                
            },
            
        }).disableSelection();
      },
      getBoardViewTasks(){
        var routerParam = this.$route.query;
        var queryObj = {"ProjectId":routerParam.subProjectId,"PrefIds": [3000044]};
        this.axios.post(GET_HISTORY_INFO,queryObj).then(res=>{
          var folderId ;
          var statusIds=[];
          if(res.data.Data.length>0) {
            folderId = res.data.Data[0].PreferenceValue;
            statusIds = this.DEV.devStatusIds;
            this.changeDevFolderId(folderId);
          }else {
            folderId = routerParam.subProjectId;
            statusIds = this.DEV.devStatusIds;
          }
            
            
          this.getDevBoardTasks({statusIds:statusIds,subProjectId:folderId});
        },err=>{
          console.log(err)
        })
      },
      getScrollHeight(){
        let _this = this;
        var arr = [];
        $('.boardcontent').scroll(function(){
          let columnScrollTop = $(this).scrollTop(); // scroll height
          let columnHeight = $(this).height()-5;//column height
          let allContentHeight = $(this)[0].scrollHeight; // need scroll height
          //console.log(columnScrollTop,columnHeight,allContentHeight)
          if(columnScrollTop + columnHeight == allContentHeight){
           // console.log(columnScrollTop,columnHeight,allContentHeight)
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
      initGUI() {
       $('.po-test-side-list').height(window.innerHeight-107);
        $('.wrapper').height(window.innerHeight-107).width(window.innerWidth).
            css('display','inline-block').css('position','relative').css('overflow-x','scroll').css('overflow-y','hidden');
        $('.boardcontent ').height(window.innerHeight-170);
        $('.boardcontent-box').height(window.innerHeight-200);
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
            //console.log(this.cardInfo)
            $('.editPanel').show()
          }else {
            this.cardActive = '';
            $('.editPanel').hide()
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
          var createObj = {
                "FieldValues": [
                  {
                    "id": 101,
                    "name": "Title",
                    "value": newTitle,
                  },
                  {
                    "id":601,
                    "name": "Progress Status",
                    "value": "",
                    "choiceid": curStatusId
                  },
                  {
                    "id":108,
                    "name": "Assigned To",
                    "value": "terry json",
                    "choiceid": 13
                  }
                ],
                "SubProjectId": _this.subProjectId,
                "IsNew": true,
                "FieldIds": [
                  601,101,108
                ],
                "ProjectId": _this.projectId,
              }

          this.axios.post(CREATE_TASK,createObj).then(res=>{
            if(res.data.Success) {
              var taskId = res.data.Data.Data;
              var taskObj = {
                taskId:taskId,
                values: [
                  {choiceid:curStatusId,id:601,name:"Progress Status",value:"QA Review"},
                  {id:101,name:"Title",value:newTitle},
                  {choiceid:'',id:108,name:"Assigned To",value:'terry json'}
                ]
              }
             // console.log(taskObj)
              // 更改vuex state
              this.DEV.devBoardTasks[0].children.unshift(taskObj);
              this.changeDevBoardTasks(this.DEV.devBoardTasks);
              this.newTaskTitle='',
              this.changeEditPanelStatus({b:true});
              this.cardInfo = taskObj;
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
              "position":"absolute",
              "left":rect.left-100,
              "top": rect.top+30-100,
              "display":"block",
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
      closePop(){
        this.changeDevPopTip(false);
        this.changeEditPanelStatus(false);
      },
      ...mapMutations(['updateColumnTasks','changeDevPopTip','changeCurPath','changeDevFolderId','addSpaceList','changeCurPath','changeContent','changeLinkedName','changeLinkedSpaceShow','changeDevBoardTasks','addBackLogList','changeBoardViewTasks','addBackLogList','changeBoardViewTasks','changeCurrentTaskId','changeEditPanelStatus','switchBackLog','changeIds','changeBoardsBackend']),
      ...mapActions(['updateTaskMove','updataDevTask','getDevBoardTasks','getStatusList','getMembers','saveEditTask','changeAssignMember','addATask','upDateBoardsDisplay','getTasksData','devLoadingTask','updateTaskMoved'])
    },
    watch:{
      showEditPanel: function() {
        let showEditPanel = this.showEditPanel;
        let showBackLogList = this.showBackLogList;
        if( showEditPanel === true) {
            $('.wrapper').width($(window).width()-350);
            console.log($('.wrapper').width())
           
        }else {
            $('.wrapper').width($(window).width());
             this.changeEditPanelStatus({b:false});
        }
      }
    },
    components: {
      editPanel,
      folder,
      popTip
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
  @import './statusGroup.scss';
  @import './statusGroupCover.css';
  @import './statusGroupBacklog.scss';
</style>
