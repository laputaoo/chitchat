<template>
<div>
    <div class="GLhead">
        <div class="back">
            <img :src="require('../assets/chat4.gif')" @click="back()">
            <div class="middle">选择一个群</div>
        </div>
    </div> 
    <div class="GLmain" ref="GLmain">
        <div class="GLcontain">
            <div class="GLunit" v-for="(item,index) in groupList" :key="index" @click="exchange(index)">
                <div class="unit_left">
                    <img :src="require('../assets/'+ item.imgUrl)">
                </div>
                <div class="unit_right">
                    <span>{{item.name}}</span>
                    <i>{{'(' + item.num + ')'}}</i>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    mounted(){
        this.$refs.GLmain.style.height =  document.documentElement.clientHeight/(document.documentElement.clientWidth/15) - 2.56 +'rem'
        
    },
    methods: {
        back(){
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/chitchat')
        },
        exchange(index){
            let groupID = this.groupList[index]._id
            let groupName = this.groupList[index].name
            this.$router.push({path: '/groupChat',query: {groupID,groupName}})
        }
    },
    computed:{
        ...mapState(['groupList'])
    }
}
</script>
<style lang="stylus">
.GLhead
    height 1.88rem
    line-height 1.88rem
    margin 0 0.6rem
    font-weight 600
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
.GLmain
    overflow height 
    .GLunit
        background-color #fff
        display flex
        height 2.24rem
        width 100%
        &:active
            background-color #ddd
        .unit_left
            height 2.24rem
            width 2.72rem
            padding  0.32rem  0.48rem 0.32rem 0.64rem
            img 
                width 1.6rem
                border-radius .2rem
        .unit_right
            display flex
            height 100%
            width 100%
            line-height 2.24rem
            font-size 0.6rem
            font-weight 400
            border-bottom .02rem solid #e5e5e5
            i 
                font-style normal
                color #888
</style>