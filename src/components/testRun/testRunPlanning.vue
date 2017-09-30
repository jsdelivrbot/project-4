<template>
  	<div class="po-test-side-list">
         <div class="po-side-list-header">
			 <div class="pull-left" title="" content="" placement="bottom-start">
				 <span class="file-png left">
                  <i class="fa fa-file-o"></i>
                </span>
                <span class="left title-common">Test Library</span>
                <span class="left title-common"> >> </span>
                <span class="left title-common">Business Application</span>
			 </div>

			 <i-button id="closetestRunPlanning" size="small" class="pull-right" @click="closetestRunPlanning"><Icon  type="close-round"></Icon></i-button>

			 <Poptip class="pull-right po-header-switch" title="" content="" placement="bottom-start">
				 <a href="javascript:void();" class="po-font-14"><img src="../../../static/img/switch.png" alt=""></a>
				 <div class="po-header-switch-content" slot="content">
					 <Tabs value="name2">
						 <Tab-pane label="Requirement" name="name1">
                             <div class="mes-panel-list">
                                <!--First level -->
                                <div class="panel-first-title">
                                       <ul class="second-title">
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <img src="../../../static/img/devspecspace.gif" style="margin-left: 10px;">
                                            Content Sharing Manager V1.0
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li>
                                                <img src="../../../static/img/type-root-normal.png" style="margin-left: 10px;">
                                                Customer Requests 
                                            </li>
                                            <li>
                                                <img src="../../../static/img/type-root-normal.png" style="margin-left: 10px;">
                                                Internal Feature Enhancement</li>
                                            <li>
                                                <img src="../../../static/img/type-root-normal.png" style="margin-left: 10px;">
                                                Requirements Using Word Addin</li>
                                            </ul>
                                        </li>
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <img src="../../../static/img/devspecspace.gif" style="margin-left: 10px;">
                                            Content Sharing Manager V2.0
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li class="item-detail">
                                                <img src="../../../static/img/type-root-normal.png" style="margin-left: 10px;">
                                                RoadMap</li>
                                            <li class="item-detail">
                                                <img src="../../../static/img/type-root-normal.png" style="margin-left: 10px;">
                                                Default spec submit folder</li>
                                            </ul>
                                        </li>                                     
                                    </ul>
                                </div>
                                <!-- Second level-->
                            </div>
                         </Tab-pane>
						 <Tab-pane label="Templates" name="name2">
                             <div class="mes-panel-list">
                                <!--First level -->
                                <div class="panel-first-title">
                                       <ul class="second-title">
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                             <img src="../../../static/img/Test-Template-Space.png" style="margin-left: 10px;">
                                            Business Appliction
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li>
                                                <img src="../../../static/img/tree_green_closed.gif" style="margin-left: 10px;">
                                                Admin 
                                            </li>
                                            <li>
                                                <img src="../../../static/img/tree_green_closed.gif" style="margin-left: 10px;">
                                                Client</li>
                                            <li>
                                                <img src="../../../static/img/tree_green_closed.gif" style="margin-left: 10px;">
                                                Customer Requirements</li>
                                            </ul>
                                        </li>
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                             <img src="../../../static/img/Test-Template-Space.png" style="margin-left: 10px;">
                                            Game Test Coverage
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li class="item-detail">
                                                <img src="../../../static/img/tree_green_closed.gif" style="margin-left: 10px;">
                                                Audio</li>
                                            <li class="item-detail">
                                                <img src="../../../static/img/tree_green_closed.gif" style="margin-left: 10px;">
                                                Levles</li>
                                            </ul>
                                        </li>                                     
                                    </ul>
                                </div>
                                <!-- Second level-->
                            </div>
                         </Tab-pane>
						 <Tab-pane label="Test Tasks" name="name3">
                              <div class="mes-panel-list">
                                <!--First level -->
                                <div class="panel-first-title">
                                       <ul class="second-title">
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <span class="second-title-content left">
                                            New Game
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="second-title">
                                                <li class="dev-items">
                                                    <span class="dev-items-icon left">
                                                    <i class="fa fa-caret-down"></i>
                                                    </span>
                                                    <img src="../../../static/img/Release.png" style="margin-left: 10px;">
                                                    <span>    NG 1.0       </span>
                                                    <div class="clearfix"></div>
                                                    <ul class="dev-item">
                                                        <li class="item-detail">
                                                        <img src="../../../static/img/Cycle.png" style="margin-left: 20px;">
                                                            Test Cycel 1.0 
                                                        </li>
                                                        <li class="item-detail">
                                                        <img src="../../../static/img/Cycle.png" style="margin-left: 20px;">
                                                            Test Cycel 2.0 
                                                        </li>
                                                        <li class="item-detail">
                                                        <img src="../../../static/img/Cycle.png" style="margin-left: 20px;">
                                                            Test Cycel 3.0 
                                                        </li>
                                                    </ul>
                                                </li>
                                           </ul>
                                        </li>
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <span class="second-title-content left">
                                            Content Sharing Manager V1.0
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="second-title">
                                                <li class="dev-items">
                                                    <span class="dev-items-icon left">
                                                    <i class="fa fa-caret-down"></i>
                                                    </span>
                                                    <img src="../../../static/img/Release.png" style="margin-left: 10px;">
                                                    <span>    Release 1.0  </span>
                                                    <div class="clearfix"></div>
                                                    <ul class="dev-item">
                                                        <li class="item-detail">
                                                        <img src="../../../static/img/Cycle.png" style="margin-left: 20px;">
                                                            Test Cycel 1 
                                                        </li>
                                                        <li class="item-detail">
                                                        <img src="../../../static/img/Cycle.png" style="margin-left: 20px;">
                                                            Test Cycel 2 
                                                        </li>
                                                        <li class="item-detail">
                                                        <img src="../../../static/img/Cycle.png" style="margin-left: 20px;">
                                                            Test Cycel 3 
                                                        </li>
                                                    </ul>
                                                </li>
                                           </ul>
                                        </li>                                     
                                    </ul>
                                </div>
                                <!-- Second level-->
                            </div>
                         </Tab-pane>
						 <Tab-pane label="Defects" name="name4">
                             <div class="mes-panel-list">
                                <!--First level -->
                                <div class="panel-first-title">
                                    
                                    <ul class="second-title">
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <span class="second-title-content left">
                                            Content Sharing Manager V1.0 (Agile)
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li>
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 12 Fed 5 -Fed 19,2017
                                            </li>
                                            <li>
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 13 Fed 6 -Fed 21,2017</li>
                                            <li>
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 14 Fed 8 -Fed 24,2017</li>
                                            </ul>
                                        </li>
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <span class="second-title-content left">
                                            Content Sharing Manager V3.0 (Agile)
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li class="item-detail">
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 19 March 1 - March 12,2017</li>
                                            <li class="item-detail">
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 22 March 14 - March 24,2017</li>
                                            </ul>
                                        </li>
                                        <li class="dev-items">
                                            <span class="dev-items-icon left">
                                            <i class="fa fa-caret-down"></i>
                                            </span>
                                            <span class="second-title-content left">
                                            Content Sharing Manager V4.0 (Traditional)
                                            </span>
                                            <div class="clearfix"></div>
                                            <ul class="dev-item">
                                            <li class="item-detail">
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 19 April 5 - April 12,2017</li>
                                            <li class="item-detail">
                                                <img src="../../../static/img/type-sprint.png" style="margin-left: 10px;">
                                                Sprint 19 April 16 - April 26,2017
                                            </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Second level-->
                            </div>
                         </Tab-pane>
					 </Tabs>
				 </div>
			 </Poptip>
		 </div>
		<div class="po-side-list-content">
			<table cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td><a href="javascript:void();"><Icon type="checkmark"></Icon> DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything</a></td>
				</tr>
				<tr>
					<td><a href="javascript:void();"><Icon type="checkmark"></Icon> Moving them anywhere else isn't quite possible</a></td>
				</tr>
				<tr>
					<td><a href="javascript:void();"><Icon type="checkmark"></Icon> DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything</a></td>
				</tr>
				<tr>
					<td><a href="javascript:void();"><Icon type="checkmark"></Icon> Moving them anywhere else isn't quite possible</a></td>
				</tr>
				<tr>
					<td><a href="javascript:void();"><Icon type="checkmark"></Icon> DT10.1-(DevTrack IE)In IE browser,preview the document as PDF/word/PPT,but it can't display anything</a></td>
				</tr>
				<tr>
					<td><a href="javascript:void();"><Icon type="checkmark"></Icon> Moving them anywhere else isn't quite possible</a></td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
    import Vue from 'vue'
    export default {
         methods: {
              closetestRunPlanning: function(){ 
                this.$emit('closetestRunPlanning',false);               
            }
         },
         props:{
             testRunPlanningShow:{
                 type: Boolean
             }
         }
    }
</script>
<style lang="scss" scoped="" type="text/css">
  @import './testRunPlanning.scss';
  @import '../../../static/grid_media.css';
</style>


