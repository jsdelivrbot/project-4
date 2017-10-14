<template>
<div id='devgroupby' class="devgroupby" 
  style="background: url(static/img/plant2.jpg) no-repeat center center; 
    background-size: cover;  
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    position:relative;
    z-index: 1;">
<!--backlog-->
    <div class="po-test-side-list" v-show="false">
      <div class="po-side-list-header">

			 <i-button size="small" class="pull-right" @click="closeTestRunPlanning">
         <Icon  type="close-round"></Icon>
      </i-button>
      <div class="pull-left" title="" content="" placement="bottom-start">
				 <span class="file-png left" style="padding-right:5px">
              <i class="fa fa-file-o"></i>
        </span>
        <span class="left title-common">Test Library</span>
        <span class="left title-common"> >> </span>
        <span class="left title-common">Business Application</span>
			 </div>
		 </div>
      <div class="po-side-list-content">
        <table id="templisttbl" cellpadding="0" cellspacing="0" width="100%;" class='container' v-dragula="box" service="shared-service-groupby" drake="drakecopy">
          <tr v-for="item in ListItems" :key="item" class="list_row">
            <td><a href="javascript:void();"> {{item}}</a></td>
          </tr>
        </table>
      </div>
    
	</div>
  <!--end of backlog -->

  
  <div class="wrapper" :class="{hasLeftoffset: false, hasRightoffset: showEditPanel}">
      <div class="statusbar">
          <div id="toDo"
              status="1"
              class="status-todo status-title-common boards-status-title row"> 
              To Do
              <span class="right"></span>
          </div><div id="inProgress"
          status="2"
          class="status-inprogress status-title-common boards-status-title row">
          In Progress
          <span class="right"></span>
          </div><div id="qaVerify"
          status="3"
          class="status-verify status-title-common boards-status-title row">
          Testing
          <span class="right"></span>
          </div><div id="done"
          status="4"
              class="status-done status-title-common boards-status-title row">
          In Review
              <span class="right"></span>
          </div><div id="toDo"
              status="1"
              class="status-todo status-title-common boards-status-title row"> 
              Approved
              <span class="right"></span>
          </div><div id="inProgress"
          status="2"
          class="status-inprogress status-title-common boards-status-title row">
          Selected task
          <span class="right"></span>
          </div><div id="qaVerify"
          status="3"
          class="status-verify status-title-common boards-status-title row">
          In Testing
          <span class="right"></span>
          </div><div id="done"
          status="4"
              class="status-done status-title-common boards-status-title row">
          Done
              <span class="right"></span>
          </div>

          <div class="groupbycontent" :class="{hasRightMargin:showEditPanel}">
            <div class="lane-head" swimlane-id="1" >
            <Button-group>
              <Button type="ghost" @click="togglesection" icon="chevron-up" title="toggle on/off" style="border-top:none;border-bottom:none;"></Button>
            </Button-group>
                <span>Terry-J</span>
            </div>
            <div>
                <div v-for="(statusInfo,$index1) in statusInfos" :key="$index1" class="container">
                    <div class="status-wrapper" :status="$index1">
                    <div
                        class="action-card"
                        :status="task.status"
                        v-for="(task,$index2) in statusInfo.statusInfo"
                        :key="task.cardId"
                        v-bind:taskid="task.cardId"
                        @click.capture="showCardDetails($event,$index1,$index2)"
                        :class="{'active':task.active,'unactive':!task.active}"
                    >
                        <div class="card-content">
                        <p class="bg-content content-tz right"
                            :class=task.cardType
                            v-if="task.cardType !== ''"
                        >{{task.cardType | uppercase}}</p>
                        <h4 class="card-msg">
                            {{task.cardMsg}}
                        </h4>
                        </div>
                        <div class="card-meta">
                        <div class="card-properties left">
                            <i class="icon-planlet"></i>
                            <i class="icon-calendar">
                            {{task.cardCalendar}}
                            </i>
                        </div>
                        <span class="id-badge right">ID{{task.cardId}}</span>
                        <div class="clearfix"></div>
                        </div>
                    </div>
                                      <div class="add-card-box" id="add-card-box" title="New Task">
              <span class="icon-ad"></span>
            </div>
                    </div>
                </div>
            </div>

            
        </div>
      </div>
  </div>
    

  <groupByDetailPanel
      v-show="showEditPanel"
      :currentCardInfo="cardInfo">
  </groupByDetailPanel>
  </div>
</template>
<script>
  import Vue from 'vue'
  import groupByDetailPanel from '../../../components/common/groupByDetailPanel/groupByDetailPanel.vue';
  import {mapState,mapMutations,mapActions} from 'vuex';
  export default {
    created () {
      var _this = this;
      
      this.uppercaseFilter();
      this.dateFilter();
      document.onkeydown = function(evt) {
          evt = evt || window.event;
          if(evt.keyCode == 27)
          {
              window.eventBus.$dragula.service('shared-service-groupby').drakes.drakecopy.remove();
              if($('#templisttbl').find('tr.active').length > 0)
                  $('#templisttbl').find('tr.active').attr('class','list_row');
          }
      };
      window.onresize = function(event) {
        _this.initGUI();
      };
    },
    mounted() {
        this.initGUI();
    },
    data: function() {
      return {
        end: '',
        isTransform: false,
        EmptyListItems: [],
        cardInfo:{},
        ListItems:[
          "DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
          "Moving them anywhere else isn't quite possible",
          "DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
          "Moving them anywhere else isn't quite possible",
          "DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
          "Moving them anywhere else isn't quite possible"
        ],
        filterByItems: [
          { name: 'Followed by',icon:'followby'},
          { name: 'Assigned by',icon:'assigned'},
          { name: 'Due date',icon:'duedate'},
          { name: 'Tags',icon:'tags'},
          { name: 'Status by',icon:'statusby'}
        ],
        statusInfos: [
          {
            statusInfo: [
                  { status:1,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:15},
                  { status:1,
                    cardType: "jc",
                    cardName: 'Jimery Cook',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:36 },
                  { status:1,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"You should check any other nested elements",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:37 },
                  { status:1,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"You should check any other nested elements",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:47 }
                ]
          },
          {
            statusInfo: [
                  { status:2,
                    cardType: "jz",
                    cardName: 'Jimery Zero',
                    cardMsg:"There's also the possibility of moving elements around in the same container, changing their position",
                    cardCalendar:"Feb 19",
                    cardImage:"",
                    cardId:56},
                  { status:2,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"This is the default use case. You only need to specify the containers you want to use",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:40},
                  { status:2,
                    cardType: "ph",
                    cardName: 'Phillips',
                    cardMsg:"Moving element",
                    cardCalendar:"Feb 17",
                    cardImage:"static/img/demo.png",
                    cardId:58},
                    { status:2,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"There's also the possibility of moving elements around in the same container, changing their position",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:165},
                  { status:2,
                    cardType: "jz",
                    cardName: 'Jimery Zero',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:167},
                  { status:2,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"Anything can be moved around. That includes img, or any other nested elements.",
                    cardCalendar:"Feb 17",
                    cardImage:"static/img/demo1.png",
                    cardId:166}
            ]
          },
          {
            statusInfo: [
                  { status:3,
                    cardType: "tj",
                    cardName: 'Terry Johson',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything.",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:45},
                  { status:3,
                    cardType: "ph",
                    cardName: 'Philiam Wall',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:78},
                  { status:3,
                    cardType: "jc",
                    cardName: 'Jimery Cook',
                    cardMsg:"Anything can be moved around. That includes img, or any other nested elements.",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:25}
            ]
          },
          {
            statusInfo: [
                  { status:4,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"There's also the possibility of moving elements around in the same container, changing their position",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:65},
                  { status:4,
                    cardType: "jz",
                    cardName: 'Jimery Zero',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:67},
                  { status:4,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"Anything can be moved around. That includes img, or any other nested elements.",
                    cardCalendar:"Feb 17",
                    cardImage:"static/img/demo1.png",
                    cardId:66}
            ]
          },
          {
            statusInfo:[
                  { status:4,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"There's also the possibility of moving elements around in the same container, changing their position",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:65},
                  { status:4,
                    cardType: "jz",
                    cardName: 'Jimery Zero',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:67},
                  { status:4,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"Anything can be moved around. That includes img, or any other nested elements.",
                    cardCalendar:"Feb 17",
                    cardImage:"static/img/demo1.png",
                    cardId:66}              
            ]
          },
          {
            statusInfo:[
                  { status:3,
                    cardType: "tj",
                    cardName: 'Terry Johson',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything.",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:45},
                  { status:3,
                    cardType: "ph",
                    cardName: 'Philiam Wall',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:78},
                  { status:3,
                    cardType: "jc",
                    cardName: 'Jimery Cook',
                    cardMsg:"Anything can be moved around. That includes img, or any other nested elements.",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:25}              
            ]
          },
          {
            statusInfo:[
                  { status:2,
                    cardType: "jz",
                    cardName: 'Jimery Zero',
                    cardMsg:"There's also the possibility of moving elements around in the same container, changing their position",
                    cardCalendar:"Feb 19",
                    cardImage:"",
                    cardId:56},
                  { status:2,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"This is the default use case. You only need to specify the containers you want to use",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:40},
                  { status:2,
                    cardType: "ph",
                    cardName: 'Phillips',
                    cardMsg:"Moving element",
                    cardCalendar:"Feb 17",
                    cardImage:"static/img/demo.png",
                    cardId:58},
                    { status:2,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"There's also the possibility of moving elements around in the same container, changing their position",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:165},
                  { status:2,
                    cardType: "jz",
                    cardName: 'Jimery Zero',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"",
                    cardImage:"",
                    cardId:167},
                  { status:2,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"Anything can be moved around. That includes img, or any other nested elements.",
                    cardCalendar:"Feb 17",
                    cardImage:"static/img/demo1.png",
                    cardId:166}              
            ]
          },
          {
            statusInfo:[
                  { status:1,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:15},
                  { status:1,
                    cardType: "jc",
                    cardName: 'Jimery Cook',
                    cardMsg:"Moving them anywhere else isn't quite possible",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:36 },
                  { status:1,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"You should check any other nested elements",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:37 },
                  { status:1,
                    cardType: "ww",
                    cardName: 'William Wall',
                    cardMsg:"You should check any other nested elements",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:47 }              
            ]
          }
        ],
        TaskIndex: 3,
        projectId: 3,
      }
    },
    computed: {  
      ...mapState(['DEV','showEditPanel',])
    },
    methods: {
      initGUI: function() {        
        $('.po-test-side-list').height(window.innerHeight-107);
        $('.groupbycontent').height(window.innerHeight-165).width(window.innerWidth).css('max-width','3210px').
            css('position','relative').css('overflow-y','scroll').css('overflow-x','hidden');
        $('.boardcontent ').height(window.innerHeight-163);
        $('#testrun').height(window.innerHeight-107).width(window.innerWidth);
        $('.statusbar').height(window.innerHeight-109);

        if($('.groupbycontent').hasClass('hasRightMargin') == true)
          $('.groupbycontent').width($('.groupbycontent').width()-365);

        var offset_left = 0;
        $('.statusbar').on('scroll',function(){ 
          $('.groupbycontent').width($('.groupbycontent').width()+$('.statusbar').scrollLeft()-offset_left);
          console.log($('.groupbycontent').width(),$('.statusbar').scrollLeft());
          offset_left = $('.statusbar').scrollLeft();
        });
      },
      addNewTask: function(){
        $("#add-card-box").css('display',"none");
        $("#form-box").css('display',"block");
      },
      newinputBlur: function(){

      },
      showCardDetails: function(event, index1, index2){
        this.$store.state.showEditPanel = true;
        this.cardInfo = this.statusInfos[index1].statusInfo[index2];
        if($('.groupbycontent').hasClass('hasRightMargin'))
        {

        }
        else
        {
          $('.groupbycontent').addClass('hasRightMargin');
          $('.groupbycontent').width($('.groupbycontent').width()-365);
        }
        
      },
      getEventData: function(b){
        this.showEditPanel = b;
      },
      cardEnd: function(){
        this.end = true;
      },
      updateTask(){

      },
      getOwner(value){

      },
      uppercaseFilter: function(){
        Vue.filter('uppercase', function(value) {
          if (!value) { return ''}
          value = value.toString()
          return value.toUpperCase();
        })
      },
      dateFilter: function() {        
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
          var date = new Date(value);
          return date.format('yyyy/MM/dd');
        })
      },
      getDateString:function(dateValue){
         //var date = new Date(dateValue);
         if( !dateValue)
            return "";
          return dateValue.format('yyyy/MM/dd');
      },
      hasListenedIndex: function(index){
      },
      togglesection: function(e) {
          if($(e.currentTarget).parent().parent().next(':visible').length > 0)
          {
            $(e.currentTarget).parent().parent().next(':visible').hide();
            $(e.currentTarget).find('i').attr('class','ivu-icon ivu-icon-chevron-down');
          }
          else
          {
            $(e.currentTarget).parent().parent().next().show();
            $(e.currentTarget).find('i').attr('class','ivu-icon ivu-icon-chevron-up');
          }
      },
      getTaskIndex:function(taskid){
        var newTaskID = taskid + (this.TaskIndex++);
        console.log(newTaskID);
        return newTaskID;
      },
      ...mapMutations(['changeEditPanelStatus'])
    },
    components: {
      groupByDetailPanel
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
   @import './groupBy.scss';
  @import '../../Development/boards/poptip.scss';
</style>

