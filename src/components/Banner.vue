<template>
  <div class="banner">
    <div class="banner-top-menu">
        <!--<a href="javascript:void(0)" class="icon icon-add-round menu-add left"></a>-->
        <Poptip placement="bottom" width="320" class="left">
          <a href="javascript:void(0)" class="icon icon-add-round menu-add left"></a>
          <div class="api add-task-banner" slot="content">
            <h2 class="add-title">Add Task</h2>
            <Input v-model="addTaskArea" 
                  type="textarea" 
                  class="add-input"
                  placeholder="Click to add task title"></Input>
            <div class='clearfix'></div>
            <Poptip  v-model='assignToProjectPopShow' placement="bottom-start" width="288" class="assignToProjectBar">
              <div class="assignToProject">
                  <i class='icon icon-space assignToProject-icon'></i>
                  <span class='assignToProject-name'>{{assignToProject}}</span>
              </div>
              <div class="api" slot="content">
                 <h3>Assign Project</h3>
                 <Input v-model="searchProjectValue"
                        class='searchProjectValue'
                        placeholder="search project"
                        @on-keyup='queryProjectBase($event)'
                        style="width:100%;"></Input>
                  <ul class='assign-project-list'>
                      <li v-for="pro in subProjectName"
                          :title='pro.subprojectName' 
                          class="assign-project-item"
                          @click='clickAssignProject(pro)'
                          :class="{assignItemHighLight:assignToProject == pro.subprojectName}"
                          >
                          <i class="icon icon-space assign-project-item-icon"></i>
                          <span class='assign-project-item-name'>{{pro.subprojectName}}</span>
                          
                      </li>
                  </ul>
              </div>
            </Poptip>
            <div class="clearfix"></div>
            <Button type="success" long class="btn-create-task">Create Task</Button>
          </div>
        </Poptip>
        <div class="banner-split left">
            <a href="javascript:void(0);" class="icon icon-search menu-search" @click='search'></a>
        </div>
        <div class="menu-btn-group left">
            <button class="btn-active">
                <span class="icon icon-alert"></span>
            </button>
            <button>
              <span class="icon icon-task"></span>
            </button>
        </div>
        <a href="javascript:;" class="menu-avatar left" :title="userName">{{userName | assignedName}}</a>
    </div>
    <div class="banner-full-page">
      <div class="banner-left-content">
          <h1>
            <a href="javascript:void(0)" class="banner-logo"></a>
          </h1>
          <div class="devsuite-base">
              <i class="icon icon-project"></i>
              <span class='selectBaseLabel' :title=projectLabel>
                {{projectLabel}}
                <span class="label-select">Select A Project Base</span>
              </span>
              <div class='devSuite-bars right' id="devSuite-bars">
                <Poptip placement="bottom" width="300">
                  <i class="icon icon-qiehuan s-icon right" style="font-size: 25px;"></i>
                  <div class="api" slot="content">
                    <h3 class="selectProject">Select Project Base</h3>
                    <div class="searchInput">
                      <input type="text" 
                            placeholder="Find Project Base" 
                            class="searchInput-val" 
                            v-model="projectBaseValue"
                            @keyup="queryProjectBase($event)"
                            >
                      <ul class="projectBaseList">
                        <li class="project-base-item" 
                            v-for="(baseItem,$index) in bannerProjectList" 
                            :title="baseItem.projectName"
                            :class="{baseHighLight: projectLabel == baseItem.projectName}"
                            @click=selectProject(baseItem)
                            >
                          <div class="base-icon left">
                            <i class="fa fa-plane"></i>
                          </div>
                          <div class="base-name left">
                            <span>{{baseItem.projectName}}</span>
                          </div>
                          <div class="clearfix"></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Poptip>
              </div>
          </div>
          <ul class="left-content-projects" id='left-content-projects' :class="{hasScrollBar: listShowScroll}" v-show="showProjectlist">
            <li v-for='(proItem,$index) in spaceList ' 
                :title=proItem.subprojectName
                @mouseover='projectMouseover($event)'
                @click='toHomePage(proItem)'>
                <i class="fa fa-reorder order" v-show='orderShow'></i>
                <p class='proItem left'>
                  <i class='icon icon-space'></i>
                  <span class='proItem-text'>{{proItem.subprojectName}}</span>
                </p>
                <span class="right"></span>
                <div class='clearfix'></div>
              <!--</div>-->
            </li>
          </ul>
          <p class="newProject" @click="createProject">
            <a href="javascript:void(0)">
              <span class="icon icon-add-round"></span>
              <span class="icon-text">New Project</span>
            </a>
          </p>
          <div class="left-content-bottom">
            <div style="clear:both;"></div>
          </div>
      </div>
      <div class="banner-welcome-info">
        <h2 class="welcome-info-time">{{currentTime}}</h2>
        <p class="welcome-info">Good {{time}}, {{userName}} !
        </p>
        <div class="set-pop">
            <!--<p class="pop-tip" @click="setBg($event)">
              <a href="javascript: void(0)" class="icon icon-setting"></a>
            </p>
            <div class="bg-panel" v-show="showBgPanel">
              <h3>Backgrounds</h3>
              <h4 class="bg-panel-colors">Colors</h4>
              <ul class="panel-colors-bg">
                <li v-for='(bgColor,$index) in bgColors'
                    class="colors-common"
                    :class="bgColor"
                    @click="chooseBgColor($event,$index)"
                >
                </li>
              </ul>
              <h4 class="bg-ph">Photos</h4>
              <ul class="bg-photos">
                <li v-for="(bgPhoto,$index) in bgPhotos"
                    @click="chooseBgPhoto($event,$index)"
                >
                  <a href="#">
                    <img :src='bgPhoto'>
                  </a>
                </li>
              </ul>
            </div>-->
            <Poptip placement="top" width="320" class="change-bg-pop" v-model='changeBgPanelShow'>
              <Icon type="android-settings" style='font-size:24px;cursor:pointer;'></Icon>
              <div class="api change-bg" slot="content">
                <div class='bg-top-title'>Backgrounds</div>
                <div class='bg-content'>
                  <h4 class="bg-panel-colors">Colors</h4>
                  <ul class="panel-colors-bg">
                    <li v-for='(bgColor,$index) in bgColors'
                        class="colors-common"
                        :class="bgColor"
                        @click="chooseBgColor($event,$index)"
                    >
                    </li>
                  </ul>
                  <h4 class="bg-panel-colors">Photos</h4>
                  <ul class="bg-photos">
                    <li v-for="(bgPhoto,$index) in bgPhotos"
                        @click="chooseBgPhoto($event,$index)"
                    >
                      <a href='javascript:void(0);'>
                        <img :src='bgPhoto'>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Poptip>
        </div>
      </div>
      <div class="banner-line-gradient"></div>
      <!-- 桌面背景图片/颜色-->
      <div class="banner-bg" :class="backgroundColor"></div>
      <div class="banner-blur-bg"></div>
      <div class="banner-right-bar">
        <h2 class="notification">Notification</h2>
        <h3 class="date-recent">Today
          <i class="icon icon-add-round right x"></i>
        </h3>
        <ul class="banner-msg-list">
          <li>
            <div class="list-circle banner-choose">
              <span class="icon icon-check1"></span>
            </div>
            <div class="list-content">
              <p class="titletop">Just now</p>
              <h4 class="list-txt">Tom completed</h4>
              <p class="list-new">New Task</p>
            </div>
          </li>
          <li>
            <div class="list-circle banner-message">
              <span class="icon icon-message1"></span>
            </div>
            <div class="list-content">
              <p class="titletop">Just now</p>
              <h4 class="list-txt">Tom completed</h4>
              <p class="list-new">New Task</p>
            </div>
          </li>
          <li>
            <div class="list-circle banner-share">
              <span class="icon icon-share1"></span>
            </div>
            <div class="list-content">
              <p class="titletop">Just now</p>
              <h4 class="list-txt">Tom completed</h4>
              <p class="list-new">New Task</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- search modal-->
    <Modal
        v-model="searchModal"
        class="searchModal"
        @on-ok="searchModalOk"
        @on-cancel="searchModalCancel">
        <div class='content-left'>
          <p class='left-title'>Search</p>
          <div class="left-input-wrapper">
            <Input v-model="modalSearchValue" 
                    icon="close-circled"  
                    style="width: 230px">
            </Input>
             <Button type="primary" class='left-btn-search'>Search</Button>
          </div>
          <div class='content-recent'>
            <p class='recent-title'>Recent Tasks</p>
            <div class='recent-tasks'>
              <div class='recent-task'
                    v-for='task in recentTasks' 
                    :key="task.id" 
                    :class="">
                  <div class="card-content right" style="width:20%;" id="card-content">
                       <p class="right bg-content"
                          @click.stop="">
                       </p>
                  </div>
                  <h4 class="card-msg left" style="width:80%;">
                        <p>{{task.title}}</p>
                  </h4>
                  <div class="clearfix"></div>
                  <div class="card-meta">
                      <div class="card-properties left">
                        <i class="icon-planlet"></i>
                        <i class="icon-calendar"></i>
                      </div>
                      <p class="id-badge right">ID:{{task.id}}</p>
                      <div class="clearfix"></div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class='content-right'>
          <div class="filter-projects filter-item">
            <div class="filter-projects-icon filter-co"></div>
            <p class="filter-item-projects filter-co filter-name">Projects<i class='fa fa-sort-down'></i></p>
          </div>
          <div class="filter-assign filter-item">
            <div class='filter-assign-icon filter-co'></div>
            <p class="filter-item-assign filter-co filter-name">assign<i class='fa fa-sort-down'></i></p>
          </div>
          <div class="filter-date filter-item">
            <div class='filter-date-icon filter-co'></div>
            <p class="filter-item-date filter-co filter-name">date<i class='fa fa-sort-down'></i></p>
          </div>
          <div class="filter-tag filter-item">
            <div class='filter-tag-icon filter-co'></div>
            <p class="filter-item-tag filter-co filter-name">tag<i class='fa fa-sort-down'></i></p>
            
          </div>
          <div class="reset-filter">
            <a href='javascript:void(0);'>Reset all filters</a>
          </div>
        </div>
    </Modal>
    <!--create project modal-->
    <Modal
        v-model="projectModal"
        class="projectModal"
        width='430'
        @on-ok="confirmCreateProject"
        @on-cancel="cancelCreateProject">
        <div class='newprojectTitle'>New Project</div>
        <p class='des-title margin'>Please choose a new name and description, and select the people you want to work with.</p>
        <Input v-model="newProjectName" 
               placeholder="new project name"
               class="newProjectNameInput margin"
               style="width: 100%;">
        </Input>
        <a href='javascript:void(0);' 
            class='add-des' 
            @click='addDes'>
            Add Description</a>
        <Input v-model="projectDesField"
               v-show='projectDesFieldShow'
               class='projectDesField'
               type="textarea" 
               placeholder="optional field"></Input>
        <p class='send-invite margin'>Send invites to</p>
        <Input v-model="inviteValue" 
               placeholder="enter recipients"
               class="inviteInput"
               style="width: 100%;">
        </Input>
    </Modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState,mapMutations,mapActions } from 'vuex';
export default {
  created(){
    var _this = this;
    setInterval(function(){
     _this.getTime()
    },1000)
    this.getBannerProList();
    let queryObj = this.$route.query;
    this.changeIds({projectId:queryObj.projectId,subProjectId:''})
    if(queryObj != undefined) {
      this.getProjectBase(queryObj.projectId);
    }

    this.getUserName();
    this.assignedName();

    window.onresize=function(){
      _this.computedSpaceWidth()
    };
    
    let userId =sessionStorage.getItem('userId');
    let url = location.hash.replace("#","");
    let appInfo = {
      "ProjectId": 0,
      "UserId": userId,
      "PrefId": 3000040,
      "PreferenceValue": '',
      "PreferenceText": '',
      "PreferenceMemo": url
    }
    this.axios.post(SAVE_HISTORY_PATH,appInfo).then(res=>{
        //console.log(res)
      },err=>{
        console.log(err)
    })
  },
  mounted(){
     this.computedSpaceWidth();
  },
  data(){
    return {
      userName:'',
      showBgPanel:false,
      showProjectlist:false,
      searchModal:false,
      projects: [
        { title: "DevSuite 10.0",tasks:3,icon:'icon-space'},
        { title: "DevSuite 10.0",tasks:2,icon:'icon-project'},
        { title: "DevSuite 10.0",tasks:2,icon:'icon-project'}
      ],
      currentTime:'',
      bgColors:['color1','color2','color3','color4','color5','color6','color7','color8','color9'],
      bgPhotos:['static/img/bg001.png','static/img/bg002.png','static/img/bg003.png','static/img/bg004.png'],
      backgroundColor: ' ',
      bannerProjectList: '',
      showProjectPop: false,
      subProjectName: [],
      projectLabel: 'Select A Project Base',
      projectBaseValue:'',
      spaceListMaxHeight:'',
      listShowScroll: false,
      token:'',
      url:'',
      userId:'',
      recentTasks:[
        {id:1,title:'[Bug] remove content'},
        {id:2,title:'[task] remove content'},
        {id:3,title:'[issues] remove content undel erwe'}
      ],
      addTaskArea:'',
      modalSearchValue:'',
      searchProjectValue:'',
      orderShow: false,
      time:'',
      projectModal:false,
      newProjectName:'',
      projectDesField:'',
      projectDesFieldShow: false,
      inviteValue: '',
      assignToProject:'',
      assignToProjectPopShow:false,
      changeBgPanelShow:false
    }
  },
  computed: {
   ...mapState(['userInfo','DEV','projectId','spaceList'])
  },
  methods:{
    search(){
      this.searchModal = true;
    },
    searchModalCancel(){},
    searchModalOk(){},
    getUserName(){
      this.userName =  sessionStorage.getItem('userName');
    },
    getProjectBase(projectBaseId){
      var param ={
        "IncludeClosed": false,
        SubProjectId: 0,
        projectId: projectBaseId
      }
      var getProjectBase = DevTrackApi + 'SubProject/GetTree';
      this.axios.post(getProjectBase,param).then(res=>{
          if(res.data.Success){
            this.subProjectName= res.data.Data.nodes.sort();
           // console.log(this.subProjectName)
           this.assignToProject = this.subProjectName[0].subprojectName;
            this.projectLabel  = res.data.Data.subprojectName;
            this.addSpaceList(this.subProjectName);
            this.showProjectlist = true;
            this.computedSpaceWidth();
          }else {
            console.log("The http response false");
          }
      },err=>{
          console.log(err);
      })

    },
    computedSpaceWidth(){
      if(this.showProjectlist) {
        if (window.innerHeight){
          var winHeight = window.innerHeight;
          this.spaceListMaxHeight = winHeight-180;
        }else if ((document.body) && (document.body.clientHeight)){
          var winHeight = document.body.clientHeight;
          this.spaceListMaxHeight = winHeight-180;
        }
        let spaceListHeight =  $('#left-content-projects').height();
        if(spaceListHeight>= this.spaceListMaxHeight) {
           $('#left-content-projects').height(this.spaceListMaxHeight)
           this.listShowScroll = true;
        }
      }
      
    },
    getTime(){
      var today = new Date();
      var h=today.getHours();
      var m=today.getMinutes();
      h = h<10 ? '0'+h : h;
      m = m<10 ? '0'+m : m;
      this.currentTime =  h+":"+m;
      if(h>5 && h<12) {
        this.time ='Morning';
      }else if(h>12 && h<18){
        this.time ='Afternoon';
      }else {
        this.time ='Evening';
      }
    },
    setBg(e){
      this.showBgPanel= !this.showBgPanel;
      e.stopPropagation();
    },
    chooseBgColor(event,index) {//choose background
      var backgroundClass = 'banner-bg';
      switch(index){
        case 0:{
          backgroundClass = 'banner-gredient11';
          break;
        }
        case 1:{
          backgroundClass = 'banner-gredient12';
          break;
        }
        case 2:{
          backgroundClass = 'banner-gredient13';
          break;
        }
        case 3:{
          backgroundClass = 'banner-gredient21';
          break;
        }
        case 4:{
          backgroundClass = 'banner-gredient22';
          break;
        }
        case 5:{
          backgroundClass = 'banner-gredient23';
          break;
        }
        case 6:{
          backgroundClass = 'banner-gredient31';
          break;
        }
        case 7:{
          backgroundClass = 'banner-gredient32';
          break;
        }
        case 8:{
          backgroundClass = 'banner-gredient33';
          break;
        }
        default:
          break;
      }
      this.backgroundColor = backgroundClass ;
      this.changeBgPanelShow=false;
    },
    chooseBgPhoto(event,index) {
      var photo;
      switch(index){
        case 0:{
          photo = 'banner-photo11';
          break;
        }
        case 1:{
          photo = 'banner-photo12';
          break;
        }
        case 2:{
          photo = 'banner-photo21';
          break;
        }
        case 3:{
          photo = 'banner-photo22';
          break;
        }
        default:
          break;
      }
      return this.backgroundColor = photo ;
    },
    getBannerProList(){
      let user_token =sessionStorage.getItem('user_token');
      const BANNER_PROLIST_URL = DevTrackApi +'Projects?token='+user_token;
      this.axios.get(BANNER_PROLIST_URL).then( response =>{
          this.bannerProjectList = response.data.Data;
      }, error =>{
          console.log(error.info);
        })
    },
    projectBase() {
      if(this.showProjectPop){
        this.showProjectPop = false;
      }else {
        this.showProjectPop = true;
      }
    },
    selectProject(item) {
      var _this = this;
      var projectBaseId = item.projectId;
      this.projectLabel = item.projectName;
      //this.changeProjectBase(item.projectName);
      this.changeProId(projectBaseId);
      this.getStatusList();
      this.getMembers({projectId:item.projectId});
      const SUB_PRO_URL = DevTrackApi + 'SubProject/GetTree';
      this.axios.post(SUB_PRO_URL,{
            "IncludeClosed": false,
            SubProjectId: 0,
            projectId: projectBaseId,
        }).then(res=>{
          this.changeIds({projectId:res.data.Data.projectId,subProjectId:''})
          if(res.data.Success) {
              this.subProjectName = res.data.Data.nodes;
              this.addSpaceList(this.subProjectName);
              this.showProjectPop = false;
              $('.ivu-poptip-popper').hide();
              setTimeout(()=>{
                this.showProjectlist = true;
                this.computedSpaceWidth();
              },10);
          }else {
            console.log('The http response a wrong data')
          }
        },err=>{
          console.log(err);
        })

      this.$router.push({path:location.hash.replace("#",""),query:{projectId: item.projectId}})
      let url= location.hash.replace("#","");
      let userId = sessionStorage.getItem('userId');;
      let projectInfo = {
        "ProjectId": item.projectId,
        "UserId": userId,
        "PrefId": 3000040,
        "PreferenceValue": '',
        "PreferenceText": '',
        "PreferenceMemo": url
      }
      //console.log( projectInfo)
      let appInfo = {
        "ProjectId": 0,
        "UserId": userId,
        "PrefId": 3000040,
        "PreferenceValue": '',
        "PreferenceText": '',
        "PreferenceMemo": url
      }
      this.axios.post(SAVE_HISTORY_PATH,projectInfo).then(res=>{
          if(res.data.Success){
          //console.log("projectInfo saved")
        };
        },err=>{
          console.log(err)
      })
      this.axios.post(SAVE_HISTORY_PATH,appInfo).then(res=>{
          if(res.data.Success){
          //console.log("appInfo saved")
        };
        },err=>{
          console.log(err)
      })

      // let path = this.$route.fullPath;
      // this.$router.push({path:path,query:{projectId:item.projectId}})
    },
    toHomePage(item) {
      let routerParam ={projectId:item.projectId,subProjectId:item.subprojectId};

      var queryObj = {"ProjectId": item.subprojectId,"PrefIds": [3000040]};
      this.axios.post(GET_HISTORY_INFO,queryObj).then(res=>{
        if(res.data.Data.length>0) {
          var url =res.data.Data[0].PreferenceMemo;
          if(url.indexOf('banner') == -1) {
            this.$router.push({ path: url, query: routerParam});
          }else {
            this.$router.push({ path: '/homepage/development/boards', query: routerParam});
          }
        }else {
          console.log("first to home");
          this.$router.push({ path: '/homepage/development/boards', query: routerParam})
        }
      },err=>{
        console.log(err)
      })
    },
    getLinkedSpace(item) {
        var proId = item.projectId;
        var subId = item.subprojectId;
        const GET_LINKE = DevTrackApi + 'subproject/LinkedSpaces';
        this.axios.post(GET_LINKE,{
          projectId: proId,
          subProjectId: subId
        }).then(res=>{
          //console.log(res)
          this.changeLinkedSpace(res.data.Data);//linkedSpace
        },err=>{
          console.log(err);
        })
      },
    changeProId(proId){
      this.$store.commit({
        type:'changeProId',
        projectId: proId,
      })
    },
    changeProjectBase(base){
      this.$store.commit({
        type: 'changeProjectBase',
        projectBase: base
      })
    },
    queryProjectBase(e){
       let searchValue = this.projectBaseValue ;
       let filter = searchValue.toUpperCase();
       let projectBaseArr = $('.projectBaseList>li');
       for (let i=0; i<projectBaseArr.length; i++) {
          var span = projectBaseArr[i].getElementsByTagName('span')[0];
          if ( span.innerHTML.toUpperCase().indexOf(filter) > -1) {
            projectBaseArr[i].style.display = ""; 
          }else {
            projectBaseArr[i].style.display = "none"; 
          }
      }
    },
    getQuery(subId){
        let queryParams ={
          "ProjectId":subId,
          "PrefIds": [
          3000040,3000044,3000045,3000041
          ]
        };
        this.axios.post(GET_HISTORY_INFO,queryParams).then(res=>{
            let spaceName ='';
            let pathObj = {
              subprojectId: '',
              subprojectName:'',
              subprojectType:'',
              sprintState: ''
            };
            if(res.data.Success){
              let preferences = res.data.Data;
              for(let i=0;i<preferences.length;i++) {
                  if(preferences[i].PrefId == 3000044) {
                    pathObj.subprojectId = preferences[i].PreferenceValue;
                    pathObj.subprojectName = preferences[i].PreferenceText;
                  }
                  if (preferences[i].PrefId == 3000045) {
                    pathObj.sprintState = preferences[i].PreferenceValue;
                    pathObj.subprojectType = preferences[i].PreferenceText;
                  }
                  if(preferences[i].PrefId == 3000040) {
                    spaceName = preferences[i].PreferenceText;
                  }
              }
              var _this = this;
              var queryObj = {
                 projectId: _this.$route.query.projectId,
                 subProjectId: subId,
                 folderId: pathObj.subprojectId
              }

              var url = location.hash.replace('#','')
             this.$router.push({path: '/homepage/development/boards',query:queryObj});
             this.changeLinkedName(spaceName);
            // console.log(pathObj);
             //console.log(spaceName);
             this.changeCurPath(pathObj);
            }else {
              console.log("The http response false")
            }
          },err=>{
            console.log(err);
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
    projectMouseover(e){
     $(e.currentTarget).eq(1).css('display',"block");
    },
    createProject(){
      this.projectModal = true;
    },
    confirmCreateProject(){},
    cancelCreateProject(){},
    addDes(){
      if(this.projectDesFieldShow){
        this.projectDesFieldShow = false;
      }else {
        this.projectDesFieldShow = true;
      }
    },
    clickAssignProject(item){
      this.assignToProject = item.subprojectName;
      this.assignToProjectPopShow = false;
    },
    ...mapMutations(['changeLinkedName','addUserInfo','changeBackLogId','changeCurPath','changeLinkedSpace','addSpaceList','changeIds','changeProjectBaseSubType','changeContent']),
    ...mapActions(['getMembers','getStatusList','getDevBoardTasks'])
  },
  components: {
     
  },
  watch:{
    projectId:function(){
      this.getStatusList();
    }
  }
}
</script>
<style type="text/css">
  @import "banner.css";
  @import '../../static/fonts.css';
</style>
