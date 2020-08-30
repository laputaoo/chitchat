<template>
<div class="container">
    <div class="header" :style="toggle ? [{marginTop: -1.9+'rem'},{opacity: 0}] : ''">
        <div class="title">
            <span class="header_title">通讯录</span>
            <i class="iconfont icon-icon_addperson" @click="addFriend()"></i>
        </div>
        <div class="line" v-show="scrollY"></div>
    </div>
    <div class="main" ref="main" :style="exchange ? {transform: `translateX(`+ -30 +`%)`} : ''">
        <div ref="unchange">
            <div class="search">
                <img class="searchIcon" :src='require("../assets/search.gif")' :style="toggle ? {left: 0.8+'rem'} : ''">
                <input type="text" placeholder="搜索" @click="toggle = true" v-model="search"  :style="toggle ? [{width:84+'%'},{textIndent: 1.4+'rem'}]:''">
                <div class="cancel" @click="chancel()" :style="toggle ? {right: 0.4+'rem'} : ''">取消</div>
            </div>
            <ul class="baseUnit" v-show="!toggle">
                <li class="unit_directores">
                    <div class="unit_directores_icon">
                        <img :src="require('../assets/UD01.gif')">
                    </div>
                    <div class="unit_directores_contain" @click="$router.push('/newfriends')">
                        <span class="fl">新的朋友</span>
                    </div>
                </li>
                <li class="unit_directores">
                    <div class="unit_directores_icon">
                        <img :src="require('../assets/UD02.gif')">
                    </div>
                    <div class="unit_directores_contain">
                        <span class="fl">群聊</span>
                    </div>
                </li>
                <li class="unit_directores">
                    <div class="unit_directores_icon">
                        <img :src="require('../assets/UD03.gif')">
                    </div>
                    <div class="unit_directores_contain">
                        <span class="fl">标签</span>
                    </div>
                </li>
                <li class="unit_directores">
                    <div class="unit_directores_icon">
                        <img :src="require('../assets/UD04.gif')">
                    </div>
                    <div class="unit_directores_contain">
                        <span class="fl">公众号</span>
                    </div>
                </li>
            </ul>
        </div>
        <ul ref="addressBook"  v-show="!toggle">
            <ul class="area" v-for="(friend,key,index) in friendList" :key="index" :class="{unfollow: index===currentIndex}">
                <div class="area_banner" :class="{follow: index===currentIndex}">{{key.toUpperCase()}}</div>
                <li class="unit_directores" v-for="(item,index) in friend" :key="index" @click="goToChatroom(item)">
                    <div class="unit_directores_icon">
                        <img :src="require('../assets/'+ item.imgUrl)">
                    </div>
                    <div class="unit_directores_contain">
                        <span class="fl">{{item.nick_name}}</span>
                    </div>
                </li>
            </ul>
        </ul>
        <ul class="fixed_banner" v-show="!toggle">
            <li class="unit_banner" v-for="(addressBook,key,index) in friendList" :key="index" :class="{active: index===currentIndex}" @click="moveTo(index)">
                <div class="unit_1">{{key.toUpperCase()}}
                    <div class="unit_2">
                        <div class="unit_3">{{key.toUpperCase()}}</div>
                    </div>
                </div>
                
            </li>
        </ul>
        <div class="searchContent"  v-show="toggle">
            <table>
                <caption class="tips">搜索指定内容</caption>
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
</div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data(){
        return {
            scrollY: 0,
            tops: [],
            toggle: false,
            exchange: false,
            search: '',
        }
    },
    mounted: function(){
        this.$store.dispatch('getFriendList',()=>{
            this.$nextTick(()=>{
                this._initTops()
            })
        })
        this.$refs.main.addEventListener('scroll',this.getScrollPosition,false)
        this.$refs.main.style.height = document.documentElement.clientHeight/(document.documentElement.clientWidth/15) - 4.8 +'rem'
    },
    // destroyed:function(){
    //     this.$refs.main.removeEventListener('scroll')
    // },
    methods: {
        getScrollPosition(){
                let scrollY = this.$refs.main.scrollTop
                // console.log('坐标',scrollY)
                this.scrollY = scrollY
        },
        //获得每个字母分类滚动条的位置
        _initTops(){
            //初始化Tops
            const tops = []
            const unchange =this.$refs.unchange
            let top = unchange.clientHeight
            tops.push(top)
            // console.log(tops)
            //获取所有分类
            const lis = this.$refs.addressBook.getElementsByClassName("area");
            lis.forEach(li => {
                top += li.clientHeight
                tops.push(top)
            });
            //更新数据
            this.tops = tops
        },
        moveTo(index){
            this.$refs.main.scrollTop = this.tops[index]
        },
        addFriend(){
            this.$router.push('/addfriends')
            this.exchange = !this.exchange
        },
        chancel(){
            this.toggle =false
            this.search = ''
        },
        goToChatroom(friendMsg){
            // console.log(friendMsg)
            let userMsg = this.userInfo
            let groupChat = false
            this.$router.push({path: '/chat',query:{friendMsg,userMsg,groupChat}})
        }
    },
    computed: {
        ...mapState(['userInfo','friendList']),
        currentIndex(){
            let {tops,scrollY} = this
            let index = tops.findIndex((top,index)=>{
                return scrollY >= top && scrollY < tops[index+1]
            })
            return index
        },
    }
}
</script>
<style lang="stylus">
.baseUnit
    border-top .02rem solid #e5e5e5
    height 8.96rem
    overflow hidden
.area_banner
    padding-left 0.64rem
    height 1.28rem
    width 100%
    background-color #ededed
    font-size 0.52rem
    color #777
    text-align left
    line-height 1.28rem
    border-top .02rem solid #e5e5e5
    border-bottom .02rem solid #d5d5d5
.follow
    position absolute
    top 2.56rem
    background-color #fff
    color #07c160
.unit_directores
    background-color #fff
    display flex
    height 2.24rem
    width 100%
    &:active
        background-color #ddd
    .unit_directores_icon
        height 2.24rem
        width 2.72rem
        padding  0.32rem  0.48rem 0.32rem 0.64rem
        img 
            width 1.6rem
            border-radius .2rem
    .unit_directores_contain
        height 100%
        width 100%
        line-height 2.24rem
        font-size 0.68rem
        font-weight 400
        border-bottom .02rem solid #e5e5e5
.unfollow
    padding-top 1.28rem
li:last-child
    .unit_directores_contain
        border-bottom  0
.fixed_banner
    position fixed
    top 25%
    right .12rem
    .unit_banner
        font-size 0.48rem
        margin .2rem 0
        width .6rem
        height .6rem
        color #555
        .unit_1
            line-height .6rem
            position relative
            &:active
                .unit_2
                    display block
            .unit_2
                display none
                position absolute
                color #fff
                top -0.45rem
                right 1.6rem
                width 1.6rem
                height 1.6rem
                line-height 1.6rem
                background-color #bbb
                font-size 1.2rem
                border-radius 50% 0 50% 50%
                transform rotate(45deg)
                .unit_3
                    transform rotate(-45deg)
    .active
        background-color #07c160
        border-radius 50%
        color #fff


</style>