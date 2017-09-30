<template>
    <div id="development">
        <div class="boards-container">
            <div class="boards-title-left left">
              <div class="title-bread">
                <p class='left title-common path' 
                   :class="[DEV.currentPathInfo.sprintState>=0 ? 'pathicon'+DEV.currentPathInfo.subprojectType : 'pathiconpast'+DEV.currentPathInfo.subprojectType]" 
                   @click.stop='clickPathIcon'>
                    <span v-if='!parentTxt && !childTxt' :title='DEV.currentPathInfo.subprojectName' class='projectSpaceIcon' >{{DEV.currentPathInfo.subprojectName}}</span>
                    <!--<span v-if='parentTxt'>{{parentTxt}}</span>
                    <span v-if='childTxt'>/{{childTxt}}</span>-->
                </p>
                <div class="search-mes left title-common"
                      style="margin-left: 0;"
                     @click="openSearchPanel">
                  <i class="fa fa-caret-up"></i>
                </div>
                <div style="margin-left: 20px;font-size: 20px;cursor:pointer;" 
                    class='listIcon-box left' 
                    v-show='showListIcon'
                    title="show backlog"
                    @click='switchBackLogs'>
                    <span class='listIcon'>
                      <Icon type="navicon-round"/>
                    </span>
                </div>
                <!--search panel-->
                <transition name="searchPanel" mode="out-in" appear>
                  <div
                  class="search-mes-panel"
                  v-show="DEV.isSearchPanelShow"
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
                    <input type="text" ref="search" v-model="searchValue" class="left search-mes-input-bar" placeholder="Search" @keyup="querySprint($event)">
                    <div class="clearfix"></div>
                  </div>
                  <div class="mes-panel-list">
                    <ul v-for="menuItem in folder">
                      <tree :model="menuItem"></tree>
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
                      <span class="x right" @click="closeFilter">
                        <i  class="fa fa-close"></i>
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
                                    <span>Status Group</span>
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
       <Spin fix size="large" v-if="DEV.loading">
        <Icon type="load-c" size=70 class="demo-spin-icon-load"></Icon>
        <div style="font-size: 24px;color:#eee;">Loading...</div>
        </Spin>        
    </div>
</template>

<script>
    import tree from '../common/folder/Folder.vue';
    import {mapState,mapActions,mapMutations} from 'vuex'
    export default {
      created() {
         this.initPath();
         var queryObj = this.$route.query;
         this.tree(queryObj);
      },
      mounted(){
        this.getStatusList();
      },
      data: function() {
          return {
            rootData:[],
            pathIconType: '',
            parentTxt: '',
            childTxt: '',
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
            showSettingPopTip:false,
            ListByValue: 'StatusBy',
            GroupByValue: 'None',
            showProjectList: true,
            pathIconType: '',
            sprints: [],
            folders: [],
            searchValue:'',
            folderTree:[]
          }
      },
      computed: {
          ...mapState(['DEV','selectContent','isSearchPanelShow','folder','backLogId','projectId','subProjectId','showBackLogList','showListIcon','selectContent','projectId','subProjectId','subProjectType','isBoardsBackend']),
          pathIcon() {
            if ((this.parentTxt == '') && (this.childTxt =='')) {
              return this.$store.state.subProjectType;
            }else {
              return this.pathIconType;
            }
          }
      },
      methods: {
        initPath(){
          var routerParam = this.$route.query;
          var pathObj = {
            sprintState:'',
            subprojectId:'',
            subprojectName:'',
            subprojectType:''
          }
          var queryObj = {"ProjectId":routerParam.subProjectId,"PrefIds": [3000044,3000045]};
          this.changeIds(routerParam);
          this.axios.post(GET_HISTORY_INFO,queryObj).then(res=>{
            if(res.data.Data.length>0) {
                pathObj.subprojectId= res.data.Data[0].PreferenceValue;
                pathObj.subprojectName= res.data.Data[0].PreferenceText;
                pathObj.subprojectType= res.data.Data[1].PreferenceText;
                pathObj.sprintState= res.data.Data[1].PreferenceValue;
                //console.log(pathObj);
            }else {
              // no choose child node
                pathObj.subprojectId= routerParam.subProjectId;
                pathObj.subprojectName= this.selectContent;
                pathObj.subprojectType= '98';
                pathObj.sprintState= 0;
                console.log(pathObj)
            }

            this.changeCurPath(pathObj);
          },err=>{
            console.log(err)
          })
        },
        tree(queryObj){
          this.getFolderTree([]);
          this.changeListIcon({showListIcon:false});
          var tree = DevTrackApi +'/SubProject/GetTree';
          var nodesParam = {
            "IncludeClosed": false,
            "SubProjectId": queryObj.subProjectId,
            "ProjectId": queryObj.projectId
          };
         // console.log(nodesParam)
        this.axios.post(tree,nodesParam).then(res=>{
            var childObjAry = [];
             if(res.data.Success){ 
              var nodesList = res.data.Data.nodes;
              if(nodesList.length>0) {
               // console.log(nodesList);
                for(let i=0 ; i<nodesList.length;i++){
                  if(nodesList[i].subprojectType == '2002'){
                        this.changeBackLogId({backLogId:nodesList[i].subprojectId});
                        this.changeListIcon({showListIcon:true})
                      }
                  var childObj = {
                    "projectId": nodesList[i].projectId,
                    "subprojectId": nodesList[i].subprojectId,
                    "subprojectName": nodesList[i].subprojectName,
                    "subprojectType": nodesList[i].subprojectType,
                    "sprintState":nodesList[i].sprintState,
                    "isClosed": nodesList[i].isClosed,
                    "hasChild": nodesList[i].hasChild,
                    "nodes":[]
                  };
                  //console.log(childObj);
                  childObjAry.push(childObj);
                }
                var treeObj = {
                    "projectId": queryObj.projectId,
                    "subprojectId": res.data.Data.subprojectId,
                    "subprojectName": res.data.Data.subprojectName,
                    "subprojectType": res.data.Data.subprojectType,
                    "sprintState":res.data.Data.sprintState,
                    "isClosed": res.data.Data.isClosed,
                    "hasChild": res.data.Data.hasChild,
                    "nodes":childObjAry
                };
                this.folderTree.push(treeObj);
                this.folderTree.sort();
                this.getFolderTree(this.folderTree);
                //console.log(this.folderTree)
              }else {

              }
            }
        },err=>{
            console.log(err)
        })

      },
        clickPathIcon(){
          this.isTransform = true;
          // this.isSearchPanelShow = true;
          this.changeSearchPanelShow(true)
         this.changeBoardsBackend(true);
          $(".search-mes").addClass("transform");
        },
        openSearchPanel(e){
            this.isTransform = true;
            this.changeSearchPanelShow(true);
            this.changeBoardsBackend(true);
            $(".search-mes").addClass("transform");
            e.stopPropagation();
        },
        closeSearchPanel(e){
            this.changeSearchPanelShow(false);
            this.changeBoardsBackend(false);
            $(".search-mes").removeClass("transform");
            e.stopPropagation();
        },
        openFilter(){
            this.isFilterShow = true;
            this.changeBoardsBackend(true)
        },
        closeFilter(){
            this.isFilterShow = false;
            this.changeBoardsBackend(false)
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
        showSearchPanel(e) {
            e.stopPropagation();
        },
        switchBackLogs() {
          if (this.showBackLogList == false) {
            this.switchBackLog({backLoglist:true});
            var proid = this.projectId;
            var subid = this.backLogId;
            this.getBackLoglist(proid,subid);
          }else {
            this.switchBackLog({backLoglist:false})
          }
        },
        getBackLoglist(proId,subId) {
            let _this = this;
            let projectId = proId;
            let subProjectId = subId;
            let tempList=[ ];
            const TASK_URL = DevTrackApi+'task/Query';
            this.axios.post(TASK_URL,{
              "ShowAll": true,
              "GetCount": true,
              "Condition": {
                "Subproject": {
                  "SubIds": [subProjectId],
                  "IncludeChildren": true,
                  "IncludeClosed": false,
                  "IncludeBacklog": true
                }
              },
              "ProjectId":projectId,
              "FieldIds": [
                101
              ]
            },).then( response =>{
            var backLogList = response.data.Data.tasks;
            let _this = this;
            $.each(backLogList,function(index,value){
                var values = value['values'];
                let title= values[0].value;
                tempList.push(title);
            })
            this.addBackLogList(tempList);
            },error =>{
              console.log(error);
              })
        },
        querySprint(e){
          let searchValue = this.searchValue ;
          let filter = searchValue.toUpperCase();
          let nodes = $('.node .folder-toggle');
          for (let i=0; i<nodes.length; i++) {
            var nodeName = nodes[i].getElementsByTagName('p')[0].innerHTML.trim();
            if ( nodeName.toUpperCase().indexOf(filter) > -1) {
                nodes[i].parentNode.style.display = ""; 
            }else {
                nodes[i].parentNode.style.display = "none"; 
            }
          }
        },
        ...mapMutations(['getFolderTree','changeSearchPanelShow','addBackLogList','switchBackLog','backLogListShow','changeListIcon','changeBackLogId','addAllTasks','changeSecondLevel','changeThirdLevel','changeIds','changeBoardsBackend','changeCurPath']),
        ...mapActions(['getStatusList'])
        },
        
      components: {
        tree
      },
      watch:{
        
      }
    }
</script>

<style lang="scss" scoped="" type="text/css">
  @import 'Development.scss';
</style>