<template>
<div class="container">
    <div class="header">
        <div class="CGtitle">
            <div class="fl" @click="cancel()">取消</div>
            <span class="header_title">选择联系人</span>
            <div class="complate fr">
                <button :class="selectedList.length ? 'enabled' : 'disabled'" @click="createGroup()">完成{{selectedList.length ? ('(' + selectedList.length + ')') : ''}}</button>
            </div>
        </div>
        <div class="muster">
            <div class="image" v-show="selectedList.length == 0">
                <img :src="require('../assets/search.gif')" alt="">            
            </div>
            <div class="list">
                <div class="item" v-for="(item,index) in selectedList" :key="index">
                    <img :src="require('../assets/' + item.imgUrl)" alt="">
                </div>
            </div>
            <input type="text" placeholder="搜索">
        </div>
    </div>
    <div class="main" ref="main">
        <div ref="unchange">
            <div class="selectGroup" @click="selectGroup()">
                <span>选择一个群</span>
                <img src="../assets/picture_08.gif" alt="" class="icon">
            </div>
        </div>
        <ul ref="addressBook">
            <ul class="area" v-for="(friend,key,index) in friendList" :key="index" :class="{unfollow: index===currentIndex}">
                <div class="area_bannerCG" :class="{followCG: index===currentIndex}">{{key.toUpperCase()}}</div>
                <li class="unit_CreateGroup" v-for="(item,index) in friend" :key="index" @click="addToList(key,index)">
                    <div class="tip">
                        <div class="circle">
                            <span>√</span>
                        </div>
                    </div>
                    <div class="unit_CreateGroup_icon">
                        <img :src="require('../assets/'+ item.imgUrl)">
                    </div>
                    <div class="unit_CreateGroup_contain">
                        <span class="fl">{{item.nick_name}}</span>
                    </div>
                </li>
            </ul>
        </ul>
        <ul class="fixed_banner">
            <li class="unit_banner" v-for="(addressBook,key,index) in friendList" :key="index" :class="{active: index===currentIndex}" @click="moveTo(index)">
                <div class="unit_1">{{key.toUpperCase()}}
                    <div class="unit_2">
                        <div class="unit_3">{{key.toUpperCase()}}</div>
                    </div>
                </div>  
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
import {reqCreateGroup} from '../api/index'
export default {
    data(){
        return {
            scrollY: 0,
            tops: [],
            selectedList: []
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
        cancel(){
            this.$router.go(-1)
        },
        addToList(key,index){
            let {friendList} = this
            let i = 0
            let circle = this.$refs.addressBook.getElementsByClassName("circle")
            // let keyIndex = this.friendList.indexof(key)
            for(let keyF in friendList){
                if(keyF == key){
                    // console.log(i+index)
                    let trueIndex = i + index //获取当前元素的index
                    // console.log(circle[trueIndex].style.backgroundColor == 'rgb(7, 201, 100)')
                    if(circle[trueIndex].style.backgroundColor == 'rgb(7, 201, 100)'){
                        circle[trueIndex].style.backgroundColor = "rgb(255, 255, 255)"
                        let list = this.selectedList.filter((item)=>{
                                return item._id != friendList[key][index]._id
                            }
                        )
                        this.selectedList = list
                    }else{
                        circle[trueIndex].style.backgroundColor = "rgb(7, 201, 100)"
                        this.selectedList.push(friendList[key][index])
                    }
                    return
                }
                i += friendList[keyF].length
                }
        },
        async createGroup(){
            let {selectedList} = this
            let selectedListMsg= selectedList.map((item)=>{
                return {_id : item._id,nick_name : item.nick_name}
            })
            console.log(selectedListMsg)
            let userMsg = {}
            userMsg._id = this.userInfo._id
            userMsg.nick_name = this.userInfo.nick_name
            // console.log(selectedListID,userID)
            if(selectedListMsg.length>0){
                let result = await reqCreateGroup({selectedListMsg,userMsg})
                if(result.code == 0){
                    console.log('群创建成功',result.data)
                    this.$router.push({path: '/groupChat',query: result.data})
                }else{
                    console.log('创建失败，该群已经存在')
                }
            }
        },
        selectGroup(){
            this.$store.dispatch('getGroupList')
            this.$router.push('GroupList')
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
.CGtitle
    margin auto 0.64rem
    position relative
    height 1.84rem
    line-height 1.84rem
    font-size 0.64rem
    .header_title
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        font-weight bold
    .complate
        line-height 1.84rem
        button
            outline none
            font-size 0.64rem
            letter-spacing 0.1rem
            border none
            padding 0.28rem 0.48rem
            color #fff
            border-radius 0.2rem
        .disabled
            background-color #ccc
        .enabled
            background-color #07c160
.muster
    height 2.24rem
    display flex
    width 100%
    background-color #fff
    border-bottom 0.04rem solid #eee
    padding-left 0.64rem
    .image
        width 1.6rem
        display flex
        justify-items center
        img 
            width 0.8rem
            height 0.8rem
            margin auto 0 auto
    .list
        display flex    
        height 2.2rem
        max-width 12rem
        .item
            display inline-block
            padding 0.32rem 0.48rem 0.28rem 0
            img 
                display block
                width 1.6rem
                height 1.6rem
                border-radius 0.2rem
    input
        min-width 2rem
        font-size 0.64rem
        &::placeholder
            color #888
            font-size 0.64rem
.selectGroup
    display flex
    justify-content space-between
    height 2.56rem
    width 100%
    background-color #fff
    padding 0 0.6rem
    font-size 0.68rem
    span 
        margin auto 0
        letter-spacing 0.04rem
    img 
        margin auto 0
        height 0.56rem
.area_bannerCG
    z-index 99
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
.followCG
    position absolute
    top 4.8rem
    background-color #fff
    color #07c160
.unit_CreateGroup
    background-color #fff
    display flex
    height 2.56rem
    width 100%
    .tip
        width 2.24rem
        height 2.56rem
        display flex
        .circle
            margin auto
            width 1rem
            height 1rem
            border 0.02rem solid #eeeeee
            border-radius 50%
            position relative
            span 
                display inline-block
                position absolute
                top 50%
                left 50%
                transform translate(-50%,-50%)
                color #fff
                font-size 0.56rem
                font-weight bolder
    .unit_CreateGroup_icon
        height 2.56rem
        width 2.08rem
        display flex
        img 
            width 1.6rem
            border-radius .2rem
            margin auto auto auto 0
    .unit_CreateGroup_contain
        height 100%
        flex-grow 1
        line-height 2.56rem
        font-size 0.68rem
        border-bottom .02rem solid #e5e5e5
.unfollow
    padding-top 1.28rem
li:last-child
    .unit_CreateGroup_contain
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