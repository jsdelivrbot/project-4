<template>
  <transition name="fade" mode="out-in" appear>
      <div class="editPanel" v-show="editPanelShow">
        <div class="edit-panel">
          <!-- list panel close-->
          <div class="details-panel-header">
            <i
              id="closePanel"
              class="icon-close icon-wrong"
              title="Close"
              @click="closeEditPanel"
            ></i>
          </div>
          <!-- list panel field -->
          <div class="details-panel-fields">
            <div class="field-wrapper sel-title">
              <Row>
                <Col span="3"><span class="left l-title" title="Title">Title:</span></Col>
                <Col span="21">
                  <p class="paragraph" title="Click to edit"
                      v-show="showParagraph"
                    @click="switchInput()"
                  >
                    {{currentCardInfo.Title }}
                  </p>
                  <!--input-->
                  <div class="input-wrapper" v-show="!showParagraph">
                    <input
                      type="text"
                      class="t-textbox"
                      ref="editInput"
                      placeholder=""
                      v-model="currentCardInfo.Title"
                      @blur="switchParagraph"
                    >
                    <!--clear input value-->
                    <i class="icon-wrong input-button-clear right"
                      title="clear"
                      @click="clearInputValue(currentCardInfo)"
                    ></i>
                  </div>
                </Col>
              </Row>
            </div>
          <!--status && owner-->
            <div class="field-wrapper sel-title clearfix">
              <Row>
                <Col span="12">
                  <Col span="6"><span class="left l-status" title="Status">Status:</span></Col>
                  <Col span="18">
                    <list-select 
                                style="width:100%;"
                                :listData="statusData"
                                
                    >
                    </list-select>
                  </Col>
                </Col>
                <Col span="12">
                  <Col span="6"><span class="left l-owner" title="Spec Owner">Spec Owner:</span></Col>
                  <Col span="18">
                    <list-select 
                                style="width:100%;"
                                :listData="SpecOwnerData"
                                :isClass="true"
                    ></list-select>
                  </Col>
                </Col>
              </Row>
            </div>
          <!--desciption-->
            <div class="field-wrapper sel-description">
              <Row>
                <Col span="3"><span class="left l-descript" title="Description">Description:</span></Col>
                <Col span="21">
                  <div class="description">
                    <div
                        class="description-placeholder"
                        v-show="showDesPlaceholder"
                        @click="switchTextArea"
                    >
                        Edit description
                    </div>
                    <div class="description-edit">
                      <textarea
                        class="description-textarea"
                        :class="{showStyle:blur}"
                        v-show="!showDesPlaceholder"
                        @blur="textAreaBlur"
                        @focus="textAreaFocus"
                      ></textarea>
                      <div class="description-toolbar" v-if="descriptionToolbar">
                        <button id="btnSave"
                                class="btnSave btnCommon right"
                                @click="toolBtnSave"
                        >Save</button>
                        <button id="btnCancel"
                                class="btnCancel btnCommon right"
                                @click="toolBtnCancel"
                        >Cancel</button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          <!--date-->
          <div class="detailspane__tab-container">
            <div class="calender-field">
              <hr class="po-details-pane__divider">
              <div class="po-field-wrapper">
                <div class="po-iconrow">
                  <div class="po-tooltip__wrapper">
                    <span class="icon icon-text">Te</span>
                    <span class="outer-text">TechExcel</span>
                  </div>
                  
                  <div class="po-tooltip__wrapper">
                    <span class="icon icon-pic" title="Date Last Modified" >
                      <Icon type="ios-calendar-outline"></Icon>
                    </span>
                    <span class="outer-text outer-date">{{currentCardInfo['Date Last Modified']}}</span>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
              <hr class="po-details-pane__divider">
            </div>
            <!--attachment-->
            <div class="attach-space">
              <div class="attach-head">
                <span>
                  <Icon type="android-attach"></Icon>
                </span>
                <span>Attachments({{this.uploadList.length}})</span>
              </div>
              <div class="attach-content">
                <div class="attach-upload">
                  <!--上传-->
                  <template>
                    <div class="demo-upload-list" v-for="item in uploadList" v-show="uploadList.length">
                          <div class="img-wrap">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover" style="display:block;">
                              <a class="view-pdf" target="_blank" :href="pdfViewUrl" @click="viewPdf(item.FileID)">
                                <Icon type="ios-eye-outline" title="click to preview image"></Icon>
                              </a>
                              <a class="view-pdf" href="javascript:;">
                                <Icon type="ios-trash-outline" title="click to delete image"   @click.native="handleRemove(item.FileID)"></Icon>
                              </a>
                                <!--<Icon type="ios-eye-outline" title="click to preview image"  @click.native="handleView(item.FileID)"></Icon>
                                <Icon type="ios-trash-outline" title="click to delete image"  @click.native="handleRemove(item.FileID)"></Icon>-->
                            </div>
                          </div>
                          <p class="attach-name">
                            <!--<span :title="item.name" href="#" @click="downLoadAttach(item.FileID)">{{item.name}}</span>-->
                            <a :title="item.name" :href="downLoadHref" :download="item.name" @click.stop="downLoadAttach(item.FileID)">{{item.name}}</a>
                          </p>
                          <p class="attach-download">
                            <!--<span :title="item.name" href="#" @click="downLoadAttach(item.FileID)">{{item.name}}</span>-->
                            <a title="click to download the resource" :href="downLoadHref" :download="item.name" @click.stop="downLoadAttach(item.FileID)">Download</a>
                          </p>
                    </div>
                    <div class="upload-wrap">
                      <Upload
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        :headers="uploadHeader"
                        :on-progress = "handleProgress"
                        multiple
                        type="drag"
                        :action="paramsObj.action"
                        style="width:104px;">
                        <div style="width: 104px;height:124px; line-height:126px; border:none !important;">
                            <Icon type="arrow-up-a" size="40"></Icon>
                        </div>
                      </Upload>
                      <Spin fix class="upload-loading-bar" v-show="showLoadingBar">
                          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                          <div>Loading</div>
                      </Spin>
                      <div class="attach-add">
                        <p>
                          <Icon type="ios-plus-outline"></Icon>
                          <span title="click the icon to upload attachment">Add Attachment</span>
                        </p>
                      </div>
                    </div>
                    <Modal title="查看图片" v-model="visible" width="900" height="500">
                        <img :src="itemImgUrl" v-if="visible" style="width: 100%;">
                    </Modal>
                  </template>
                  <!--end upload template-->
                  <div class="clearfix"></div>
                </div>
                <!--<div class="attach-add">
                  <p>
                    <Icon type="ios-plus-outline"></Icon>
                    <span>Add Attachment</span>
                  </p>
                </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
  import Vue from 'vue'; 
  import listSelect from "../select/listSelect"

  export default {
    props: {
      editPanelShow: {
        type: Boolean
      },
      currentCardInfo: {
        required: true
      },
      currentIndex:{
        required: true
      }
    },
    created() {
      //this.dateFilter();
    },
    watch:{
      currentIndex:{//问题：刷新页面的时候再次传过来的currentCardINfo和之前的相同，但是已经有的附件图片因为不会出发请求函数而不见了
        handler(val,odlVal){
          console.log("改变")
          if(val != -1){////when closing the editPanel not to query Info
            this.queryImgData();
          }
        },
        deep:true
      }
    },
    data: function(){
      return {
        defaultList:[],
        showParagraph: true,
        showDesPlaceholder: true,
        blur: false,
        descriptionToolbar: '',
        //upload
        visible: false,
        itemImgUrl:"",
        uploadList: [],
        defaultAttachNum:0,
        uploadHeader:{},
        showLoadingBar:false,
        downLoadHref:'javasctipt:;',
        pdfViewUrl:'javascript:;',
        /////select
        statusData:statusData,
        SpecOwnerData:SpecOwnerData
      }
    },
    computed: {
      paramsObj(){
        var ProjectID = this.currentCardInfo.ProjectID;
        var ItemID = this.currentCardInfo.ID;
        //var action = 'http://sxhpc/DevSpecAPI/ReqAttachment?ProjectID='+ProjectID+'&NoteID=1&FileName=&ItemID='+ItemID;
        var action = DevSpecApi + 'ReqAttachment?ProjectID='+ProjectID+'&NoteID=1&FileName=&ItemID='+ItemID;
        var Objdata = {
          "ProjectID":ProjectID,
          "ItemID":ItemID,
          "action":action
        }
        return Objdata;
      },
      editTime: function() {// update edit time
        let now = new Date();
        let year = now.getFullYear();
        let day = now.getDate();
        let month = now.getMonth()+1;
        let hour = now.getHours();
        let minute = now.getMinutes();
        day = day<10 ? '0'+day : day;
        month = month<10 ? '0'+month : month;
        return day+"/"+month+"/"+year+" "+hour+":"+minute;
      }
    },
    directives:{
      "focus":{
        update(el,binding){
          if(binding.value){
            el.focus();
          }
        }
      }
    },
    methods: {
      viewPdf(FileID){
        //var pdfUrl = DevSpecApi + 'ReqAttachment?ProjectID='+this.paramsObj.ProjectID+'&NoteID=1&FileName='+FileName+'.pdf&ItemID='+this.paramsObj.ItemID;
        var pdfUrl = DevSpecApi + 'ReqAttachmentDownload?ProjectID='+this.paramsObj.ProjectID+'&FileType=1&VersionID=0&FileID='+FileID;
       //var pdfUrl = 'http://sxhpc/DevSpecAPI/ReqAttachmentDownload?ProjectID=144&FileID=850&VersionID=0&FileType=1'
        this.pdfViewUrl = "/static/generic/web/viewer.html?"+encodeURIComponent(pdfUrl);
      },
      queryImgData(){
          this.uploadList = [];
          // query for ReqAttachmentInfoLis  currentCardInfo.attachImgData
          const Post_AttachList= DevSpecApi + 'ReqAttachmentInfoList';
          //const Post_AttachList='http://sxhpc/DevSpecAPI/ReqAttachmentInfoList';
          var _this = this;
          var params = {
            "ProjectID":this.paramsObj.ProjectID,
            "ItemID":this.paramsObj.ItemID,
          }

          var attachInfoArr = [];
          this.axios.post(Post_AttachList,params).then(res=>{
            if(res.status == 200){
              var attachInfoList = res.data.AttachmentInfoList;
              if(attachInfoList && attachInfoList.length > 0){
                  for(var i=0;i<attachInfoList.length;i++){
                      attachInfoArr.push({
                        "name":attachInfoList[i].DisplayFileName,
                        "url":DevSpecApi + 'ReqAttachmentImage?ProjectID='+this.paramsObj.ProjectID+'&FileID='+attachInfoList[i].FileID+'&VersionID=0',
                        //"url":'http://sxhpc/DevSpecAPI/ReqAttachmentImage?ProjectID='+this.paramsObj.ProjectID+'&FileID='+attachInfoList[i].FileID+'&VersionID=0',
                        "FileID":attachInfoList[i].FileID
                      })
                  }
                  _this.uploadList = attachInfoArr;
              }
            }
          },err=>{
            console.log(err);
          })
      },
      switchInput: function(){
        this.showParagraph = false;
      },
      clearInputValue: function (item){// clear input value
        this.$refs.editInput.value= ' '
      },
      switchParagraph: function(){
        this.showParagraph = true;
      },
      switchTextArea: function(){
        this.showDesPlaceholder = false;
      },
      textAreaBlur: function(){
        this.blur = true;
      },
      textAreaFocus: function(){
        this.blur = false;
        this.descriptionToolbar = true;
      },
      toolBtnSave: function() {
        this.descriptionToolbar = false;
        this.showDesPlaceholder = true;
      },
      toolBtnCancel: function() {
        this.descriptionToolbar = false;
        this.showDesPlaceholder = true;
      },
      closeEditPanel: function(){
        this.$emit('closeEditPanel',false);
      },
      //upload
      handleView (FileID) {
                this.itemImgUrl = DevSpecApi + 'ReqAttachmentImage?ProjectID='+this.paramsObj.ProjectID+'&FileID='+FileID+'&VersionID=0&fileType=1';
                this.visible = true;
      },
      handleRemove (FileID) {
        console.log(1);
          const Delete_attachment= DevSpecApi + 'ReqAttachment?ProjectID='+this.paramsObj.ProjectID+'&FileID='+FileID+'&NoteID=0';
          this.axios.delete(Delete_attachment).then(res=>{
              if(res.status == 200){
                  this.queryImgData();
              }
              //this.queryImgData();
          },err=>{
              console.log(err);
          })
      },
      handleSuccess (res, file) {//action commit 后，返回的会包括name,url
        var _this = this;
        setTimeout(function(){
          _this.showLoadingBar = false;
          _this.queryImgData()
        },9000);
      },
      handleError(err,file){
        /////
      },
      handleFormatError (file) {
          // this.$Notice.warning({
          //     title: '文件格式不正确',
          //     desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
          // });
      },
      handleMaxSize (file) {
          // this.$Notice.warning({
          //     title: '超出文件大小限制',
          //     desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
          // });
      },
      handleBeforeUpload () {
          // const check = this.uploadList.length < 5;
          // if (!check) {
          //     this.$Notice.warning({
          //         title: '最多只能上传 5 张图片。'
          //     });
          // }
          // return check;
          //this.$Loading.start();
      },
      handleProgress(){
        this.showLoadingBar = true;
      },
      downLoadAttach(FileID){
        const Get_downLoadAttach= DevSpecApi + 'ReqAttachment?ProjectID='+this.paramsObj.ProjectID+'&FileID='+FileID+'&VersionID=0';
        //const Get_downLoadAttach= 'http://sxhpc/DevSpecAPI/ReqAttachment?ProjectID='+this.paramsObj.ProjectID+'&FileID='+FileID+'&VersionID=0';
        console.log(Get_downLoadAttach);
        this.downLoadHref = Get_downLoadAttach;
      }
    },
    components:{
      listSelect
    },
    //upload
    mounted () {
        // var storageFileList = JSON.parse(sessionStorage.getItem("z-uploadFileList"));
        // if(storageFileList){
        //   this.$refs.upload.fileList;
        // }
        //this.uploadList = this.$refs.upload.fileList;
        //this.action = 'http://sxhpc/DevSpecAPI/ReqAttachment?ProjectID=144&NoteID=1&FileName=&ItemID=90';
        //console.log(this.currentCardInfo);
        this.uploadHeader = {"UserToken":APIToken}
    }
  }

var statusData = [
  "Developed","Droped","In Developed","Pending change","Released","To be Committed"
]

var SpecOwnerData = [ 
  "Unassinged","Submitter","Bill","James Robinson"
]


</script>
<style lang="scss" scoped="" type="text/css">
  @import './editList.scss';
</style>
 