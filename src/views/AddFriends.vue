<template>
<div>
    <div class="addfriend_title" :style="toggle ? [{marginTop: -1.9+'rem'},{opacity: 0}] : ''">
        <img :src="require('../assets/chat4.gif')" @click="back()">
        <div class="middle">添加朋友</div>
    </div>
    <div class="main">
        <div class="searchFriends">
            <img class="searchIcon" :src='require("../assets/search.gif")' :style="toggle ? {left: 0.8+'rem'} : ''">
            <input type="text" placeholder="微信号/手机号" @keyup.enter="search()" v-model="phone" @click="toggle = true"  :style="toggle ? [{width:84+'%'},{textIndent: 1.4+'rem'}]:''">
            <div class="cancel" @click="cancel()" :style="toggle ? {right: 0.4+'rem'} : ''">取消</div>
        </div>
        <div class="search_content" v-show="!toggle">
            <span>我的微信号: ksajdhfiuwahsdhf</span>
        </div>
        <div>
            {{msg}}
        </div>
    </div>
</div>
</template>
<script>
import {reqSearch} from '../api/index'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            toggle: false,
            phone: '',
            msg: '',
        }
    },
    methods: {
        back(){
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/chitchat')
        },
        cancel(){
            this.toggle = false
            this.phone = ''
        },
        async search(){
            const {phone} = this
            let userID = this.userInfo._id
            const result = await reqSearch({phone,userID})
            if(result.code == 0){
                //搜索成功，将个人信息存入vuex中
                this.$store.dispatch('recordMsg',result.data)
                console.log(result.data)
                this.$router.push('/details')
            }else{
                this.msg = '未搜索到该用户'
                console.log('未搜索到该用户')
            }
        }
    },
    computed: {
        ...mapState(['userInfo'])
    }


}
</script>
<style lang="stylus">
.addfriend_title
    height 1.88rem
    line-height 1.88rem
    margin 0 0.6rem
    font-weight 600
    transition all .5s ease
    position relative
    img
        position absolute
        left 0
        top 50%
        transform translateY(-50%)
        height 0.64rem
    .middle
        position absolute
        left 50%
        top 50%
        transform translate(-50%,-50%)
        font-size .64rem
.searchFriends
    overflow hidden
    position relative
    background-color #efefef
    width 100%
    height 2.24rem
    padding 0.4rem 0
    border-bottom 0.02rem
    img 
        position absolute
        z-index 1
        top 0.8rem
        left 34%
        width 0.64rem
        transition all 0.5s ease
    input
        float left
        margin-left 0.3rem
        width 95%
        height 1.44rem
        border-radius 0.16rem
        text-indent 40%
        text-align left
        font-size 0.64rem
        transition all .5s ease
        letter-spacing .02rem
        &::placeholder
            color #999
    .cancel
        position absolute
        right -1.4rem
        height 1.44rem
        line-height 1.44rem
        font-size 0.64rem
        color #576b95
        transition all .5s ease
.search_content
    margin-top .3rem
    font-size 0.64rem
  
    
</style>