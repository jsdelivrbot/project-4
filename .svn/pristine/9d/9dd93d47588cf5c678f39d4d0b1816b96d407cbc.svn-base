<template>
  <div class="members">
    <div class="members-container">
        <div class="row">
            <div class="member invite col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="member-item">
                    <div class="item-circle circle-invite">
                        <i class="icon-plus-sign-thin"></i>
                    </div>
                    <div class="item-name">Invite members</div>
                </div>
            </div>
            <div class="member member-detail col-xs-3 col-sm-3 col-md-3 col-lg-3"
              v-for="(member,$index) in members">
                <div class="badge" v-if="$index == 0">Head Administrator</div>
                <div class="member-item">
                    <div
                      class="item-circle item-detail"
                      :class="member.mark"
                    >
                      {{ member.mark|uppercase }}
                    </div>
                    <div class="item-name">{{ member.name }}</div>
                    <div class="item-link">
                        <a href="#">{{ member.email }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    created(){
        this.uppercaseFilter();
    },
    data: function(){
      return {
        members: [
          { mark:'tj',name:'Terry Johnson',email:'TJohnson@techexcel.com'},
          { mark:'tz',name:'Tim Zero',email:'TZero@techexcel.com'},
          { mark:'jc',name:'Jimery Cook',email:'JCook@techexcel.com'},
          { mark:'ww',name:'William Wall',email:'WWall@techexcel.com'},
          { mark:'ph',name:'Phillips Hunt',email:'phunt@techexcel.com'},
          { mark:'jz',name:'John Zipoer',email:'jzipoer@techexcel.com'}
        ]
      }
    },
    methods: {
      uppercaseFilter: function(){//filter uppercase
          Vue.filter('uppercase', function(value) {
              if (!value) { return ''}
              value = value.toString()
              return value.toUpperCase();
          })
      }
    }
  }
</script>


<style lang="scss" scoped="" type="text/css">
  @import './members.scss';
  @import './../../../static/grid_media.css';
</style>
