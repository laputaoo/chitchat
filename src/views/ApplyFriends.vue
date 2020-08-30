<template>
    <div class="af" ref="af">
        <div class="af_head">
            <div class="af_head_l">
                <img class="firstPic" :src="require('../assets/back.gif')" @click="back()">
            </div>
            <button class="af_head_r" @click="send()">发送</button>
        </div>
        <div class="af_content">
            <div class="af_title">
                申请添加朋友
            </div>
            <div class="af_msg">
                <span>发送添加朋友申请</span>
                <textarea maxlength="52" v-model="application"></textarea>
            </div>
            <div class="af_markname">
                <span>设置备注</span>
                <input type="text" v-model="markName">
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {reqApplyFriend} from '../api/index'
export default {
    data(){
        return{
            application: '', //申请词
            markName: ''     //备注
        } 
    },
    mounted: function(){
        this.$refs.af.style.height = document.documentElement.clientHeight/(document.documentElement.clientWidth/15)-0.73 +'rem'
        this.application = '我是'+ this.userInfo.nick_name
        this.markName = this.targetDetail.nick_name
    },
    computed: {
        ...mapState(['userInfo','targetDetail']),
    },
    methods: {
        back(){
            this.$router.go(-1)
        },
        async send(){
            //发送好友申请
            //1. 需要数据为用户ID，目标用户ID，申请词，备注名
            //2. 发送请求
            let {application,markName} = this
            let userID = this.userInfo._id
            let friendsID = this.targetDetail._id
            // console.log({userId,targetId,application,markName})
            let result = await reqApplyFriend({userID,friendsID,application,markName})
            if(result.code == 0){
                alert('发送成功')
            }else{
                alert('网络出错，请稍后重试')
            }
        }
    }
}
</script>
<style lang="stylus">
.af
    background-color #fff
.af_head
    display flex
    justify-content space-between
    padding .56rem
    align-items center
.af_head_l
    width .84rem
    height .84rem
    img 
        height 100%
        
.af_head_r
    outline none
    font-size .64rem
    width 2.28rem
    height 1.28rem
    color #fff
    font-weight 400
    letter-spacing .02rem
    border none
    border-radius 0.2rem
    background-color #07c160
.af_content
    padding 2rem
    display flex
    flex-direction column
    justify-content space-around
    height 16rem
.af_title
    font-size .72rem
    font-weight bold
.af_msg
    display flex
    flex-direction column
    align-items flex-start
    span
        color #808080
        font-size .56rem
    textarea
        width 100%
        height 3.84rem
        border none 
        resize none
        outline none
        background-color #f7f7f7 
        border-radius 0.4rem
        font-size .64rem
        padding .8rem
        margin 0.2rem 0 0 0
.af_markname
    display flex
    flex-direction column
    align-items flex-start
    span
        color #808080
        font-size .56rem
    input 
        margin 0.2rem 0 0 0
        width 100%
        height 2.24rem
        font-size 0.64rem
        background-color #f7f7f7 
        text-indent 1rem
        border-radius 0.4rem
</style>