<template>
    <div id="requirement">
        <div class="boards-container">
            <div class="boards-title-left left">
              <div class="title-bread">
                <p class='left title-common path' 
                   @click.stop='clickPathIcon'>
                    <span v-if='!parentTxt && !childTxt' :title='selectContent' class='projectSpaceIcon' >{{this.$store.state.selectContent}}</span>
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
                    <input type="text" ref="search" class="left search-mes-input-bar" placeholder="Search" @keyup="query($event)">
                    <div class="clearfix"></div>
                  </div>
                  <div class="mes-panel-list">
                    <ul v-for="menuItem in treeData">
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
                          <a href="javascript:;" :class="item.icon">
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

    <div class="list" style="{height:listHeight + 'px'}">
      <div class="panegutter"></div>
      <div class="listpart">
        <div class="toolbar">
          <button id="button-new-task"
                  type="button"
                  class="button-default button-small"
                  style="margin:1em; margin-left:2em;"
                  v-on:click="addItem">
            Add Template
          </button>

        </div>
        <table class="table-hover">
          <tbody id="list-tbody">
            <tr v-for="(item, $index) in DevSpec.reqList" :key="$index"
                 :class="{'active': $index == selectedIndex}"
                 @click="taskDetailClick($index,item)"
            >
              <td class="drag-handler" title="click to draga and sort">
                <span class="drag-handler-icon"></span>
              </td>
              <td class="complete-icon">
                <span class="icon-checkmark">&nbsp;ID:{{item.ID}}</span>
              </td>
              <td class="item-detail" 
                  >
                <div class="item-detail-div">
                    <textarea 
                              tabindex="-1" v-model="item.Title" ref="textarea"></textarea>
                  <div class="item-other-info">
                    <!--<span class="item-tag" v-for="tag in item.tags" :key="tag">{{tag}}</span>-->
                    <!--<span class="item-due-day" v-if="item.dueday">{{item.dueday}}</span>-->
                    <!--<span class="item-due-day"><i class="icon-person"></i>{{item['Spec Owner']}}</span>
                    <span class="item-due-day">{{item['Status']}}</span>-->
                    <Button type="info" size="small" icon="person" class="btn-owner">{{item['Spec Owner']}}</Button>
                    <Button v-if="item.Status === 'Released'" type="error"  size="small" icon="android-options" class="btn-status">{{item['Status']}}</Button>
                    <Button v-else type="success" size="small" icon="android-options" class="btn-status">{{item['Status']}}</Button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="detailpart" id="list-detailpart" >
        <edit-list v-show:editPanelShow="true"
                    :currentCardInfo="currentItem"
                    @closeEditPanel="showDetailPart(true)">
        </edit-list>
      </div>
      <div class="panegutter"></div>
    </div>
  </div>
</template>

<script>
    //import Tree from '../common/folder/Folder.vue';
    import Vue from 'vue';
    import {mapState,mapActions,mapMutations} from 'vuex'
    import Sortable from 'sortablejs'
    import editList from '../common/editList/EditList';

    //var newIndex = -1;

    import tree from './tree/Tree';
    export default {
      created() {
        window.onresize = function(event) {
         var window_h = $(window).innerHeight();
          var toor_h = $(".tools").height();
          var boardContainer_h = $(".boards-container").height();
          $(".list").height(window_h - toor_h - boardContainer_h );
        };

        var zReqList = sessionStorage.getItem("z-reqList");
        if(zReqList){
         this.getReqList(JSON.parse(zReqList));
          //console.log(this.DevSpec.reqList);
          //this.showDetailPart(true);
          console.log("created && storage");
        }else{
          this.queryReqList();
          //console.log(2);
          console.log("new created")
        }

        this.specTree();
      },
      mounted(){
        var window_h = $(window).innerHeight();
        var toor_h = $(".tools").height();  
        var boardContainer_h = $(".boards-container").height();
        $(".list").height(window_h - toor_h - boardContainer_h );

        this.$nextTick(function(){
          Sortable.create(document.getElementById('list-tbody'), {
            handle:".drag-handler",
            chosenClass: "drag-chosen",
            ghostClass: "drag-ghost",
            dragClass: "listsort-drag",
            onStart: function (evt) {
              //console.log(evt.oldIndex);
            },
            onEnd: function (evt) {
              //console.log(evt.oldIndex);
              //console.log(evt.newIndex);
            }
          });
        });

        //refresh page && gain the history data
        var zReqList = sessionStorage.getItem("z-reqList");
        if(zReqList){
          this.getReqList(JSON.parse(zReqList));
          console.log("mounted");
        }
        var zSelectedIndex = sessionStorage.getItem("z-selectedIndex");
        if(zSelectedIndex){
            this.selectedIndex  = zSelectedIndex;
        }
        var zCurrentItem = sessionStorage.getItem("z-currentItem");
        if(zCurrentItem){
            this.currentItem  = JSON.parse(zCurrentItem);
        }
      },
      data: function() {
          return {
            stateType:"",
            selectedIndex:-1,
            newIndex:-1,
            treeData:[],
            //reqListData:[],
            currentItem: [],
            //pathIconType: '',
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
            //sprints: [],
            //folders: [],
            //reqList params
            //itemID:"",
            //ProjectID:""
            }
      },
      computed: {
          ...mapState(['DevSpec','linkedSpaces','DEV','isSearchPanelShow','folder','backLogId','projectId','subProjectId','showBackLogList','showListIcon','selectContent','projectId','subProjectId','subProjectType','isBoardsBackend']),
          // pathIcon() {
          //   if ((this.parentTxt == '') && (this.childTxt =='')) {
          //     return this.$store.state.subProjectType;
          //   }else {
          //     return this.pathIconType;
          //   }
          // },
      },
      methods: {
        clearStorage(){
          this.selectedIndex = -1;
        },
        specTree(){
          //tree
          var treeFolder = this.$store.state.linkedSpaces.requirementSpaces;
          if(treeFolder && treeFolder.length > 0){
              this.treeData = [];
              var nodesArr = [];
              var _this = this;
              $.each(treeFolder,function(i,item){
                var projectId = item.projectId;
                var spaceId = item.spaceId;

                var firNodes = {
                  //"ProjectID":projectId,
                  "FolderID":spaceId,
                  "FolderName":item.spaceName,
                  "FolderStatus":"",
                  "isFistLevel":true,
                  "FolderNodes":[]
                }

                //query for subTreeFolder
                const SpecTreeChild= DevSpecApi + 'ReqFolderChild';
                const Params = {
                  "ProjectID":projectId,
                  "FolderID":spaceId,
                  "ShowAll":0
                }
                _this.axios.post(SpecTreeChild,Params).then(res=>{
                if(res.status == 200){
                  var resData = res.data.FolderNodes;
                  firNodes.FolderNodes = resData;
                  }
              },err=>{
                  console.log(err);
                })
                nodesArr.push(firNodes);
              })
              this.treeData = nodesArr;
          }
          
        },
        queryReqList(){
          // query default reqList
          var reqSpace = this.$store.state.linkedSpaces.requirementSpaces;
          if(reqSpace && reqSpace.length > 0){
              var treeFolder = reqSpace[0];
              var projectId = treeFolder.projectId;
              var spaceId = treeFolder.spaceId;

              var params = {
                "ProjectID":projectId,
                "FolderID":spaceId,
                "ShowAll":1,
                "PageIndex":0,
                "Fields":["ProjectID","ID","Title","Status","Spec Owner","Date Last Modified"]
              }

              //query for subTreeFolder
              const Post_ItemList= DevSpecApi + 'ReqItemList';

              this.axios.post(Post_ItemList,params).then(res=>{
              if(res.status == 200){
                  var listData = res.data.ListItems;
                  this.getReqList(listData);
                  setTimeout(function(){
                    sessionStorage.setItem("z-reqList",JSON.stringify(listData));
                  },3000)
                }
              },err=>{
                console.log(err);
              })
          }
          
        },
        
        taskDetailClick(index,item) {
          this.currentItem = item;
          this.showDetailPart();
          this.selectedIndex = index;
          sessionStorage.setItem("z-selectedIndex",index);
          sessionStorage.setItem("z-currentItem",JSON.stringify(this.currentItem));
          //console.log(item);
        },
        addItem() {
          var newitem = {"Title":" "};
          if (this.selectedIndex < this.DevSpec.reqList.length && this.selectedIndex > -1) {
            this.newIndex = this.selectedIndex + 1;
            this.DevSpec.reqList.splice(this.selectedIndex + 1, 0, newitem);
          }
          else {
            this.newIndex = this.DevSpec.reqList.length;
            this.DevSpec.reqList.push(newitem);
          }
          this.currentItem = this.DevSpec.reqList[this.newIndex];
        },
        showDetailPart(hide) {
          if (hide) {
            $("#list-detailpart").hide();
          }
          else {
            $("#list-detailpart").show();
          }
        },
        clickPathIcon(){

           // console.log(JSON.stringify(this.DevSpec.treeFolder))
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
        ...mapMutations(['getReqList','linkedSpaces','changeSearchPanelShow','addBackLogList','switchBackLog','backLogListShow','changeListIcon','changeBackLogId','addAllTasks','changeSecondLevel','changeThirdLevel','changeIds','changeBoardsBackend'])
      
      },
      components: {
        editList,
        tree
      },
      watch:{
          linkedSpaces:{
            handler(){
              this.specTree();
              this.queryReqList();
              console.log("watch")
            },
            deep:true
          },
          // 'DevSpec.reqList':{
          //   handler(){
          //     this.selectedIndex = -1;
          //     this.showDetailPart(true)
          //   },
          //   deep:true
          // }
      }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  @import 'requirement.scss';
</style>