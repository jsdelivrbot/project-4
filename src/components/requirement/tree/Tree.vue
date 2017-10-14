<template>
    <div class="folder">
        <p class="icons left">
          <!--model.hasChild-->
            <i 
                v-if="model.isFistLevel" 
                v-show="showTriangle" 
                class="fa fa-caret-right" 
                :class="[open ? 'folder-open': 'folder-up']"
                @click="toggle(model)"
            ></i>
            <i 
                v-else v-show="showTriangle" 
                class="fa fa-caret-right" 
                :class="[childOpen ? 'folder-open': 'folder-up']"
                @click="toggle(model)"
            ></i>
        </p>
        <span  class="folder-toggle left" >
            <p class="project-name"
              :title="model.FolderName"
              @click.stop="projectClick($event,model)"
              :class="[model.isFistLevel ? 'icon-firstLevel' : 'icon-secondLevel']"
              >
                {{ model.FolderName }}
            </p>
        </span>
        <div class="clearfix"></div>
        <ul v-if="model.isFistLevel" v-show="open" class="node">
            <tree-list v-for="(item,$index) in model.FolderNodes"  :key="$index" :model="item"></tree-list>
        </ul>
        <ul v-else v-show="childOpen" class="node">
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
          open: true,
          childOpen:false
        }
      },
      computed: {
        showTriangle(){
          return this.model.isFistLevel || this.model.ChildNumber
        },
        ...mapState(['DevSpec','subProjectId','DEV','folder','selectContent'])
      },
      mounted(){
        //this.getReqList(JSON.parse(sessionStorage.getItem("z-reqList")));
      },
      methods: {
        projectClick(event,model){
          $("#requirement .folder-toggle").removeClass("active");
          var el = event.currentTarget;
          $(el).closest(".folder-toggle").addClass("active");
          var FolderID = model.FolderID;
          var nodesArr = [];
          this.getFolderId(FolderID);
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
              this.getTotalCount(res.data.TotalCount);
              var listData = res.data.ListItems;
              if(!listData.length){
                var fillViod = [{Title: "There is no data", Status: "", 'Spec Owner': "","Date Last Modified":""}];
                listData = fillViod
              }
              this.getReqList(listData);
            }
          },err=>{
            console.log(err);
          })
          
        },
        toggle(item) {
          if (this.showTriangle) {
            this.open = !this.open
            this.childOpen = !this.childOpen;
          }
            var treeFolder = this.$store.state.linkedSpaces.requirementSpaces;
            var projectId = treeFolder[0].projectId;
            const SpecTreeChild= DevSpecApi + 'ReqFolderChild';
            const Params = {
              "ProjectID":projectId,
              "FolderID":item.FolderID
              //"ShowAll":0
            }

            this.axios.post(SpecTreeChild,Params).then(res=>{
              if(res.status == 200){
                  var resData = res.data.FolderNodes;
                  item.FolderNodes = resData;
                  //this.open = true;
                }
              },err=>{
                console.log(err);
              })
        }, 
        ...mapMutations(['getTotalCount','getFolderId','getReqList','changeCurPath','changeSearchPanelShow','changeBoardsBackend','changeIds']),
        ...mapActions(['getDevBoardTasks'])
      }
  }
</script>
<style lang="scss" scoped='' type="text/css">
@import './tree.scss'
</style>