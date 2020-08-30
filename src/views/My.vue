<template>
<div class="my">
    <div class="head">
        <div class="clearfix">
            <img src="../assets/picture_05.gif" alt="" class="camera">
        </div>
        <div class="profile">
            <img src="../assets/picture_06.gif" alt="" class="pic">
            <div class="userMsg">
                <span class="username">{{userInfo.nick_name}}</span>
                <div class="detail">
                    <span>微信号: wixd_vzouy2utf...</span>
                    <img src="../assets/picture_08.gif" alt="" class="icon">
                </div>
            </div>
        </div>
    </div>
    <div class="myInfo">
        <Ability
            v-for="(myInfo,index) in myInfos"
            :key = 'index'
            :abilityUnit = myInfo
        ></Ability>
    </div>

</div>
    
</template>

<script>
import Ability from '../components/Ability'
import {mapState} from 'vuex'
export default {
    components:{
        Ability
    },
    data(){
        return{
            myInfos: [
                {
                    img: require('../assets/picture_07.gif'),
                    name: '支付',
                    icon: require('../assets/picture_08.gif')
                },
                {
                    img: require('../assets/picture_09.gif'),
                    name: '收藏',
                    icon: require('../assets/picture_08.gif')
                },
                {
                    img: require('../assets/picture_10.gif'),
                    name: '相册',
                    icon: require('../assets/picture_08.gif')
                },
                {
                    img: require('../assets/picture_11.gif'),
                    name: '卡包',
                    icon: require('../assets/picture_08.gif')
                },
                {
                    img: require('../assets/picture_12.gif'),
                    name: '表情',
                    icon: require('../assets/picture_08.gif')
                },
                {
                    img: require('../assets/picture_13.gif'),
                    name: '设置',
                    icon: require('../assets/picture_08.gif')
                },

            ]
        }
    },
    computed: {
        ...mapState(['userInfo']),
    }
}
</script>
<style lang="stylus">
    .head
        height 7.96rem
        background-color #fff
        border-bottom .02rem solid d5d5d5
        margin-bottom .32rem
        .state
            display flex
            justify-content space-between
            padding .2rem .2rem 0 .2rem
        .camera
            float right
            height 0.64rem
            margin 0.72rem 0.72rem 1.72rem 0
        .profile
            display flex
            justify-content center
            height 2.56rem
            margin-bottom 1.72rem
            align-items center
            .pic
                height 2.56rem
            .userMsg
                height 100% 
                margin-left 0.8rem
                display flex
                flex-direction column
                justify-content space-around
                letter-spacing .02rem
                .username
                    font-size 0.88rem
                    text-align left 
                    font-weight 500
                .detail
                    color #aaa
                    font-size 0.64rem
                    img 
                        height 0.52rem
                        margin-left 1.44rem
                    
</style>