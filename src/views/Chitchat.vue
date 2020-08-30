<template>
    <div>
        <div class="header" :style="toggle ? [{marginTop: -1.9+'rem'},{opacity: 0}] : ''">
            <div class="title">
                <span class="header_title">微信</span>
                <i class="iconfont icon-icon_im_more" @click="changeS = !changeS"></i>
                <transition name="fade">
                    <div class="fixed_banner" v-show="changeS">
                        <ul>
                            <li @click="createGroup()"><img :src="require('../assets/sign1.gif')" alt=""><span>发起群聊</span></li>
                            <li @click="addFriend()"><img :src="require('../assets/sign2.gif')" alt=""><span>添加朋友</span></li>
                            <li><img :src="require('../assets/sign3.gif')" alt=""><span>扫一扫</span></li>
                            <li><img :src="require('../assets/sign4.gif')" alt=""><span class="last_child">收付款</span></li>
                        </ul>
                    </div>
                </transition>
            </div>
            <div class="line" v-show="top"></div>
        </div>
        <div class="main" ref="main">
            <div class="search">
                <img class="searchIcon" :src='require("../assets/search.gif")' :style="toggle ? {left: 0.8+'rem'} : ''">
                <input type="text" placeholder="搜索" @click="toggle = true" v-model="search"  :style="toggle ? [{width:84+'%'},{textIndent: 1.4+'rem'}]:''">
                <div class="cancel" @click="chancel()" :style="toggle ? {right: 0.4+'rem'} : ''">取消</div>
            </div>
            <div class="content" v-for="(item,index) in singleNews" :key="index" v-show="!toggle" @click="exchangeToSingle(index)">
                <div class="unit_icon">
                    <img :src='require("../assets/"+item.imgUrl)' alt="p1">
                    <div class="tipsContain" v-if="item.tip">
                        <div>{{item.tip}}</div>
                    </div>                    
                </div>
                <div class="unit_contain">
                    <div class="little_group">
                        <span class="unit_who fl ellipsis">{{item.nick_name}}</span>
                        <span class="unit_time fr">{{item.time}}</span>
                    </div>
                    <span class="unit_content">{{item.message}}</span>
                </div>
            </div>
            <div class="content" v-for="(item,index) in groupNews" :key="'group' + index" v-show="!toggle" @click="exchangeToGroup(index)">
                <div class="unit_icon">
                    <img :src='require("../assets/"+item.imgUrl)' alt="p1">
                    <div class="tipsContain" v-if="item.tip">
                        <div>{{item.tip}}</div>
                    </div>                    
                </div>
                <div class="unit_contain">
                    <div class="little_group">
                        <span class="unit_who fl ellipsis">{{item.name}}</span>
                        <span class="unit_time fr">{{item.time}}</span>
                    </div>
                    <span class="unit_content">{{item.message}}</span>
                </div>
            </div>
            <div class="searchContent"  v-show="toggle">
                <table>
                    <caption>搜索指定内容</caption>
                    <tr>
                        <td>朋友圈</td>
                        <td>文章</td>
                        <td>公众号</td>
                    </tr>
                    <tr>
                        <td>小程序</td>
                        <td>音乐</td>
                        <td>表情</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="fade_click" ref="fade_click" @click="changeS = false" v-show="changeS"></div>
    </div>
</template>

<script>
// import datas from '../../public/datas'
import time from '../../public/time'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            friends: [],
            nTime: '',
            top: 0,
            search: '',
            toggle: false,
            changeS: false,
            exchange: false
        }
    },
    mounted: function() {
        this.getTime()
        this.$refs.main.addEventListener('scroll',this.getScrollPosition,false)
        this.$refs.main.style.height =  document.documentElement.clientHeight/(document.documentElement.clientWidth/15) - 4.8 +'rem'
        this.$refs.fade_click.style.height =  document.documentElement.clientHeight/(document.documentElement.clientWidth/15) - 4.8 +'rem'
    },
    distroy:function(){
        this.$refs.main.removeEventListener('scroll')
    },
    methods: {
        getTime(){
            let now = new Date()
            this.nTime = time.dateTime(now)
        },
        getScrollPosition(){
            let top = this.$refs.main.scrollTop
            this.top = top
        },
        addFriend(){
            this.$router.push('/addfriends')
            this.exchange = !this.exchange
        },
        chancel(){
            this.toggle =false
            this.search = ''
        },
        createGroup(){
            this.$router.push('/creategroup')
            this.exchange = !this.exchange
        },
        exchangeToSingle(index){//转去单聊页面
            let {singleNews,userInfo} = this
            let imgUrl = singleNews[index].imgUrl
            let nick_name = singleNews[index].nick_name
            let _id
            if(singleNews[index].userID == userInfo._id){//这里的_id需要判断,因为最新信息用户有可能是发送方，也有可能是接收方
                _id = singleNews[index].friendsID
            }else{
                _id = singleNews[index].userID
            }
            let friendMsg = {imgUrl,nick_name,_id}
            let userMsg = userInfo
            this.$router.push({path: '/chat',query:{friendMsg,userMsg}})
        },
        exchangeToGroup(index){//转去群聊页面
            let {groupNews} = this
            let groupID = groupNews[index].groupID
            let groupName = groupNews[index].name
            this.$router.push({path: '/groupchat',query:{groupID,groupName}})
        }
    },
    sockets: {
        connect(){
            console.log(this.userInfo._id + 'websocket已连接')
            this.$socket.emit('login',this.userInfo._id)
        },
        disconnect(){
            console.log('断开连接')
        },
    },
    computed:{
        ...mapState(['userInfo','singleNews','groupNews'])
    },
}
</script>

<style lang="stylus">
.header
    transition all .5s ease
    .title
        position relative
        line-height 0.8rem
        padding 0.6rem 0 0.36rem 0
        .header_title
            font-size 0.64rem
            font-weight 600
            letter-spacing 0.02rem
        i 
            position absolute
            right 0.72rem
            font-size 0.8rem
        .fixed_banner
            position fixed
            z-index 99
            top 2.76rem
            right .3rem
            width 6.4rem 
            height 9rem
            border-radius .2rem
            box-shadow 0 0 0.2rem #4c4c4c
            background-color #4c4c4c
            ul
                height 9rem
                display flex
                flex-direction column
                justify-content space-around
                li
                    display flex
                    justify-content center
                    text-align left
                    height 2.2rem
                    line-height 2.2rem
                    font-size .64rem
                    color #fff
                    &:active
                        background-color #5e5e5e
                    img 
                        height .88rem
                        margin auto .5rem auto 1rem
                    span 
                        width 100%
                        border-bottom .02rem solid #5e5e5e
                    .last_child
                        border none
    .line 
        border-bottom .02rem solid #d5d5d5
.main
    overflow scroll
    transition transform .4s ease
    .search
        overflow hidden
        position relative
        background-color #efefef
        width 100%
        height 2.24rem
        padding 0.38rem 0
        border-bottom 0.02rem solid #ebebeb
        img 
            position absolute
            z-index 1
            top 0.8rem
            left 41.5%
            width 0.64rem
            transition all 0.5s ease
        input
            float left
            margin-left 0.3rem
            width 95%
            height 1.44rem
            border-radius 0.16rem
            text-indent 47.6%
            text-align left
            font-size 0.64rem
            transition all .5s ease
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
    .content
        background-color #fff
        display flex
        height 2.88rem
        width 100%
        &:active{
            background-color #ddd
        }
        .unit_icon
            width 19.2%
            padding 0.48rem 0.48rem 0.48rem 0.64rem
            position relative
            img 
                width 1.92rem
                border-radius .2rem
            .tipsContain
                position absolute
                z-index 10
                top 0.26rem
                right 0.16rem
                width 0.68rem
                height 0.68rem
                line-height 0.68rem
                border-radius 50%
                background-color #fa5151
                color #fff
        .unit_contain
            display flex
            flex-direction column
            justify-content space-around
            height 2.88rem
            width 80.8%
            padding 0.4rem 0.64rem 0.4rem 0
            border-bottom .02rem solid #e5e5e5
            .little_group
                .unit_who
                    width 8rem
                    text-align left
                    font-size 0.64rem
                    font-weight 400
                .unit_time
                    color #ccc
                    font-size 0.48rem
            .unit_content
                text-align left
                width 95%
                white-space: nowrap;
                overflow hidden
                text-overflow: ellipsis;
                bottom 0.56rem
                font-size 0.56rem
                color #aaa  
    .searchContent
        width 100%
        table
            text-align left 
            margin 1rem auto
            caption
                color #999
                font-size .5rem
                margin-bottom 1rem
            td
                display inline-block
                padding 0 1.2rem 0 1.2rem
                margin-bottom 1rem
                font-size .6rem
                font-weight normal
                color #576b95
                &:nth-child(2)
                    border-left .02rem solid #000
                    border-right  .02rem solid #000
.fade_click
    position fixed
    top 2.64rem
    width 100%
    z-index 98
.fade-leave-active
    transition all .2s ease
.fade-enter, .fade-leave-to
    transform translate(.5rem,-1rem) scale(0.8)
    opacity 0

</style>