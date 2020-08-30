<template>
<div>
    <div class="topBanner">
        <img class="firstPic" :src="require('../assets/chat4.gif')" @click="back()">
        <span>{{this.$route.query.friendMsg.nick_name}}</span>
        <img class="secondPic" :src="require('../assets/chat5.gif')" alt="">
    </div>
    <div class="mainChat" ref="mainChat" @click="sign = false" :style="sign?{bottom: 11.76+'rem'} : {height: 21.92 + 'rem'}">
        <div class="chatContain" ref="chatContain" v-for="(item,index) in chatArea" :key="index">
            <div class="time">{{item.time? exchange(item.time): ''}}
            </div>
            <div class="chatUnitL" v-if="item.userID == friendsID">
                <div class="imgContain">
                    <img :src="require('../assets/'+ friendImg)"  alt="">
                </div>
                <div class="chatL">
                    <span>
                        {{item.message}}
                    </span>
                </div>
            </div>
            <div class="chatUnitR" v-if="item.userID == userID">
                <div class="imgContain">
                    <img :src="require('../assets/'+ userImg)" alt="">
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
import time from '../../public/timeChat'
export default {
    data(){
        return {
            message: '', //input输入
            chatArea: [],
            userID: '',
            friendsID: '',
            userImg: '',
            friendImg: '',
            total: 0,//聊天内容总高度
            page: 0, //获取第几页
            scrollY: '',
            firstIn: 1,
            // timer: 0,
            sign: false
        } 
    }, 
    created(){
        this.userID = this.$route.query.userMsg._id
        this.friendsID = this.$route.query.friendMsg._id
        this.userImg = this.$route.query.userMsg.imgUrl
        this.friendImg = this.$route.query.friendMsg.imgUrl
    },
    mounted(){
        //设置main的高度
        // console.log(this.$refs.foot_contain.clientHeight)
        this.$refs.mainChat.style.height = document.documentElement.clientHeight/(document.documentElement.clientWidth/15) - 3.68 +'rem'
        this.getChatMsg() //从后端获取聊天数据
        this.clearTip() //清除未读消息数
        this.$refs.mainChat.addEventListener('scroll',this.getScroll)
        this.$store.dispatch('recordChatingTarget',this.friendsID)
    },  
    methods: {
        back(){
            window.history.length == 0 ? this.$router.push('/chitchat') : this.$router.go(-1)
        },
        send(){
            let {userMsg,friendMsg} = this.$route.query
            let userID = userMsg._id
            let friendsID = friendMsg._id
            let message = this.message
            let nick_name = userMsg.nick_name
            let imgUrl = userMsg.imgUrl
            let types = '0'
            // let time = this.exchange(Date.now())
            let time = Date.now()
            let msg = {userID,friendsID,nick_name,imgUrl,message,types,time}
            if(message){
                console.log(message)
                this.$socket.emit('chat',msg)
                this.chatArea.push(msg)
                this.message = ''
            }
            /*
            当发送信息时，在lastNews中查找数组每一项的friendsID或userID是否等于msg.friendsID,
            如果等于，删除该条信息，然后在数组的顶部插入新信息
            */
            let newMsg = JSON.parse(JSON.stringify(msg))
            let singleNews =JSON.parse(JSON.stringify(this.singleNews)) 
            let index = singleNews.findIndex(function(item){
                return item.userID == msg.friendsID || item.friendsID == msg.friendsID
            })
            console.log(index,'  index')
            if(index != -1){//说明singleNews中已经存在与该好友或者群的聊天记录，删除原来的信息，添加新信息到数组顶部，添加tip属性，并设置tip的值为0,替换imgUrl和nick_name
                newMsg.imgUrl = this.friendImg
                newMsg.nick_name = this.$route.query.friendMsg.nick_name
                newMsg.time = this.exchange(newMsg.time)
                newMsg.tip = 0                           //传入msg中
                singleNews.splice(index,1)         //这里删除聊天记录，添加新信息到数组顶部
                singleNews.unshift(newMsg)
                console.log('singleNews',singleNews)
                this.$store.dispatch('updateSingleNews',{singleNews})  //必须在vuex中才能更新state中的值
            }else{//说明singleNews中不存在与该好友或者群的聊天记录，直接添加新信息到数组顶部
                newMsg.imgUrl = this.friendImg
                newMsg.nick_name = this.$route.query.friendMsg.nick_name
                newMsg.time = this.exchange(msg.time)
                newMsg.tip = 0   //设置tip等于0
                singleNews.unshift(newMsg)
                this.$store.dispatch('updateSingleNews',{singleNews})
            }
        },
        exchange(T){
            return time.dateTime(T)
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
            let {userID,friendsID,page,chatArea} = this
            if(chatArea.length > 0 && chatArea.length % 12 != 0){//聊天记录全拿完后停止发送请求
                console.log('到顶了')
                return
            }
            this.$store.dispatch('getChatMsg',{userID,friendsID,page})
        },
        change(){
            this.sign = true
            // this.$nextTick(()=>{
            this.moveToBottom()
            // })
        },
        clearTip(){
            let {userID,friendsID} = this
            this.$store.dispatch('clearTip',{userID,friendsID})
        }
    },
    watch: {
        chatMsg(){
            this.$nextTick(()=>{
                this.chatArea = this.chatMsg
            })
        },
        chatArea(){//监听聊天内容发生改变
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
        getChat(msg){
            console.log(msg)
            this.chatArea.push(msg)
            // console.log(this.chatArea)
            this.$nextTick(()=>{
                this.moveToBottom()
            })
            this.$socket.emit('readed',msg.msgID)
        }
    },
    computed: { 
        ...mapState(['chatMsg','singleNews']),
    },
    destroyed(){
        this.$store.dispatch('resetChatMsg')
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