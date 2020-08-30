<template>
    <div class="abilityUnit">
        <div class="abilityUnit_img">
            <img :src="abilityUnit.img">
        </div>
        <div class="abilityUnit_contain">
            <span class="fl">{{abilityUnit.name}}</span>
            <img :src="abilityUnit.icon" alt="">
        </div>
        
    </div>

</template>

<script>
export default {
    name: 'ability',
    props: ['abilityUnit']
}
</script>
<style lang="stylus">
    .abilityUnit
        background-color #fff
        display flex
        height 2.24rem
        line-height 2.24rem
        width 100%
        .abilityUnit_img
            height 2.24rem
            width 2.72rem
            padding  .32rem  0.48rem .32rem 0.64rem
            img 
                width 0.88rem
                border-radius 0.08rem
        .abilityUnit_contain
            height 100%
            width 90%
            font-size 0.68rem
            font-weight 400
            border-bottom .02rem solid #e5e5e5
            img
                margin-left 8.8rem
                height 0.56rem


                 
</style>