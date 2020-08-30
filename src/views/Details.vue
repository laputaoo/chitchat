<template>
<div>
    <div class="detailBanner">
        <img class="back" :src="require('../assets/back.gif')" alt="" @click="back()">
        <img class="secondPic" :src="require('../assets/other.gif')" alt="">
    </div>
    <div class="detail_head">
        <div class="detail_banner">
            <div class="detail_img">
                <img :src="require('../assets/chitchat_01.gif')" alt="">
            </div>
            <div class="detail_msg">
                <div class="detail_name">{{(targetDetail.state == 2)? userInfo.nick_name : targetDetail.nick_name}}</div>
                <img :src="require('../assets/profile.gif')" alt="">
                <span>地区:  江苏 南京</span>
            </div>
        </div>
        <div class="detail_remarks" v-if="targetDetail.state != 2">
            <span>备注和标签</span>
            <input type="text" v-model="markName">
        </div>
    </div>
    <div class="detail_contain">
        <div class="detail_content">
            <div class="detail_more_right">
                <div>个性签名</div>
            </div>
            <span>要访问此窗口，请按照本主题的“备注”部分中的说明进行。要访问此窗口，请按照本主题的“备注”部分中的说明进行。要访问此窗口，</span>
        </div>
        <div class="detail_content">
            <div class="detail_more_right">
                <div>来源</div>
            </div>
            <span>来自手机号搜索</span>
        </div>
        <div class="detail_content">
            <div class="detail_more_right">
                <div>更多信息</div>
            </div>
            <div class="detail_more">
                <span>呵呵</span>
                <img :src="require('../assets/picture_08.gif')" alt="">
            </div>
        </div>
    </div>
    <!-- state为0表示不是好友，1为是好友, 2是自己 -->
    <div class="add_friend" v-if="!targetDetail.state && !this.$route.query.confirm">
        <span @click="addFriend()">添加到通讯录</span>
    </div>
    <div class="add_friend" v-if="this.$route.query.confirm">
        <span @click="confirmFriend()">确认并添加好友</span>
    </div>
</div>   
</template>
<script>
import {mapState} from 'vuex'
import {reqAddFriend} from '../api/index'
export default {
    data(){
        return{
            markName: ''
        }
    },
    mounted(){
        this.markName = this.targetDetail.nick_name
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        addFriend(){
            this.$router.push('applyfriends')
        },
        async confirmFriend(){
            let friendsID = this.targetDetail._id
            let userID = this.userInfo._id
            let {markName} = this
            console.log({userID,friendsID,markName})
            const result = await reqAddFriend({userID,friendsID,markName})
            if(result.code == 0){
                //已加为好友
                console.log('已加为好友')
                alert('已加为好友')
            }else{
                console.log('网络出错')
            }
        }
    },
    computed: {
        ...mapState(['targetDetail','userInfo'])
    }
}
</script>

<style lang="stylus">
.detailBanner
    display flex
    justify-content space-between
    align-items center
    height 1.88rem
    padding 0 0.6rem
    background-color #fff
    img 
        height 0.64rem
        width 0.72rem
.detail_head
    width 100%
    background-color #fff
    .detail_banner
        height 4.16rem
        margin-left 0.6rem
        display flex
        align-items center
        border-bottom 0.02rem solid #e5e5e5
        padding-bottom 1.4rem
        .detail_img
            height 2.56rem
            width 2.56rem
            margin 0 0.56rem
            img 
                height 100%
                width 100%
        .detail_msg
            height 100%
            padding 0 0.3rem
            display flex
            justify-content space-around
            flex-direction column
            text-align left 
            .detail_name 
                font-size .72rem
                font-weight 600
            img 
                width 0.68rem
                height 0.68rem
            span 
                color #808080
                font-size .56rem
    .detail_remarks
        display flex
        height 2.22rem
        line-height 2.22rem
        padding 0 0.6rem
        justify-content space-between
        align-items center
        border-bottom 0.02rem solid #e5e5e5
        span 
            font-size 0.64rem
            letter-spacing 0.02rem
            margin-right 0.4rem
        input 
            flex-grow 1
            font-size .68rem
            color #808080
.detail_contain
    margin 0.32rem 0
    background-color #fff
    padding-left 0.68rem
    .detail_content
        padding 0.64rem 0.64rem 0.64rem 0
        display flex
        font-size 0.68rem
        text-align left 
        border-bottom 0.02rem solid #e3e3e3
        &:nth-child(3)
            border none
        .detail_more_right
            width 2.72rem
            display flex
            align-items center
        span 
            width 80%
            padding-left 0.88rem
            color #808080
        .detail_more
            display flex
            justify-content space-between
            width 80%
            align-items center
            img 
                height 0.58rem
        
.add_friend
    height 2.24rem
    width 100%
    display flex
    justify-content center
    align-items center
    background-color #fff
    span 
        font-size 0.68rem
        font-weight 600
        letter-spacing 0.02rem
        color #60739a
</style>