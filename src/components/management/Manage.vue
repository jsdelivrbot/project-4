<template>
    <div id="management">
        <div class="boards-container">
            <div class="boards-title-left left">
              <div class="title-bread">
                <p class='left title-common path' :class="'pathicon'+pathIcon" @click.stop='clickPathIcon'>
                    <span v-if='!parentTxt && !childTxt' :title='selectContent' class='projectSpaceIcon' >{{selectContent}}</span>
                    <span v-if='parentTxt'>{{parentTxt}}</span>
                    <span v-if='childTxt'>/{{childTxt}}</span>
                </p>
                <div class="search-mes left title-common"
                      style="margin-left: 0;"
                     @click="openSearchPanel">
                  <i class="fa fa-caret-up"></i>
                </div>
                <div style="margin-left: 20px;font-size: 20px;cursor:pointer;" 
                    class='listIcon-box left' 
                    v-show='true'
                    title="show backlog"
                    @click='switchBackLogs'>
                    <!--v-show='showListIcon'-->
                    <span class='listIcon'>
                      <Icon type="navicon-round"/>
                    </span>
                </div>
                <!--search panel-->
                <transition name="searchPanel" mode="out-in" appear>
                  <div
                  class="search-mes-panel"
                  v-show="MANAGE.isSearchPanelShow"
                  @click='showSearchPanel($event)'
                  >
                  <div class="search-mes-panel-top">
                      <span class="x right" @click="closeSearchPanel($event)">
                        <i  class="fa fa-close"></i>
                      </span>
                  </div>
                  <div class="search-mes-input">
                    <span class="search-msg-icon left">
                      <i class="fa fa-search"></i>
                    </span>
                    <input type="text" ref="search" class="left search-mes-input-bar" placeholder="Search" @keyup="query($event)">
                    <div class="clearfix"></div>
                  </div>
                  <div class="mes-panel-list">
                      <ul v-for="menuItem in MANAGE.manageFolder">
                        <v-tree :model="menuItem"></v-tree>
                      </ul>
                  </div>
                </div>
                </transition>
                <div class="filter left title-common">
                  <transition name="filterPanel" mode="out-in" appear>
                    <div
                      class="filter-select"
                      :class="{filterPanelShow:isFilterShow}"
                      v-show="isFilterShow"
                    >
                      <div class="filter-top">
                      <span class="filter-top-text left">
                        Filter Tasks
                      </span>
                      </div>
                      <ul class="filter-by">
                        <li v-for="item in filterByItems"
                            class="filter-by-item"
                            :class="item.icon">
                          <a href="javascript:;" :class=item.icon>
                            {{item.name}}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>
              </div>
              <div
                class="boardsBackend"
                v-show="isBoardsBackend"
              ></div>
           </div>
            <!--filter by month fullScreen-->
            <div class="boards-title-right right">
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
                                    <span>Status</span>
                                  </Radio>
                                  <Radio label="group">
                                    <span>Group</span>
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
            </div>
            <div class="clearfix"></div>
        </div>
        <router-view></router-view>
        <Spin fix size="large" v-if="MANAGE.loading">
        <Icon type="load-c" size=70 class="demo-spin-icon-load"></Icon>
        <div style="font-size: 24px;color:#eee;">Loading...</div>
        </Spin>         
    </div>
</template>
<script>
import vTree from './tree/VTree';
import {mapState,mapActions,mapMutations} from 'vuex'
export default {
  created() {
      this.initTree();
      this.getLinkSpaceIds()
      this.getManageStatusList();
      this.getManagementTasks();
      
     
  },
  data: function() {
    return {
      rootNode:[],
      tempQuery:{},
      showSettingPopTip:false,
      pathIconType: '',
      parentTxt: '',
      childTxt: '',
      //isSearchPanelShow: false,
      isFilterShow: false,
      filterByItems: [
          { name: 'Followed by',icon:'followby'},
          { name: 'Assigned by',icon:'assigned'},
          { name: 'Due date',icon:'duedate'},
          { name: 'Tags',icon:'tags'},
          { name: 'Status by',icon:'statusby'}
      ],
      GroupByItems: [
        { name: 'None'},
        { name: 'Owner'}
      ],
      ListByValue: 'StatusBy',
      GroupByValue: 'None',
      showProjectList: true,
      pathIconType: '',
      sprints: [],
      folders: [],
    }
  },
  computed: {
      ...mapState(['MANAGE','linkedSpaces','userInfo','linkedSpaces','backLogId','projectId','subProjectId','showBackLogList','showListIcon','selectContent','projectId','subProjectId','subProjectType','isBoardsBackend']),
      pathIcon() {
        if ((this.parentTxt == '') && (this.childTxt =='')) {
          return this.$store.state.subProjectType;
        }else {
          return this.pathIconType;
        }
      }
  },
  mounted(){
    //console.log(this.rootNode[0])
  },
  methods: {
    initTree(){
     // console.log(this.linkedSpaces)
      let project,linkedSpacesObj = this.linkedSpaces;
      for(let item in linkedSpacesObj) {
        if(item == 'PPMSpaces'){
          project = linkedSpacesObj['PPMSpaces'];
          break;
        }
      }
      for(let i=0;i<project.length;i++){
        let mProjectId = project[i].projectId;
        let mSpaceId = project[i].spaceId;
        this.changeManageInfo({projectId:project[i].projectId,projectType:'',spaceName:"",subProjectId:''})
        let param = {
          "IncludeClosed": true,
          "SubProjectId": mSpaceId,
          "ProjectId": mProjectId,
        };
        const GET_MANAGE_TREE = DevTrackApi+'SubProject/GetTree';
        this.axios.post(GET_MANAGE_TREE,param).then(res=>{
          if(res.data.Success) {
              let nodesList = res.data.Data.nodes;
              let childObjAry = [];
              if(nodesList.length>0){
                for(let j=0;j<nodesList.length;j++) {
                  let childObj = {
                      "projectId": nodesList[j].projectId,
                      "subprojectId": nodesList[j].subprojectId,
                      "subprojectName": nodesList[j].subprojectName,
                      "subprojectType": nodesList[j].subprojectType,
                      "sprintState":nodesList[j].sprintState,
                      "isClosed": nodesList[j].isClosed,
                      "hasChild": nodesList[j].hasChild,
                      "nodes":[]
                  };
                  childObjAry.push(childObj);
                }
                var treeObj = {
                    "projectId": res.data.Data.projectId,
                    "subprojectId": res.data.Data.subprojectId,
                    "subprojectName": res.data.Data.subprojectName,
                    "subprojectType": res.data.Data.subprojectType,
                    "sprintState":res.data.Data.sprintState,
                    "isClosed": res.data.Data.isClosed,
                    "hasChild": res.data.Data.hasChild,
                    "nodes":childObjAry
                };
                this.rootNode.push(treeObj);
                this.rootNode.sort();
                //console.log(this.rootNode)
                this.changeManageFolder(this.rootNode);
              }
          }else {
            console.log("the http response false data")
          }
        },err=>{
          console.log(err)
        })
      }
      
      
      let queryObj = this.$route.query;
      this.changeIds({projectId:queryObj.projectId,subProjectId:queryObj.subProjectId})
      //console.log(this.rootNode['0'])

    },
    getLinkSpaceIds(){
        console.log(this.linkedSpaces)
        let linkSpaceIds = this.linkedSpaces.PPMSpaces[0];
        var manageObj ={
            projectId:'',
            subProjectId:'',
            projectType:'',
            spaceName:''
        }
        for(let val in linkSpaceIds){
            switch(val){
                case 'projectId':
                manageObj.projectId=linkSpaceIds[val];
                break;
                case 'projectType':
                manageObj.projectType=linkSpaceIds[val];
                break;
                case 'spaceId':
                manageObj.subProjectId=linkSpaceIds[val];
                break;
                case 'spaceName':
                manageObj.spaceName=linkSpaceIds[val];
                break;
            }
        }
        this.changeManageInfo(manageObj);
       
    },
    clickPathIcon(){
      this.isTransform = true;
      this.changeManageSearchPanel(true);
      this.changeBoardsBackend(true);
      $(".search-mes").addClass("transform");
    },
    openSearchPanel(e){
        this.isTransform = true;
        this.changeManageSearchPanel(true);
          this.changeBoardsBackend(true);
        $(".search-mes").addClass("transform");
        e.stopPropagation();
    },
    closeSearchPanel(e){
        this.changeManageSearchPanel(false);
        this.changeBoardsBackend(false);
        $(".search-mes").removeClass("transform");
        e.stopPropagation();
    },
    fullScreen() {
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
    btnOkSetting(){
        this.showSettingPopTip = false;
        var _this = this;
        switch( this.GroupByValue ) {
        case 'None':
        _this.$router.push('/homepage/development/boards');
        break;
        case 'Owner':
        _this.$router.push('/homepage/development/groupBy');
        break;
        };
    },
    btnNoSetting(){
        this.showSettingPopTip = false;
    },
    projectSpaceSwitch(event){
        this.parentTxt =false;
        this.childTxt =false;
        var projectSpaceTxt = $(event.currentTarget).text().trim();
        
        this.showTaskInfo(this.projectId,this.subProjectId);
        this.changeManageSearchPanel(false);
        this.isBoardsBackend = false;
        $(".search-mes").removeClass("transform");
    },
    showSearchPanel(e) {
        e.stopPropagation();
    },
    switchBackLogs() {
      if (this.showBackLogList == false) {
        this.switchBackLog({backLoglist:true});
        var proid = this.managementInfo.projectId;
        var subid = this.managementInfo.subProjectId;
        this.getBackLoglist(proid,subid);
      }else {
        this.switchBackLog({backLoglist:false})
      }
    },
    getBackLoglist(proId,subId) {
        let projectId = proId;
        let subProjectId = subId;
        let tempList=[ ];
        const TASK_URL = DevTrackApi+'task/Query';
      this.$http.post(TASK_URL,{
          "token": APIToken,
          "projectId": projectId,
          "showAll": false,
          "pageSize": 50,
          "pageIndex": 0,
          "getCount": false,
          "sortby": { "fieldId": 101, "order": "asc" },
          "fields": [601,101,102,103,104,105,106,107,108,201,202,305],
          "languageId": 0,
          query: {
          relation: 'and',
          condition: [
            { subProject: {valueIds:[subProjectId],includeChildren:true} }
            ]
          }
      }).then( response =>{
        console.log(response)
        var backLogList = response.body.tasks;
        let _this = this;
      $.each(backLogList,function(index,value){
          var values = value['values'];
          let title= values[1].value;
          tempList.push(title);
      })
      this.addBackLogList(tempList);
      },error =>{
        console.log(error);
        })
    },

    ...mapMutations(['changeManageSearchPanel','changeManageFolder','changeManageInfo','changeIds','addManageMentStatus','changeManageTasks','addBackLogList','switchBackLog','backLogListShow','changeListIcon','changeBackLogId','addAllTasks','changeSecondLevel','changeThirdLevel','changeIds','changeBoardsBackend']),
    ...mapActions(['getManageStatusList','getManagementTasks'])
    },
  components: {
    vTree
  },
  watch:{
    linkedSpaces: function(){
      this.initTree();
      this.getManageStatusList();
      this.$nextTick(function(){
        this.getManagementTasks();
        console.log("rtewet")
      })
      
    }
  }
}
</script>
<!--changeManageSearchPanel-->
<style lang="scss" scoped="" type="text/css">
  @import 'manage.scss';
</style>