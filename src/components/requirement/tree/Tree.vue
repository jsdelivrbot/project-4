<template>
    <div class="folder">
        <p class="icons left" @click="toggle(model)">
          <!--model.hasChild-->
            <i v-show="model.FolderNodes.length" class="fa fa-caret-right" :class="[open ? 'folder-open': 'folder']"></i>
            <!--<i v-if="!isFolder" class="icon"></i>-->
        </p>
        <span  class="folder-toggle left" >
            <p class="project-name"
              :title="model.FolderName"
              @click.stop="projectClick($event,model)"
              :class="[model.isFistLevel ? 'icon-firstLevel' : 'icon-secondLevel']"
              >
              <!--:class="'icon'+model.subprojectType"-->
                {{ model.FolderName }}
            </p>
        </span>
        <div class="clearfix"></div>
        <ul v-show="open" class="node">
            <tree-list v-for="(item,$index) in model.FolderNodes"  :key="$index" :model="item"></tree-list>
        </ul>
    </div>
</template>

<script> 
    import {mapState,mapMutations,mapActions} from 'vuex'
    export default {
      name: 'treeList',
      props: ['model'],
      data() {
        return {
          open: true
        }
      },
      computed: {
        isFolder: function() {
            return this.model.FolderNodes && this.model.FolderNodes.length
        },
        ...mapState(['DevSpec','subProjectId','DEV','folder','selectContent'])
      },
      mounted(){
        this.getReqList(JSON.parse(sessionStorage.getItem("z-reqList")));
      },
      methods: {
        projectClick(event,model){
          ////$(".folder-toggle.active").removeClass("active");
          $("#requirement .folder-toggle").removeClass("active");
          var el = event.currentTarget;
          $(el).closest(".folder-toggle").addClass("active");
          var FolderID = model.FolderID;
          var nodesArr = [];
          var projectId = this.$store.state.linkedSpaces.requirementSpaces[0].projectId;
          var params = {
            "ProjectID":projectId,
            "FolderID":FolderID,
            "ShowAll":1,
            "PageIndex":0,
            "Fields":["ProjectID","ID","Title","Status","Spec Owner","Date Last Modified"]
          }

          //query for subTreeFolder
          const Post_ItemList= DevSpecApi + 'ReqItemList';

          this.axios.post(Post_ItemList,params).then(res=>{
           if(res.status == 200){
              var listData = res.data.ListItems;
              if(!listData.length){
                var fillViod = [{Title: "There is no data", Status: "", 'Spec Owner': "","Date Last Modified":""}];
                listData = fillViod
              }
              //console.log(listData)
              this.getReqList(listData);
              setTimeout(function(){
                sessionStorage.setItem("z-reqList",JSON.stringify(listData));
              },3000)
            }
          },err=>{
            console.log(err);
          })
          
        },
        toggle(item) {
        //console.log(item)
          if (this.isFolder) {
            this.open = !this.open
          }
        
        // var query = {projectId: item.projectId,subProjectId:item.subprojectId};
        // var path = this.$route.path;
        // this.$router.push({path: path,query:query})
        
        // var params = {
        //   "IncludeClosed": false,
        //   "SubProjectId": query.subProjectId,
        //   "ProjectId": query.projectId
        // };
        // var getNodes = DevTrackApi+'SubProject/GetTree';
        // this.axios.post(getNodes,params).then(res=>{
        //       var nodesArr =[];
        //       if(res.data.Success){
        //         let nodesList = res.data.Data.nodes;
        //         for(let j=0;j<nodesList.length;j++) {
        //           var nodeObj = {
        //             "projectId": nodesList[j].projectId,
        //             "subprojectId": nodesList[j].subprojectId,
        //             "subprojectName": nodesList[j].subprojectName,
        //             "subprojectType": nodesList[j].subprojectType,
        //             "sprintState":nodesList[j].sprintState,
        //             "isClosed": nodesList[j].isClosed,
        //             "hasChild": nodesList[j].hasChild,
        //             "nodes":[]
        //           };
        //           nodesArr.push(nodeObj);
        //         };
        //         item.nodes = nodesArr;
        //         //console.log(nodesArr)
        //         console.log(this.folder)
        //         //this.getFolderTree()
        //       }
        //   },err=>{
        //         console.log(err)
        // })

      }, 
        
        ...mapMutations(['getReqList','changeCurPath','changeSearchPanelShow','changeBoardsBackend','changeIds']),
        ...mapActions(['getDevBoardTasks'])
      }
  }
</script>
<style lang="scss" scoped='' type="text/css">
@import './tree.scss'
</style>