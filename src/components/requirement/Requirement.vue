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

    <!--reqItem list-->
    <div class="list">
      <div class="page-blank"></div>
      <div class="list-reqItem">
        <div class="list-auto-height">
          <p class="list-add-item">
          <Button type="info" @click="addReqHandle">Add Rquirement</Button>
        </p>
        <ul class="list-content" id="list-content">
          <li v-for="item,$index in DevSpec.reqList" 
              @click="showEditPanel(item,$index)"
              :class="{active: item === currentItem,editting:$index === editIndex}"
          >
            <div class="list-item">
              <span class="drag-handler-icon"><i title="Drag icon to sort"></i></span>
              <span class="item-id">ID:{{item.ID}}</span>
              <label title="Dblclick and edit the title " @dblclick="editTitle(item,$index)">
                {{item.Title}}
              </label>
              <p class="item-tag">
                <Button type="info" size="small" icon="person" class="btn-owner" v-show="item['Spec Owner']">{{item['Spec Owner']}}</Button>
                <Button  v-if="item.Status === 'Released'" type="error" size="small" icon="android-options" v-show="item.Status" class="btn-status">{{item.Status}}</Button>
                <Button v-else type="success" size="small" icon="android-options" class="btn-status" v-show="item.Status">{{item.Status}}</Button>
                <span class="del-req"  @click.stop="delReqHandle($index)"><Icon type="close-round"></Icon></span>
              </p>
            </div>
            <input 
                v-focus="editIndex === $index"
                class="edit-title" 
                type="text" 
                v-model = "item.Title"
                @blur="completeEditting"
                @keyup.enter="completeEditting"
                @keyup.esc="cancelEditting(item)"
            />
          </li>
        </ul>
        <Page class="pagination-wrap" 
              :total="DevSpec.TotalCount" 
              show-total
              :current="currentPage"
              :page-size="customPageSize"
              @on-change="pageChangeHandle"
              ></Page>
        </div>
      </div>
      <div class="list-editItem" style="margin-left:15px;">
        <edit-list 
                  :currentCardInfo="currentItem"
                  v-on:closeEditPanel="closeEditPanelHandle" 
                  :editPanelShow="editPanelShow"
                  :currentIndex="currentIndex"
        ></edit-list>
      </div>
      <div class="page-blank"></div>
    </div>
  </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState,mapActions,mapMutations} from 'vuex'
    import Sortable from 'sortablejs'
    import editList from '../common/editList/EditList';
    import tree from './tree/Tree';

    export default {
      created() {
        console.log("create");
        // query for treeData to give it a new value;
        this.specTree()
        //this.queryReqList(this.currentPage)
        this.historyReqList();
      },
      updated(){
        //console.log(this.linkedSpaces.requirementSpaces[0].spaceId)
      },
      mounted(){
        console.log("mounted");
        //init the size of backgoundImg 
        backgoundImgHeight();

        //change the size of the backgroundImg when window's size changing;
        window.onresize = function(event) {
          backgoundImgHeight();
        };

        //sort
        this.$nextTick(function(){
          Sortable.create(document.getElementById('list-content'), {
            handle:".drag-handler-icon",
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

        //init folderId
        //this.defaultFolderId();

        //refresh page && gain the history data
        // var zReqList = sessionStorage.getItem("z-reqList");
        // if(zReqList){
        //   this.getReqList(JSON.parse(zReqList));
        // }
      },
      data: function() {
          return {
            noshow:true,

            //boards container --left
            parentTxt: '',
            childTxt: '',
            treeData:[],
            isFilterShow: false,
            filterByItems: [
                { name: 'Followed by',icon:'followby'},
                { name: 'Assigned by',icon:'assigned'},
                { name: 'Due date',icon:'duedate'},
                { name: 'Tags',icon:'tags'},
                { name: 'Status by',icon:'statusby'}
            ],

            //boards container --right
            showSettingPopTip:false,
            ListByValue: 'StatusBy',
            GroupByValue: 'None',
            GroupByItems: [
              { name: 'None'},
              { name: 'Owner'}
            ],

            //reqItemList
            currentIndex:-1,
            currentItem:"",
            editIndex:-1,
            beforeTitle:"",
            editPanelShow:false,
            currentPage:0,
            customPageSize:10//default show current page count
            }
      },
      computed: {
        paginationCurrentPage(){
          return parseInt(this.currentPage) + 1
        },
          ...mapState(['selectContent','showListIcon','DEV','isBoardsBackend','DevSpec','linkedSpaces']),
      },
      directives:{
        "focus":{//auto abtain focus
          update(el,binding){
            if(binding.value){
              el.focus();
            }
          }
        }
      },
      methods: {
        //boards container --left
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
        showSearchPanel(e) {
           e.stopPropagation();
        }, 
        closeSearchPanel(e){
            this.changeSearchPanelShow(false);
            this.changeBoardsBackend(false);
            $(".search-mes").removeClass("transform");
            e.stopPropagation();
        },
        //boards container --right
        closeFilter(){
            this.isFilterShow = false;
            this.changeBoardsBackend(false)
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
        //////qurery folderTree data
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
                 // "ProjectID":projectId,
                  "FolderID":spaceId,
                  "FolderName":item.spaceName,
                  "FolderStatus":"",
                  "isFistLevel":true,
                  "FolderNodes":[]
                }

                //query for subTreeFolder
                //const TestAPI = "http://sxhpc/DevSpecAPI/";
                const SpecTreeChild= DevSpecApi + 'ReqFolderChild';
                const Params = {
                  "ProjectID":projectId,
                  "FolderID":spaceId
                  //"ShowAll":0
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
        /////////////query for reqList
        queryReqList(currentPage){
          console.log("currentPage:" +currentPage);
          // query default reqList
          var folderId = this.DevSpec.folderId;
          var spaceId = null;
          var reqSpace = this.$store.state.linkedSpaces.requirementSpaces;
          if(reqSpace && reqSpace.length > 0){
              var treeFolder = reqSpace[0];//默认加载第一条数据
              var projectId = treeFolder.projectId;
              spaceId = folderId=-1 ? treeFolder.spaceId : folderId;

              var params = {
                "ProjectID":projectId,
                "FolderID":spaceId,
                "ShowAll":1, 
                "PageIndex":currentPage,
                "Fields":["ProjectID","ID","Title","Status","Spec Owner","Date Last Modified"]
              }

              //query for subTreeFolder
              //const TestAPI = "http://sxhpc/DevSpecAPI/";
              const Post_ItemList= DevSpecApi + 'ReqItemList';
              //const Post_ItemList= TestAPI + 'ReqItemList';

              this.axios.post(Post_ItemList,params).then(res=>{
              if(res.status == 200){
                  //console.log("totalCount:"+res.data.TotalCount)
                  this.getTotalCount(res.data.TotalCount);
                  var listData = res.data.ListItems;
                  this.getReqList(listData);
                  this.getFolderId(spaceId)
                  //setTimeout(function(){
                    //sessionStorage.setItem("z-reqList",JSON.stringify(listData));
                    sessionStorage.setItem("z-currentPage",currentPage);
                    sessionStorage.setItem("z-folderId",folderId);
                 // },3000)
                }
              },err=>{
                console.log(err);
              })
          }
        },
        historyReqList(){
          var storageCurrentPage = sessionStorage.getItem("z-currentPage");
            if(storageCurrentPage){
              console.log(storageCurrentPage);
              var storage_folderId = sessionStorage.getItem("z-folderId");
              console.log("folderId"+storage_folderId);
              this.getFolderId(storage_folderId);
              this.queryReqList(storageCurrentPage);
              if(storageCurrentPage == 0){
                this.currentPage=1;
              }else{
                this.currentPage=parseInt(storageCurrentPage);
              }
              //this.currentPage = parseInt(storageCurrentPage) - 1;
            }else{
              console.log(false)
              this.queryReqList(this.currentPage);
            }
        },
        /////the operation of reqList(click/focus/blur)
        showEditPanel(item,index){//single click
          this.currentItem = item;
          this.beforeTitle = item.Title;
          this.editPanelShow = true;
          this.currentIndex = index;
        },
        editTitle(item,index){//dblclick
          this.currentItem = item;
          this.editIndex = index;
          this.currentIndex = index;
        },
        completeEditting(){
          this.editIndex = -1;
        },
        cancelEditting(item){
          item.Title = this.beforeTitle;
          this.beforeTitle = "";
          this.editIndex = -1;
        },
        addReqHandle(){
          // var folderId = this.DevSpec.folderId;
          // var linkedProjectId = this.linkedSpaces.requirementSpaces[0].projectId;
          // var projectId = linkedProjectId ? linkedProjectId : "";

          // var Post_craeteItem = DevSpecApi + "ReqItem";
          // var params = {
          //   "ProjectID":projectId,
          //   "FolderID":folderId,
          //   "FolderPath":["Instant Messenger v1.0","Improvements"],
          //   "Title":""
          // }
          
          // var newItem = {
          //   "Title":"",
          //   // "ProjectID":itemObj.ProjectID,
          //   // "ItemID":""
          // };
          // console.log(this.DevSpec.folderId)
          // this.DevSpec.reqList.push(newItem);
          //this.currentItem = this.DevSpec.reqList[this.DevSpec.reqList.length]
        },
        delReqHandle(index){
          console.log(1)
          //this.listItem.splice(index,1);
        },
        closeEditPanelHandle(){//子组件editList触发父组件的该行为
          this.currentItem = "";
          this.editPanelShow = false;
          this.currentIndex = -1;
        },
        //////pagination
        pageChangeHandle(CurrentPage){
          this.currentPage = CurrentPage;
          this.queryReqList(CurrentPage);
        },
        //////upload
        //...mapMutations(['getReqList','linkedSpaces','changeSearchPanelShow','addBackLogList','switchBackLog','backLogListShow','changeListIcon','changeBackLogId','addAllTasks','changeSecondLevel','changeThirdLevel','changeIds','changeBoardsBackend'])
        ...mapMutations(['getTotalCount','getFolderId','getReqList','changeSearchPanelShow','changeBoardsBackend'])
      
      },
      components: {
        editList,
        tree
      },
      watch:{
          linkedSpaces:{
            handler(){
              this.historyReqList();
              this.specTree();
              //this.queryReqList(this.currentPage);//run function when loading requirement plugin
            },
            deep:true
          },
          
      }
  }

function backgoundImgHeight(){
  var window_h = $(window).innerHeight();
  var toor_h = $(".tools").height();  
  var boardContainer_h = $(".boards-container").height();
  $(".list").height(window_h - toor_h - boardContainer_h );
}

</script>

<style lang="scss" scoped="" type="text/css">
  @import 'requirement.scss';
</style>