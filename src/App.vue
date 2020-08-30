<template>
    <div id="app">
        <div class="state" :style="$route.meta.whiteBg ? {backgroundColor: '#fff'} : ''">
            <span>中国移动</span>
            <span>下午1:11</span>
            <span>31%电量</span>
        </div>
        <router-view></router-view>
        <FooterItem v-if="$route.meta.showFooter"/>
    </div>
</template>

<script>
import FooterItem from './components/FooterItem'
import { mapState } from 'vuex'
import {reqGroupDetail} from './api/index'
import time from '../public/time'

export default {
    data(){
        return {
            tip: 'haha'
        }
    },
    mounted(){
        console.log('app.vue  mounted')
        this.$store.dispatch('getUserInfo').then(
            ()=>{
                this.init()
                this.$socket.open()  
                this.$router.push('/chitchat')
            },
            ()=>{
                console.log('自动登录失败')
                this.$router.push('/login') 
            }
        )
    },
    components: {
        FooterItem
    },
    sockets:{
        getChat(msg){//这里的工作是当用户不在与目标用户的聊天室内时，拦截信息，并将新信息存入vuex，更改tip的值
            // console.log('msg.nick_name', msg.nick_name)
            console.log('全局拦截最新消息',msg)
            let chatMsg = JSON.parse(JSON.stringify(msg)) 
            let singleNews =JSON.parse(JSON.stringify(this.singleNews)) 
            if(chatMsg.userID != this.chatingTarget){/*这里userID即发送者ID，我是接受者，如果发送者ID等于当前聊天对象ID表明正在跟该目标聊天，反之，在其他页面或者和其他人的聊天中*/
                // alert('收到新消息')
                /*
                当收到新信息时，在lastNews中查找数组每一项的friendsID或userID是否等于msg.userID,
                如果等于，删除该条信息，然后在数组的顶部插入新信息
                */
                let index = singleNews.findIndex(function(item){
                    return item.userID == chatMsg.userID || item.friendsID == chatMsg.userID
                })
                console.log(index,'  index')
                if(index != -1){//说明singleNews中已经存在与该好友或者群的聊天记录，记录原来tip中的值，删除原来的信息，添加新信息到数组顶部，并将tip加一
                    let tip = singleNews[index].tip + 1  //记录原来tip中的值并加1
                    chatMsg.tip = tip                               //传入msg中
                    chatMsg.time = time.dateTime(chatMsg.time)
                    singleNews.splice(index,1)         //这里删除聊天记录，添加新信息到数组顶部
                    singleNews.unshift(chatMsg)
                    console.log('singleNews  splice-------------',singleNews)                     
                    this.$store.dispatch('updateSingleNews',{singleNews})  //必须在vuex中才能更新state中的值
                }else{//说明singleNews中不存在与该好友或者群的聊天记录，直接添加新信息到数组顶部
                    chatMsg.tip = 1   //设置tip
                    singleNews.unshift(chatMsg)
                    chatMsg.time = time.dateTime(chatMsg.time)
                    console.log('singleNews-------------',singleNews)
                    this.$store.dispatch('updateSingleNews',{singleNews})
                }
                
            }else{//此时正在与对方的聊天室内，将受到的消息传入vuex
                let index = singleNews.findIndex(function(item){
                    return item.userID == chatMsg.userID || item.friendsID == chatMsg.userID
                })
                console.log(index,'  index')
                if(index != -1){//说明lastNews中已经存在与该好友或者群的聊天记录，删除原来的信息，添加新信息到数组顶部，添加tip属性，并设置tip的值为0,替换imgUrl和nick_name
                    chatMsg.tip = 0                           //传入msg中
                    singleNews.splice(index,1)         //这里删除聊天记录，添加新信息到数组顶部
                    chatMsg.time = time.dateTime(chatMsg.time)
                    singleNews.unshift(chatMsg)
                    console.log('singleNews----------------',singleNews)
                    this.$store.dispatch('updateSingleNews',{singleNews})  //必须在vuex中才能更新state中的值
                }else{//说明lastNews中不存在与该好友或者群的聊天记录，直接添加新信息到数组顶部
                    chatMsg.tip = 0   //设置tip等于0
                    chatMsg.time = time.dateTime(chatMsg.time)
                    singleNews.unshift(chatMsg)
                    console.log('singleNews----------------',singleNews)
                    this.$store.dispatch('updateSingleNews',{singleNews})
                }
            }
        },
        async getGroupChat(msg){//这里的工作是当用户不在与目标用户的聊天室内时，拦截信息，并将新信息存入vuex，更改tip的值
            // console.log('msg.nick_name', msg.nick_name)
            // console.log('全局拦截最新消息',msg)
            let _id = msg.groupID
            let result = await reqGroupDetail({_id})
            if(result.code === 0){//获取群详情成功，这里只取群名和群头像
                msg.imgUrl = result.data.imgUrl
                msg.name = result.data.name
                let times = time.dateTime(msg.time)
                msg.time = times
                let groupNews =JSON.parse(JSON.stringify(this.groupNews)) 
                if(msg.groupID != this.chatingTarget){/*这里groupID即群ID，如果群ID等于当前聊天群ID表明正在跟该目标聊天，反之，在其他页面或者和其他人的聊天中*/
                    // alert('收到新消息')
                    /*
                    当收到新信息时，在groupNews中查找数组每一项的groupID是否等于msg.groupID,
                    如果等于，删除该条信息，然后在数组的顶部插入新信息
                    */
                    let index = groupNews.findIndex(function(item){
                        return item.groupID == msg.groupID
                    })
                    // console.log(index,'  index')
                    if(index != -1){//说明lastNews中已经存在与该好友或者群的聊天记录，记录原来tip中的值，删除原来的信息，添加新信息到数组顶部，并将tip加一
                        let tip = groupNews[index].tip + 1  //记录原来tip中的值并加1
                        msg.tip = tip                               //传入msg中
                        groupNews.splice(index,1)         //这里删除聊天记录，添加新信息到数组顶部
                        groupNews.unshift(msg)
                        // this.singleNews.splice(index,1)        //这里删除聊天记录，添加新信息到数组顶部
                        // console.log('groupNews',this.groupNews)
                        this.$store.dispatch('updateGroupNews',{groupNews})  //必须在vuex中才能更新state中的值
                    }else{//说明lastNews中不存在与该好友或者群的聊天记录，直接添加新信息到数组顶部
                        msg.tip = 1   //设置tip
                        groupNews.unshift(msg)
                        this.$store.dispatch('updateGroupNews',{groupNews})
                    }
                }else{//此时正在与对方的聊天室内，将受到的消息传入vuex
                    let index = groupNews.findIndex(function(item){
                        return item.groupID == msg.groupID
                    })
                    // console.log(index,'  index')
                    if(index != -1){//说明lastNews中已经存在与该好友或者群的聊天记录，删除原来的信息，添加新信息到数组顶部，添加tip属性，并设置tip的值为0,替换imgUrl和nick_name
                        msg.tip = 0                           //传入msg中
                        groupNews.splice(index,1)         //这里删除聊天记录，添加新信息到数组顶部
                        groupNews.unshift(msg)
                        console.log('groupNews',groupNews)
                        this.$store.dispatch('updateGroupNews',{groupNews})  //必须在vuex中才能更新state中的值
                    }else{//说明lastNews中不存在与该好友或者群的聊天记录，直接添加新信息到数组顶部
                        msg.tip = 0   //设置tip等于0
                        groupNews.unshift(msg)
                        this.$store.dispatch('updateGroupNews',{groupNews})
                    }
                }                
            }

        }
    },
    computed:{
        ...mapState(['chatingTarget','userInfo','singleNews','groupNews'])
    },
    methods: {
        init(){
            /*
            0.先查看localstorage，查看需要获取那些信息条目，如果没有，直接获取未读信息
            1.获取单聊最新信息
            2.获取群聊最新信息
            3.获取单聊未读消息数
            4.获取群聊未读消息数
            */ 
            // let userID = this.userInfo._id
            // console.log(userID)
            let result = localStorage.getItem(this.userInfo._id)
            let lastNews = JSON.parse(result)
            console.log('lastNews-------------',lastNews)
            if(result){//此处将localstorage中的值放入vuex中
                let groupNews = lastNews.groupNews
                let singleNews = lastNews.singleNews
                this.$store.dispatch('getGroup',{groupNews}) 
                this.$store.dispatch('getSingle',{singleNews})
            }
        },
    },
    watch: {
        singleNews(){
            let lastNews = {singleNews : this.singleNews,groupNews : this.groupNews}
            localStorage.setItem(this.userInfo._id,JSON.stringify(lastNews))
        },
        groupNews(){
            let lastNews = {singleNews : this.singleNews,groupNews : this.groupNews}
            localStorage.setItem(this.userInfo._id,JSON.stringify(lastNews))
        }
    }
}
</script>

<style lang="stylus">
#app
    -webkit-font-smoothing antialiased
    text-align center
    .state
        z-index 1
        display flex
        justify-content space-between
        padding 0.16rem 0.22rem 0 0.24rem
        background-color #eee
</style>