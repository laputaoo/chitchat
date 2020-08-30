<template>
<div>
    <div class="addfriend_title" :style="toggle ? [{marginTop: -1.9+'rem'},{opacity: 0}] : ''">
        <img :src="require('../assets/chat4.gif')" @click="back()">
        <div class="middle">新的朋友</div>
        <div class="title_right">添加朋友</div>
    </div>
    <div class="main">
        <div class="searchFriends">
            <img class="searchIcon" :src='require("../assets/search.gif")' :style="toggle ? {left: 0.8+'rem'} : ''">
            <input type="text" placeholder="微信号/手机号" @keyup.enter="search()" v-model="phone" @click="toggle = true"  :style="toggle ? [{width:84+'%'},{textIndent: 1.4+'rem'}]:''">
            <div class="cancel" @click="cancel()" :style="toggle ? {right: 0.4+'rem'} : ''">取消</div>
        </div>
        <div class="applyFriend_contain" v-show="!toggle">
            <div class="applyFriend" v-for="(item,index) in applyList" :key="index">
                <div class="applyFriend_l">
                    <div class="applyFriend_img">
                        <img :src="require('../assets/'+ item.friendInfo[0].imgUrl)" alt="">
                    </div>
                    <div class="applyFriend_msg">
                        <div class="applyFriend_name">{{item.friendInfo[0].nick_name}}</div>
                        <span>{{item.application}}</span>
                    </div>
                </div>
                <div class="applyFriend_r">
                    <button @click="look(item.friendsID)">查看</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {reqSearch,reqSearchApplyList,reqUserMsg} from '../api/index'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            toggle: false,
            phone: '',
            applyList: []
        }
    },
    mounted: function(){
        this.getApplyList()
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
        },
        async look(_id){
            console.log({_id})
            const result = await reqUserMsg({_id})
            if(result.code == 0){
                //搜索成功，将个人信息存入vuex中
                this.$store.dispatch('recordMsg',result.data)
                console.log(result.data)
                this.$router.push({path:'/details', query: { confirm: true}})
            }else{
                this.msg = '用户搜索出错'
                console.log('用户搜索出错')
            }
        },
        //获取好友请求列表
        async getApplyList(){
            let userID = this.userInfo._id
            let result = await reqSearchApplyList({userID})
            this.applyList = result.data
            console.log(this.applyList)
        }
    },
    computed: {
        ...mapState(['userInfo'])
    }


}
</script>
<style lang="stylus">
.title_right
    position absolute
    top 50%
    right 0
    transform translateY(-50%)
    font-size .64rem
    font-weight normal
.applyFriend_contain
    padding-left 0.4rem
    background-color #fff
.applyFriend
    display flex
    justify-content space-between
    align-items center
    height 2.4rem
    border-bottom 0.02rem solid #e5e5e5
.applyFriend_l
    flex-grow 1
    height 100%
    display flex
.applyFriend_img
    margin auto 0.32rem
    height 1.6rem
    width 1.6rem
    img
        height 100%
        width 100%
        border-radius 0.2rem
.applyFriend_msg
    flex-grow 1
    display flex
    flex-direction column
    margin 0.4rem 0.32rem 0.32rem 0.32rem
    justify-content space-between
    align-items flex-start
    .applyFriend_name
        font-size 0.68rem
    span 
        font-size 0.56rem
        color #808080

.applyFriend_r
    margin auto 0.64rem
    button 
        outline none
        padding 0.32rem 0.44rem
        background-color #f2f2f2
        color #20b667
        font-size 0.56rem
        border none
        border-radius 0.2rem
</style>