<template>
<div id='developmentGroupby' class="boards-group">
    <transition name="fade" mode="out-in" appear>
      <div class="po-test-side-list" v-show='showBackLogList'>
          <div class="po-side-list-header">
              <i-button id="closeBackLog" size="small" class="pull-right" @click="closeBackLog">
                <Icon  type="close-round"></Icon>
              </i-button>
              <div class="pull-left" title="">
                  <p class='left title-common'>
                    <span>release Backlog</span>
                  </p>
              </div>
        </div>
        <div class="po-side-list-content" id='po-side-list-content'>
              <table cellpadding="0" cellspacing="0" width="100%;" class='backLogList container' v-dragula="backLogList" service="shared-service" drake="drakecopy">
                <tr v-for="backLogItem in backLogList" :key="backLogItem"  class="list_row" >
                    <td><a href="javascript:void();">{{ backLogItem }}</a></td>
                </tr>
                <tr id='newItemTemplate' class="list_row" style='display:none;'>
                    <td><a href="javascript:void();">#backLogItem#</a></td>
                </tr>
              </table>
         </div>
      </div>
    </transition>
    <div class="wrapper" :class="{hasLeftoffset: showBackLogList, hasRightoffset: showEditPanel}">
            <div class="statusbar">
                <div v-for="(menuItem,$index) in storeAllStatus"
                    :id="menuItem.ChoiceId"
                    :status="$index"
                    class="menu-common">
                    {{menuItem.ChoiceName}}
                <span class="right"></span>
                </div>
                <div class="groupbycontent" :class="{hasRightMargin:showEditPanel}">
                  <div v-for="perOwner in ownerTasks">
                     <div class="lane-head" swimlane-id="1" >
                        <Button-group>
                            <Button type="ghost" @click="togglesection" icon="chevron-up" title="toggle on/off" style="border-top:none;border-bottom:none;"></Button>
                        </Button-group>
                        <span>{{perOwner.name}}</span>
                     </div>
                     <div class="containers">
                        <div v-for="(statusInfo,$index1) in perOwner.statusInfo" :key="$index1" class="container">
                            <div v-dragula="box"
                                service="shared-service-groupby"
                                drake="drakecopy" class="status-wrapper" :status="$index1">
                                <div
                                    class="action-card"
                                    :status="task.status"
                                    v-for="(task,$index2) in statusInfo.tasksData"
                                    :key="task.taskId"
                                    v-bind:taskid="task.taskId"
                                    @click.capture="showCardDetails"
                                >
                                <div class="card-content">
                                    <p class="bg-content content-tz right"
                                        :class=task.values.assigned
                                        v-if="task.values.assigned !== ''"
                                    >{{task.values.assigned | assignedName}}</p>
                                    <h4 class="card-msg">
                                        {{task.values.title}}
                                    </h4>
                                </div>
                                <div class="card-meta">
                                <div class="card-properties left">
                                    <i class="icon-planlet"></i>
                                    <i class="icon-calendar">
                                   
                                    </i>
                                </div>
                                <span class="id-badge right">ID{{task.taskId}}</span>
                                <div class="clearfix"></div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <!-- hide-->
                            <div id='newTaskTemplate' class="action-card" style='display:none;'>
                                <div class="card-content">
                                <p
                                    class="bg-content right tz"
                                    :class=cardInfo.cardType
                                    v-if="cardInfo.cardType !== ''"
                                >#taskowner#</p>
                                <h4 class="card-msg">
                                    #cardInfo.cardMsg#
                                </h4>
                                </div>
                                <div class="card-meta">
                                <div class="card-properties left">
                                    <i class="icon-planlet"></i>
                                    <i class="icon-calendar">
                                    #datetime#
                                    </i>
                                </div>
                                <span class="id-badge right">#taskid#</span>
                                <div class="clearfix"></div>
                                </div>
                            </div>
                        <!--end hide-->
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
      var index = 1000;
      this.$dragula.createService({
          name: 'shared-service-groupby',
          drakes: {
            drakecopy: {
              copy: true,
            }
          }
      }).on('shared-service-groupby',{
            'effects:removeModel': ({name, el, source, dragIndex, model}) => {
            el.classList.remove('ex-moved')
      },
      'effects:dropModel': ({name, el, source, target, dropIndex, model}) => {
        //el.classList.add('ex-moved');
      },
      accepts: ({el, target}) => {
        log('accepts: ', el, target);
        return true // target !== document.getElementById(left)
      },
      drag: ({el, source, target, container}) => {
        // console.log("On drag...");
         el.classList.remove('ex-moved')
         el.classList.add('active')
      },
      drop: (opts) => {
        if($('#developmentGroupby').length > 0)
        {
          const {el, container, source} = opts
          var dragstatus = { ltol: false, ltob: false, btol: false, btob: false };
          
          if(container == null)
          {
            opts.drake.remove();
            $(opts.source).children('tr.active').attr('class','list_row');
          }
          else if(source.tagName.toLowerCase() == 'table' && $(opts.container).hasClass('status-wrapper') == true)  //list to board
          {
            var statusAttr = $(opts.container).attr('status');
            
            if( typeof(statusAttr) != "undefined")
            {
              var newTitle = $(el).text();
              var curtime = new Date();
              var timeindex = curtime.toString().indexOf('GMT');
              var datetime = _this.getDateString(curtime);//curtime.toString().substr(0,timeindex);
              var templateHtml = $('#newTaskTemplate').get(0).outerHTML;
              templateHtml = templateHtml.replace('#cardInfo.cardMsg#', newTitle);
              templateHtml = templateHtml.replace('#datetime#', datetime);
              templateHtml = templateHtml.replace('#taskid#', 'ID'+index);
              templateHtml = templateHtml.replace('#taskowner#', 'TJ');
              templateHtml = templateHtml.replace('display: none',' '); 
              templateHtml = templateHtml.replace('id="newTaskTemplate"','status="' + statusAttr + '" taskid="'+index+'"');
              index++;
              $(el).after(templateHtml);
              $(el).remove();
              $(opts.source).children('tr.active').attr('class','list_row');
            }
            el.classList.add('ex-moved');
          }
          else if($(opts.source).hasClass('status-wrapper') == true && container.tagName.toLowerCase() == 'table')
          {
            opts.drake.remove();
          }
          else if($(opts.source).hasClass('status-wrapper') == true && $(opts.container).hasClass('status-wrapper') == true)  //board to board
          {
            console.log("board to board.");
            var taskid = $(el).attr('taskid');
            $(source).children("div[taskid=" + taskid +"]").remove();
          
            var statusAttr = $(el).attr('status');
            if( typeof(statusAttr) != "undefined")
            {
              var templateHtml =$(el)[0].outerHTML;
              templateHtml = templateHtml.replace('gu-transit ex-moved bg-placeholder','');
              $(el).after(templateHtml);
              $(el).remove();
            }
            el.classList.add('ex-moved');
          }
          else
          {
          //  console.log("DND unknown error.");
          // alert('unknown');
          }
          opts.drake.remove();
        }
      },
      over: ({el, container, source}) => {
       // console.log("On over...");
        el.classList.add('ex-moved')
        el.classList.add('bg-placeholder')
      },
      out: ({el, container}) => {
       // console.log("On out...");
         el.classList.add('ex-moved')
         el.classList.remove('bg-placeholder')
      }
    });
      this.uppercaseFilter();
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
      this.cardInfo={};
      this.getOwnerTask();
      this.assignedName();
    },
    mounted() {
        this.initGUI();
    },
    methods: {
      initGUI: function() {
        $('.po-test-side-list').height(window.innerHeight-107);
        $('.groupbycontent').height(window.innerHeight-165).width(window.innerWidth).css('max-width','3210px').
            css('position','relative').css('overflow-y','scroll').css('overflow-x','hidden');
        $('#testrun').height(window.innerHeight-107).width(window.innerWidth);
        $('.statusbar').height(window.innerHeight-109);
        
        if($('.groupbycontent').hasClass('hasRightMargin') == true)
          $('.groupbycontent').width($('.groupbycontent').width()-365);

        var offset_left = 0;
        $('.statusbar').on('scroll',function(){ 
          $('.groupbycontent').width($('.groupbycontent').width()+$('.statusbar').scrollLeft()-offset_left);
        //   console.log($('.groupbycontent').width(),$('.statusbar').scrollLeft());
          offset_left = $('.statusbar').scrollLeft();
        });
      },
      getOwnerTask(){
          var _this = this;
          var param = {
            "token": APIToken,
            "projectId": _this.projectId,
            "showAll": false,
            "pageIndex": 0,
            "getCount": false,
            "sortby": { "fieldId": 101, "order": "desc"},
            "fields": [601,101,102,103,104,105,106,107,108,201,202,305],
            "languageId": 0,
            query: {
                relation: 'and',
                condition: [{ subProject: {valueIds:[_this.subProjectId],includeChildren:true} }]
            }
          }
          this.groupByOwnerTask(param);
      },
      addNewTask: function(){
        $("#add-card-box").css('display',"none");
        $("#form-box").css('display',"block");
      },
      showCardDetails: function(){
          this.cardInfo= { };
          this.changeEditPanelStatus({b: true});
          if($('.groupbycontent').hasClass('hasRightMargin')){}
          else{
            $('.groupbycontent').addClass('hasRightMargin');
            $('.groupbycontent').width($('.groupbycontent').width()-365);
        }
      },
      cardEnd: function(){
        this.end = true;
      },
      uppercaseFilter: function(){
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
      getDateString:function(dateValue){
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
      closeBackLog() {
          this.switchBackLog({backLoglist: false});
      },
      ...mapMutations(['changeEditPanelStatus','switchBackLog']),
      ...mapActions(['groupByOwnerTask'])
    },
    data: function() {
      return {
        box: [],
        end: '',
        isTransform: false,
        mockData: [
            {   name: 'terry',
                statusInfo: [
                  {"container":[
                    { status:1,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:15},
                    { status:1,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:15},
                    { status:1,
                    cardType: "tz",
                    cardName: 'Tim Zero',
                    cardMsg:"DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything",
                    cardCalendar:"Feb 17",
                    cardImage:"",
                    cardId:15},
                    ]
                  }
                ]
            }
        ],
        TaskIndex: 3,
        cardInfo: '',
        todocardInfo: '',
        processcardInfo: '',
        verifycardInfo: '',
        donecardInfo: '',
        showTestRunPlanningTree:false        
      }
    },
    watch: {
        showEditPanel: function() {
           if(this.showEditPanel == false) {
              $('.groupbycontent').width($('.groupbycontent').width()+365);
           }
        }
    },
    computed: {  
      ...mapState(['showTestRunList','showEditPanel','storeAllStatus','ownerTasks','projectId','subProjectId','showBackLogList','backLogList'])
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

