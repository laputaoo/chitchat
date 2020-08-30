<template>
    <div id="footer_item">
            <div class="guide_item">
                <span class="item" :class="{on: '/chitchat'=== $route.path}" @click="goTo('/chitchat')">
                    <i class="iconfont icon-icon_sms"></i>
                    <span>微信</span>
                </span> 
                <span class="item" :class="{on: '/directories'=== $route.path}" @click="goTo('/directories')">
                    <i class="iconfont icon-icon_group"></i>
                    <span>通讯录</span>
                </span> 
                <span class="item" :class="{on: '/discover'=== $route.path}" @click="goTo('/discover')">
                    <i class="iconfont icon-faxian"></i>
                    <span>发现</span>
                </span> 
                <span class="item" :class="{on: '/my'=== $route.path}" @click="goTo('/my')">
                    <i class="iconfont icon-icon_signal"></i>
                    <span>我</span>
                </span> 
            </div>
        </div>
</template>

<script>
export default {
    methods: {
        goTo(path){
            this.$router.replace(path)
        }
    }
}
</script>

<style lang="stylus">
#footer_item
    position fixed
    left 0
    right 0
    bottom 0
    height 2.24rem
    background-color #f5f5f5 
    .guide_item
        display flex
        justify-content space-around
        .item
            display flex
            flex-direction column
            padding 0 0.8rem
            i
                padding-top .32rem
                font-size 0.96rem

</style>