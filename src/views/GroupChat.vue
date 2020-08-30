<template>
<div>
    <div class="topBanner">
        <img class="firstPic" :src="require('../assets/chat4.gif')" @click="back()">
        <span>{{this.$route.query.groupName}}</span>
        <img class="secondPic" :src="require('../assets/chat5.gif')" alt="">
    </div>
    <div class="mainChat" ref="mainChat" @click="sign = false" :style="sign?{bottom: 11.76+'rem'} : {height: 21.92 + 'rem'}">
        <div class="chatContain" ref="chatContain" v-for="(item,index) in groupChatArea" :key="index">
            <div class="time">{{item.time? exchange(item.time): ''}}
            </div>
            <div class="chatUnitL" v-if="item.userID != userInfo._id">
                <div class="imgContain">
                    <img :src="require('../assets/'+ item.imgUrl)"  alt="">
                </div>
                <div class="chatL">
                    <span>
                        {{item.message}}
                    </span>
                </div>
            </div>
            <div class="chatUnitR" v-if="item.userID == userInfo._id">
                <div class="imgContain">
                    <img :src="require('../assets/'+ item.imgUrl)" alt="">
                </div>
                <div class="chatR">
                    <span>
                        {{item.message}}         
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="foot_contain" ref="foot_contain" :style="sign?{top: 14.92 + 'rem'} : ''">
        <div class="foot">
            <img :src="require('../assets/chat1.gif')" alt="">
            <input type="text" v-model="message" @keyup.enter="send()" @click="change()">
            <img :src="require('../assets/chat2.gif')" alt="">
            <img :src="require('../assets/chat3.gif')" alt="" @click="change()">
        </div>
        <div class="fadeContent">
            <div class="moreAbility">
                <div class="funCell">
                    <img :src="require('../assets/picture.png')" alt="">
                    <span>照片</span>
                </div>
                <div class="funCell">
                    <img :src="require('../assets/camera.png')" alt="">
                    <span>拍摄</span>
                </div>
                <div class="funCell">
                    <img :src="require('../assets/vedio.png')" alt="">
                    <span>视频通话</span>
                </div>
                <div class="funCell">
                    <img :src="require('../assets/position.png')" alt="">
                    <span>位置</span>
                </div>
                <div class="funCell">
                    <img :src="require('../assets/redBag.png')" alt="">
                    <span>红包</span>
                </div>
                <div class="funCell">
                    <img :src="require('../assets/cash.png')" alt="">
                    <span>转账</span>
                </div>
                <div class="funCell">
                    <img :src="require('../assets/audio.png')" alt="">
                    <span>语音输入</span>
                </div>
            </div>
        </div>
        
    </div>
</div>
</template>
<script>
import {mapState} from 'vuex'
import timer from '../../public/timeChat'
export default {
    data(){
        return {
            message: '', //input输入
            groupChatArea: [],
            groupID: '',
            name: '',
            total: 0,//聊天内容总高度
            page: 0, //获取第几页
            scrollY: '',
            firstIn: 1,
            sign: false
        } 
    }, 
    created(){
        this.groupID = this.$route.query.groupID
        this.name = this.$route.query.groupName
    },
    mounted(){
        //设置main的高度
        // console.log(this.$refs.foot_contain.clientHeight)
        this.$refs.mainChat.style.height = document.documentElement.clientHeight/(document.documentElement.clientWidth/15) - 3.68 +'rem'
        this.getChatMsg()
        this.clearGroupTip() //清除未读消息数
        this.$refs.mainChat.addEventListener('scroll',this.getScroll)
        this.$store.dispatch('recordChatingTarget',this.groupID)
    },  
    methods: {
        back(){
            window.history.length == 0 ? this.$router.push('/chitchat') : this.$router.go(-1)
        },
        async send(){
            let {groupID} = this
            let userID = this.userInfo._id
            let imgUrl = this.userInfo.imgUrl
            let message = this.message
            let types = '0'
            let time = new Date()
            let msg
            msg = {userID,groupID,message,types,time,imgUrl}
            if(message){
                this.$socket.emit('groupChat',msg)
                this.message = ''
            }
        },
        exchange(T){
            return timer.dateTime(T)
        },
        getChatAreaH(){
            if(this.$refs.chatContain){//判断是否有聊天记录
                this.total = this.$refs.chatContain.reduce((total,num)=>{              
                    return total + parseInt(num.clientHeight)
                },0)
            }
            // console.log(total)
        },
        moveToBottom(){
            this.getChatAreaH() // 获取聊天内容高度
            // this.$refs.mainChat.scrollTop = this.total //聊天区域的高度是21.88rem
            this.$refs.mainChat.scrollTo({top: this.total,left: 0,behavior: 'smooth'})
            // console.log(this.total)
            // console.log('moveToBottom')       
        },
        notMove(){//获取page*12个聊天记录的长度
            //获取更新后聊天记录的位置 
            let newLength = this.$refs.chatContain.length
            // console.log(newLength)
            let length = newLength - this.page * 12 
            // console.log(length)
            let arr = this.$refs.chatContain.slice(0,length)
            // console.log(arr)
            let total = arr.reduce((total,num)=>{
                return total + parseInt(num.clientHeight)
            },0)
            // console.log(total)
            // this.$refs.mainChat.scrollTop = total
            this.$refs.mainChat.scrollTo({top: total,left: 0,behavior: 'instant'})
        },
        getScroll(){
            let scrollY = this.$refs.mainChat.scrollTop
            this.scrollY = scrollY
            if(scrollY == 0){
                this.page += 1
                this.getChatMsg()
            }
        },
        getChatMsg(){
            let {groupID,page,groupChatArea} = this
            if(groupChatArea.length > 0 && groupChatArea.length % 12 != 0){//聊天记录全拿完后停止发送请求
                console.log('到顶了')
                return
            }
            this.$store.dispatch('getGroupChatMsg',{groupID,page})
        },
        change(){
            this.sign = true
            this.moveToBottom()
        },
        clearGroupTip(){
            let {groupID} = this
            this.$store.dispatch('clearGroupTip',{groupID})
        }
    },
    watch: {
        groupChatMsg(){
            this.$nextTick(()=>{
                this.groupChatArea = this.groupChatMsg
            })
        },
        groupChatArea(){//监听聊天内容发生改变
            if(this.firstIn || this.scrollY > 0){//第一次进入聊天页面,或者发送聊天信息接收时
                this.$nextTick(()=>{
                    // console.log('change')
                    this.moveToBottom()
                })
                this.firstIn = 0
            }
            if(this.scrollY == 0){//滑到顶部触发内容更新时
                this.$nextTick(()=>{
                    // console.log('notmove')
                    this.notMove()
                    })}
        },
        sign(){
            if(this.sign == true){
                this.$refs.mainChat.style.height = 12.32 + 'rem'
                // console.log(this.$refs.mainChat.style.height)
            }
        }
    },
    sockets:{
        getGroupChat(msg){
            // console.log(msg)
            let message = JSON.parse(JSON.stringify(msg))
            this.groupChatArea.push(message)            
            // console.log(this.chatArea)
            this.$nextTick(()=>{
                this.moveToBottom()
            })
        }
    },
    computed: {
        ...mapState(['groupChatMsg','userInfo','groupNews']),
    },
    destroyed(){
        this.$store.dispatch('resetGroupChatMsg')
    }
}
</script>
<style lang="stylus">
.topBanner
    display flex
    justify-content space-between
    align-items center
    height 1.88rem
    border-bottom 0.02rem solid #d5d5d5
    padding 0 0.6rem
    background-color #eee
    span 
        font-size .64rem
    img 
        height 0.64rem
        width 0.72rem
.mainChat
    z-index -1
    max-height 21.92rem
    position absolute
    bottom 2.16rem
    right 0
    left 0
    transition all 0.3s ease
    overflow scroll
.time
    font-size 0.48rem
    color #999
    padding 0.48rem 0
.chatContain
    width 100%
    .chatUnitL
        display flex
        .chatL
            font-size 0.64rem
            span 
                position relative
                margin-right 3rem
                top 50%
                transform translateY(-50%)
                display inline-block
                background-color #fff
                padding 0.3rem 0.5rem
                border-radius 0.2rem
    .chatUnitR
        display flex
        flex-direction row-reverse
        .chatR
            font-size 0.64rem
            span 
                position relative
                margin-left 3rem
                top 50%
                transform translateY(-50%)
                display inline-block
                background-color #95ec69
                padding 0.3rem 0.5rem
                border-radius 0.2rem
.imgContain
            height 1.64rem
            width 1.64rem
            margin 0 0.48rem
            img 
                height 100%
.foot_contain
    position absolute
    left 0
    top 24.5rem
    border-top 0.02rem solid #dddddd
    width 100%
    transition top 0.3s ease
    .foot
        height 2.24rem
        padding-top 0.08rem
        display flex
        width 100%
        justify-content space-around
        align-items center
        height 2.16rem
        background-color #f7f7f7
        img 
            height 1.08rem
        input   
            height 1.6rem
            width 9.6rem
            border-radius .3rem
            font-size 0.8rem
    .fadeContent
        width 100%
        height 9.6rem
        background-color #f6f6f6
.moreAbility
    display flex
    flex-wrap wrap
    margin 0 0.4rem
.funCell
    margin 0.48rem
    display flex
    flex-direction column
    justify-content space-around
    img
        width 2.56rem
        height 2.56rem
        margin-bottom 0.3rem
    span 
        color #888
        font-size 0.48rem

</style>