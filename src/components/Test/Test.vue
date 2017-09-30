<template>
  <div id='test' class="test-boards">
    <div class="boards-title" id="test-board-view-wrap" :class="{hasPadding: showTestRunList && !TEST.isTestRunTemplateView}">
        <!--style="position:relative;z-index:2;-->
        <div class="boards-container">
            <div class="boards-title-left left">
              <div class="title-bread">
                <p class='left title-common path' 
                  :class="'pathicon_'+pathIcon" @click.stop='openSearchPanel'>
                    <span :title='projectSpace' class='projectSpaceIcon' >{{projectSpace}}</span>
                </p>
                <div class="search-mes left title-common"
                     @click="openSearchPanel">
                  <i class="fa fa-caret-up"></i>
                </div>
                <!--select test cycle-->
                <Poptip placement="bottom" 
                        width="200" 
                        class="left" 
                        style="margin-top:3px;"
                        v-show="showGroupBy"
                        v-model="showLeftGroupByOption"
                        >
                  <i class="fa fa-list set-list" title="set list by" type="ghost"></i>
                  <div class="api" slot="content">
                    <div class="setting">
                          <ul>
                            <li class="setting-item" style=" border-bottom: 1px solid #999999;">
                              <Icon type="ios-list-outline" style="font-size: 16px;"></Icon> 
                              <span style="padding-left:5px;padding-bottom: 5px;">List By</span>
                              <div style="padding-left:10px;">
                                <Radio-group v-model="ListByValue" vertical>
                                  <Radio label="StatusBy">
                                    <span>Status</span>
                                  </Radio>
                                  <Radio label="group">
                                    <span>Permutations</span>
                                    <Icon type="chevron-right" style="margin-left: 40px;"></Icon>
                                  </Radio>
                                </Radio-group>
                              </div>
                            </li>
                            <li class="setting-item">
                              <Icon type="ios-toggle-outline" style="font-size: 16px;"></Icon>
                              <span style="padding-left:5px">Group By</span>
                              <div style="padding-left:10px;">
                              <Radio-group v-model="GroupByValue" vertical>
                                <Radio v-for="item in GroupByOptions" :key="item.name" :label="item.name">
                                  <span>{{ item.name}}</span>
                                </Radio>                               
                              </Radio-group>
                              </div>
                            </li>
                          </ul>
                          <div class="setting-btn">
                            <span class="btn-ok setting-btn" @click.stop="btnOkSettingLeft">OK</span>
                            <span class="btn-reset setting-btn" @click.stop="btnNoSettingLeft">Cancel</span>
                          </div>
                        </div>
                  </div>
                </Poptip>
                 <!--select project release folder-->
                <Poptip placement="bottom" 
                        width="200" 
                        class="left" 
                        style="margin-top:3px;"
                        v-show="!showGroupBy"
                        v-model="showGroupByProjectOption">
                        <i class="fa fa-list set-list" title="set list by" type="ghost"></i>
                        <div class="api" slot="content">
                          <div class="setting">
                            <ul>
                              <li class="setting-item" >
                                <Icon type="ios-list-outline" style="font-size: 16px;"></Icon> 
                                <span style="padding-left:5px;padding-bottom: 5px;">List By</span>
                                <div style="padding-left:10px;">
                                  <Radio-group v-model="GroupByValueProject" vertical @on-change="GroupByProjectClick">
                                  <Radio v-for="item in GroupByProject"
                                         :key="item.name" 
                                         :label="item.name">
                                    <span >{{ item.name}}</span>
                                  </Radio>                               
                                </Radio-group>
                                </div>
                              </li>
                            </ul>
                          </div>
                      </div>
                </Poptip>

                <!-- board view/ grid view -->
                <Poptip 
                  placement="bottom" width="150">
                  <img v-show="TEST.bShowGridView" src='../../../static/img/switch.png' style="padding-left: 10px;vertical-align: middle;cursor:pointer;" type="ghost">
                    <div class="api" slot="content">          
                    <div class="setting">
                          <ul class="ivu-dropdown-menu">
                            <li class="ivu-dropdown-item" style="padding: 7px 7px;" @click.stop="changeCurrentTestViewId(1)">
                                <Icon type="checkmark-round" :style="{ 'color': this.TEST.curTestViewId == 1 ? '':'transparent' }"></Icon>
                                <Icon type="ios-photos" style="font-size: 20px; vertical-align:sub; margin-left: 10px;"></Icon> Board View
                            </li>
                            <li class="ivu-dropdown-item" style="padding: 7px 7px;" @click.stop="changeCurrentTestViewId(2)">
                              <Icon type="checkmark-round" :style="{ 'color': this.TEST.curTestViewId == 2 ? '':'transparent' }"></Icon>
                              <Icon type="ios-grid-view" style="font-size: 20px; vertical-align:sub; margin-left: 10px;"></Icon> Grid View
                            </li>
                          </ul>
                        </div>
                      </div>
                </Poptip> 

                <!--begin search panel-->
                <div class="search-mes-panel" :class="{searchPanel:isSearchPanelShow}" v-show="isSearchPanelShow">
                  <div class="search-mes-panel-top">
                      <span class="x right" @click="closeSearchPanel">
                        <i  class="fa fa-close"></i>
                      </span>
                  </div>
                  <div class="search-mes-input">
                    <span class="search-msg-icon left">
                      <i class="fa fa-search"></i>
                    </span>
                    <input type="text" class="left search-mes-input-bar" placeholder="Search">
                    <div class="clearfix"></div>
                  </div>
                  <div>
                    <Tree :data="baseData" :ref="'taskFolderTree'" @on-toggle-expand="toggleTaskFolder" @on-select-change="selectTaskFolder" style="padding-left:10px;"></Tree>
                  </div>
                </div>
                <!-- begin list by panel-->
              </div>
              <div class="boardsBackend"
                v-show="isBoardsBackend"
              ></div>
            </div>
            <div class="boards-title-right right">

            <Button-group v-show="this.TEST.curTestViewId==2">
              <Poptip class="setting-header-switch" title="Change card size" content="" placement="bottom-end" v-model="showCardSizePopTip">
                <Button type="ghost" icon="android-options" title="Change card size" style="border-top:none;border-bottom:none;"></Button>
                  <div class="po-header-switch-content" slot="content" >
                    <div class="setting">
                      <ul>
                        <li class="setting-item">
                          <div style="padding-left:10px;">
                            <Radio-group v-model="changeViewValue" vertical @on-change="changeCardSize">
                              <Radio label="Large Cards">
                                <span>Large Cards</span>
                              </Radio>
                              <Radio label="Medium Cards">
                                <span>Medium Cards</span>
                              </Radio>
                              <Radio label="Small Cards">
                                <span>Small Cards</span>
                              </Radio>
                            </Radio-group>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  </Poptip>    
              </Button-group>

              <Button-group>
                  <Poptip class="setting-header-switch" title="Setting" content="" placement="bottom-end" v-model="showSettingPopTip">
                    <Button type="ghost" icon="android-settings" title="Setting" style="border-top:none;border-bottom:none;"></Button>
                      <div class="po-header-switch-content" slot="content" >
                        <div class="setting">
                          <ul>
                            <li class="setting-item" style=" border-bottom: 1px solid #999999;">
                              <Icon type="ios-list-outline" style="font-size: 16px;"></Icon> 
                              <span style="padding-left:5px;padding-bottom: 5px;">List By</span>
                              <div style="padding-left:10px;">
                                <Radio-group v-model="ListByValue" vertical>
                                  <Radio label="StatusBy">
                                    <span>Status By </span>
                                  </Radio>
                                  <Radio label="PermutationBy">
                                    <span>Permutation By </span>
                                  </Radio>
                                </Radio-group>
                              </div>
                            </li>
                            <li class="setting-item">
                              <Icon type="ios-toggle-outline" style="font-size: 16px;"></Icon>
                              <span style="padding-left:5px">Group By</span>
                              <div style="padding-left:10px;">
                              <Radio-group v-model="GroupByValue" vertical>
                                <Radio v-for="item in GroupByItems" :key="item.name" :label="item.name">
                                  <span>{{ item.name}}</span>
                                </Radio>                               
                              </Radio-group>
                              </div>
                            </li>
                          </ul>
                          <div class="setting-btn">
                            <span class="btn-ok setting-btn" @click.stop="btnOkSetting">OK</span>
                            <span class="btn-reset setting-btn" @click.stop="btnNoSetting">Cancel</span>
                          </div>
                        </div>
                      </div>
                     </Poptip>    
              </Button-group>
               <Button-group>
                 <Button type="ghost" @click="fullScreen" icon="android-expand" title="Full Screen" style="border-top:none;border-bottom:none;"></Button>
               </Button-group>
              <div class="setting"  v-show="settingGroupShow">
                <ul>
                  <li class="setting-item" v-for="(item,$index) in GroupByItems"  @click="selectgroupby(this)" :key="$index">
                    <input type="checkbox"  v-model='selectedListIndex' :value="$index" >
                    <span class="item-status">{{item.name}}</span>
                  </li>
                </ul>
                <div class="setting-btn">
                  <span class="btn-ok setting-btn" @click.stop="btnOkListBy">OK</span>
                  <span class="btn-reset setting-btn" @click.stop="btnNoListBy">Cancel</span>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { mapState,mapMutations,mapActions} from 'vuex';
  export default {
     created (){
      this.initTree();
      this.initSetting();
      this.changeisTestRunTemplateView(false);
     // this.getTestTaskData(this.currentFolderID);
     },
     data: function() {
      return {
        baseData: [],
        box: [],
        end: '',
        isTransform: false,
        ListByItems: [
          { name: 'EV Permutation'},
          { name: 'Status'},
        ],
        GroupByItems: [
          { name: 'None'},
          { name: 'Owner'},
          { name: 'Template'},
          { name: 'Platform'},
          { name: 'Priority'},
          { name: 'Version'},
        ],
        GroupByOptions: [
          { name: 'None'},
          { name: 'Owner'},
        ],
        GroupByProject:[
          {name:'Status'},
          {name:'Permutations'}
        ],
        BoardColumns:[
          { name: 'PS3 + Chrome'},
          { name: 'PS3 + FireFox'},
          { name: 'IOS + Chrome'},
          { name: 'Windows 10 + IE'}
        ],
        isFilterShow: false,
        isSearchPanelShow: false,
        showtestRunPlanning: true,
        settingListShow: false,
        settingGroupShow: false,
        BoardColumnShow: false,
        selectedListIndex: 0,
        selectedColumnIndex: 0,
        showSettingPopTip: false,
        showCardSizePopTip: false,
        ListByValue: 'StatusBy',
        changeViewValue: 'Large Cards',
        GroupByValue: 'None',
        isTestTaskProject: true,
        productAndReleases: '',
        folders: '',
        folderList: '',
        projectSpace: '',
        projectSpaces: [],
        //taskProjectId: 3,
        currentFolderID: 0,
        showLeftGroupByOption: false,
        showGroupByProjectOption: false,
        showGroupBy: true,
        GroupByValueProject: '',      
      }
     },
    mounted(){
     // this.initUI();
      this.initTestRunView();
      this.initSetting();
    },
    methods: {
      initUI: function(){
        var height = window.innerHeight - 76;
        $('#test').css("height", height);
      },
      initTestRunView: function(e){
        this.showtestRunPlanning = true;
        //this.$router.push('/homepage/test/testrun');  
      },
      openSearchPanel: function(){
        this.isTransform = true;
        this.isSearchPanelShow=true;
        this.changeBoardsBackend(true);
        $(".search-mes").addClass("transform");
      },
      closeSearchPanel: function(){
        this.isSearchPanelShow=false;
        this.changeBoardsBackend(false);
        $(".search-mes").removeClass("transform");
      },
      openFilter: function(){
        this.isFilterShow = true;
        this.isBoardsBackend =true
      },
      closeFilter: function(){
        this.isFilterShow = false;
        this.isBoardsBackend = false
      },
      TestRunListShow(flag) {
        this.$store.commit({
          type:'switchTestRunList',
          TestRunList: flag
        })
      },
      changeTestIcon(flag) {
        this.$store.commit({
            type: 'changeTestIcon',
            showTestIcon: flag
        })
      },
      chooseListBy(){
        this.settingListShow = true;
        this.BoardColumnShow = false;
      },
      chooseGroupBy(){
        this.settingGroupShow = true;
        this.BoardColumnShow = false;
      },
      btnOkSetting(){
       this.showSettingPopTip = false;
       var _this = this;
      
        switch( this.GroupByValue ) {
          case 'None':
            _this.$router.push('/homepage/test/TestRun');
           // _this.changeTestRunList(false);
           // _this.changeListIcon(true);
           // _this.changeTestIcon(false);
           _this.changeisTestRunTemplateView(false);
            break;
          case 'Owner':
            _this.$router.push('/homepage/test/TestRunGroupBy');
           // _this.changeTestRunList(false);
           // _this.changeListIcon(true);
           // _this.changeTestIcon(false);
           _this.changeisTestRunTemplateView(false);
            break;
          case 'Template':
            _this.$router.push('/homepage/test/TestRunTemplate');
            _this.changeisTestRunTemplateView(true);
            break;
        };
      },
      btnNoSetting(){
        this.showSettingPopTip = false;
      },
      btnOkSettingLeft(){
        this.showLeftGroupByOption = false;
      },
      btnNoSettingLeft(){
        this.showLeftGroupByOption = false;
      },
      GroupByProjectClick(){
        this.showGroupByProjectOption = false;
      },
      chooseBoardColumn(){
        this.BoardColumnShow = true;
        this.settingListShow = false;
      },
      btnOkBoardColumn(){
        this.BoardColumnShow = false;
      },
      btnNoBoardColumn(){
        this.BoardColumnShow = false;
      },
      fullScreen() {// full Screen
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
          var wscript = new ActiveXObject("WScript.Shell");
          if (wscript != null) {
            alert("Please press F11");
            wscript.SendKeys("{F11}")
          }
        }
      },
      ClickSettingPopTip:function(){
        this.showSettingPopTip = true;
      },
      initTree:function(){
         var testSpaces = this.isTestTaskProject == true ? this.$store.state.linkedSpaces.testTaskSpaces:this.$store.state.linkedSpaces.testTemplateSpaces;
          this.baseData = [];
          if( testSpaces && testSpaces.length > 0){
            this.projectSpaces = [];
            for(var i = 0; i < testSpaces.length; ++i){
              this.TEST.taskProjectId = testSpaces[0].projectId;
              this.TEST.curTaskFolderId = testSpaces[0].spaceId;
              this.currentFolderID = testSpaces[i].spaceId;
              this.changeCurTaskFolderID(this.currentFolderID);
              this.projectSpace = testSpaces[0].spaceName;
              let user_token =sessionStorage.getItem('user_token');

              const SUB_PRO_URL = DevTestApi + (this.isTestTaskProject == true ? 'TestTask/FolderStructure': 'TestTemplate/FolderStructure');
              this.$http.post(SUB_PRO_URL,{
                  token: user_token,
                  projectId: this.TEST.taskProjectId,
                  folderId: this.currentFolderID,
                  folderPath: [""],
                  recursive: false,
              }).then(res=>{                
                 var childObjAry = [];
                 for(var i=0,len=res.body.Value.child.length; i<len; i++)
                 {
                    var childObj = {
                      expand: false,
                      title: res.body.Value.child[i].name,
                      folderid: res.body.Value.child[i].id,
                      children: [{}]
                    };
                    childObjAry.push(childObj);
                 }
                 var treeObj = {
                    expand: true,
                    title: res.body.Value.name,
                    folderid: res.body.Value.id,
                    children: childObjAry
                 };
                 this.baseData.push(treeObj);
                 this.baseData.sort();
              },err=>{
                console.log(err);
              });
            }
          }
       
      },
      initSetting:function(){
        this.changeTaskProjectID(this.TEST.taskProjectId);
        //this.changeCurrentTestViewId(1);
        let fieldIds = [1001,1101,1107,1109,1112,1019];
        let fields = [];
        let _this = this;
        let index = 0;
        for(let i = 0; i < fieldIds.length ; ++i){
          let user_token =sessionStorage.getItem('user_token');
          var STATUS_LIST = DevTestApi+'TestTask/Field?token='+user_token+'&ProjectId='+this.TEST.taskProjectId + '&FieldId=' + fieldIds[i];
          this.$http.get(STATUS_LIST).then( response =>{
           if( response.body.StatusCode == 0){
              if( fieldIds[i] == 1107)
                this.changeTestTaskColumns(response.body.Data);
              
              fields.push(response.body.Data);
              
              if( index == fieldIds.length - 1){
                this.changeTestTaskFields(fields);

                this.getTestTaskData(this.currentFolderID);
              }
              index ++;
           }
           else{
             console.log(response.body.Message);
           }
          }, error =>{
              console.log(error);
          });
         
        }        
          
      },
      updateGridView: function(){
        //this.$dispatch(‘foo’)
        for(var i=0, len=this.$children.length; i<len; i++)
        {
          if( typeof this.$children[i].initGrid == 'function')
            this.$children[i].initGrid();
        }
      },
      toggleTaskFolder: function(obj){
          let proId = this.TEST.taskProjectId;
          var subId=  obj.folderid;
          const SUB_PRO_URL = DevTestApi+ (this.isTestTaskProject == true ? 'TestTask/FolderStructure': 'TestTemplate/FolderStructure');
          let user_token =sessionStorage.getItem('user_token');
          var childrenObj = [];

          this.$http.post(SUB_PRO_URL,{
              token:user_token,
              projectId: proId,
              folderId: subId,
              folderPath: [""],
              recursive: false,
          }).then(res=>{
            if(res.body.Value.child != 'undefined')
            {
              for(var i=0, len = res.body.Value.child.length; i<len; i++)
              {
                var childObj = {
                  expand: false,
                  title: res.body.Value.child[i].name,
                  folderid: res.body.Value.child[i].id,
                  children: [{}]
                };
                childrenObj.push(childObj);
              }
            }
          },err=>{
              console.log(err);
          })

          obj.children = childrenObj;
      },
      selectTaskFolder: function(obj){
        this.projectSpace = obj[0].title;
        this.isSearchPanelShow=false;
        this.changeBoardsBackend(false);
        let folderID = obj[0].folderid;
        this.changeCurTaskFolderID(folderID);
        this.getTestTaskData(folderID);
        this.updateGridView();
      },
      changeCardSize: function(size){
        switch(size){
          case 'Large Cards': {
            $('.status-menu').width(220);
            $('.groupbycontent .container').width(220);
            $('.groupbycontent .action-card').width(188).height(68);
            $('.groupbycontent .card-box').height(73);
            $('.groupbycontent .action-card .card-meta, .groupbycontent .card-owner').show();
            this.TEST.headTop = 83;

            $('.po-test-side-list .card-properties, .po-test-side-list .bg-content').show();
            $('.wrapper-template .container .action-card').css('padding','5px 6px');
            $('.wrapper-template .card-meta').css('margin','5px 0 0 0');
            break;
          }
          case 'Medium Cards': {
            break;
          }
          case 'Small Cards': {
            $('.groupbycontent .action-card .card-meta, .groupbycontent .card-owner').hide();
            $('.status-menu').width(115);
            $('.groupbycontent .container').width(115);
            $('.groupbycontent .action-card').width(86).height(35);
            $('.groupbycontent .card-box').height(40);
            this.TEST.headTop = 50;

            $('.po-test-side-list .card-properties, .po-test-side-list .bg-content').hide();
            $('.wrapper-template .container .action-card').css('padding','0');
            $('.wrapper-template .card-meta').css('margin','0');
            break;
          }
        }
        this.showCardSizePopTip = false;
      },
      changeTaskProjectID(flag) {
        this.$store.commit({
            type: 'changeTaskProjectId',
            taskProjectId: flag
        })
      },
      changeCurTaskFolderID(flag) {
        this.$store.commit({
            type: 'changeCurTaskFolderId',
            curTaskFolderId: flag
        })
      },
      changeTestTaskColumns(flag) {
        this.$store.commit({
            type: 'changeTestTaskColumns',
            testTaskColumns: flag
        })
      },
      changeTestTaskFields(flag) {
        this.$store.commit({
            type: 'changeTestTaskFields',
            testTaskFields: flag
        })
      },
      changeTestTaskData(flag) {
        this.$store.commit({
            type: 'changeTestTaskData',
            testTaskData: flag
        })
      },
      changeisTestRunTemplateView(flag) {
        this.$store.commit({
            type: 'changeisTestRunTemplateView',
            isTestRunTemplateView: flag
        })
      },
      changeCurrentTestViewId(flag) {
        this.$store.commit({
            type: 'changeCurrentTestViewId',
            curTestViewId: flag
        })
        switch(flag){
          case 1: this.$router.push('/homepage/test/testrun');
            break;
          case 2: this.$router.push('/homepage/test/TestRunTemplate');
            break;
        }
        //handle poptip click auto collapse trick
        if($('.ivu-poptip-popper:visible').length > 0)
        {
          $('.ivu-poptip-popper').css('display','none');
          $('.tool').click();
        }
      },
      getFieldName:function(fieldID){
        let i = 0;
        let fieldName = "";
        for(; i < this.TEST.testTaskFields.length; ++i){
          if( this.TEST.testTaskFields[i].id == fieldID){
            fieldName = this.TEST.testTaskFields[i].name;
            break;
          }
        }
        return fieldName;
      },
      getTestTaskData:function(folderID){
        let resultData = [];
        let fields = [];
        let folderPath = [];
        folderID = "" + folderID;
        folderPath.push(folderID);
         //get field array. order: ID, Title, Status,Owner.
        let fieldName = this.getFieldName(1001);//ID
        if( typeof(fieldName) != "undefinded" && fieldName)
          fields.push(fieldName);
        fieldName = this.getFieldName(1101);//Title
        if( typeof(fieldName) != "undefinded" && fieldName)
          fields.push(fieldName);
        fieldName = this.getFieldName(1107);//Status
        if( typeof(fieldName) != "undefinded" && fieldName)
          fields.push(fieldName);
        fieldName = this.getFieldName(1109);//Owner
        if( typeof(fieldName) != "undefinded" && fieldName)
          fields.push(fieldName);
        fieldName = this.getFieldName(1112);//Environment
        if( typeof(fieldName) != "undefinded" && fieldName)
          fields.push(fieldName);
        fieldName = this.getFieldName(1019);//Template ID 
        if( typeof(fieldName) != "undefinded" && fieldName)
          fields.push(fieldName);
          

        let data = this.TEST.testTaskColumns.choices; // get from vuex state
        let StatusCount = data.length;
        let statusName = this.TEST.testTaskColumns.name;

        if(StatusCount <= 0 || statusName.length <= 0){
          console.log("can't get fields from DevTest API, please check it.");
          return;
        }
        let index = 0;
        data.forEach(status => {
          let obj = {
            "ChoiceName": status,
            "children": [],
            "number": " ",
            "count": 0
          }
        //get each status' tasks
        // this.TEST.spinShow = true;
        this.changeTestLoading(true)
        let testQueryURL = DevTestApi + 'TestTask/Query';
        let user_token =sessionStorage.getItem('user_token');
        this.$http.post(testQueryURL,{
            "token": user_token,
            "projectId": this.TEST.taskProjectId,
            "names": fields,
            "folderPath": folderPath,
            "showAll": true,
            "includeArchived":true,
            "pageSize": 15,
            "pageIndex": 0,
            "getCount": true,
            "query": [{ name:statusName, op: '=', choices: [status]}]            
            },{emulateJSON : true})
        .then( response =>{
           if( response.body.StatusCode == 0){
              let tasks=response.body.Values;
              tasks.forEach(tasksData => {
                let childrenObj = {
                      "taskId": tasksData[fields[0]],
                      "message": "",
                      "success": true,
                      "values": {
                                  "status": tasksData[fields[2]],
                                  "title": tasksData[fields[1]],
                                  "assigned": tasksData[fields[3]],
                      }
                    }
                obj.children.push(childrenObj);
                
              })
              obj.number = obj.children.length;//status number
              obj.count = response.body.Count;// task count
              resultData.push(obj);
              if( index == StatusCount - 1){
                this.setStatusOrder(resultData);
              }
              index ++;
              this.changeTestLoading(false)
           }
           else{
             console.log(response.body.Message);
           }
          },error =>{
             console.log(error);
          })
        })
      },
      arraySwap: function(input, index_A, index_B) {
          var temp = input[index_A];
      
          input[index_A] = input[index_B];
          input[index_B] = temp;
      },
      getStatusOrder: function(){
        var aryStatus = [
          "In progress",
          "Blocked",
          "Did not run",
          "Fail",
          "Pass"
        ];
        return aryStatus;
      },
      setStatusOrder: function(aryTaskData){
        var curStatusOrder = this.getStatusOrder();
        for(var i=0; i< curStatusOrder.length; i++)
        {
          for(var j=i; j<aryTaskData.length; j++)
          {
            if((aryTaskData[j].ChoiceName == curStatusOrder[i]) && (i != j))
            {
              this.arraySwap(aryTaskData,i,j);
              break;
            }
          }
        }
        this.changeTestTaskData(aryTaskData);
      },
      switchTestRunListPanel() {
        var curWidth = $('.wrapper').width();
        if (this.showTestRunList == false) {
           this.switchTestRunList({TestRunList:true});
          $('.wrapper').width(curWidth-350);
         }else {
          this.switchTestRunList({TestRunList:false});
         $('.wrapper').width(curWidth+350);
         }
      },
      ...mapMutations(['changeTestLoading','changeBoardsBackend','switchTestRunList']),
      ...mapActions([''])
    },
    computed: mapState(['isBoardsBackend','showTestRunList','showEditPanel','linkedSpaces','TEST']),
    watch:{
      linkedSpaces: function(){
        this.initTree();
        this.initSetting();
        this.changeisTestRunTemplateView(false);
      }
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
  @import './test.scss';
  @import '../testrun/testRunPlanning.scss';
   @import '../../../static/grid_media.css';
</style>

