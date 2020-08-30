<template>
<div class="register" ref="register">
    <div class="cancel">
        <p @click="$router.back()">取消</p>
    </div>
    <div class="register_content">
        <span>用手机号注册</span>
        <img src="../assets/头像.jpg" alt="">
        <div>
            <section class="form_item">
                <label for="nick_name" class="label_sty">昵称</label><input type="text" id="nick_name" v-model="nick_name">
            </section>
            <section class="form_item">
                <label for="phone" class="label_sty">手机号</label><input type="text" id="phone" v-model="phone">
            </section>
            <section class="form_item">
                <label for="password" class="label_sty">密码</label><input type="password" id="password" v-model="password">
            </section>
        </div>
        
        <div class="form_ok">
            我已阅读并同意<a href="#">《微信软件许可及服务协议》</a>
            <button @click="submit()">注册</button>
        </div>
    </div>  
</div>
    
</template>

<script>
import {reqPwdRegister} from '../api/index'
export default {
    data(){
        return {
            nick_name: '',
            phone: '',
            password: ''
        }
    },
    mounted: function(){
        this.$refs.register.style.height = document.documentElement.clientHeight/(document.documentElement.clientWidth/15)-0.72 +'rem'
    },
    methods: {
        async submit(){
            let {nick_name,phone,password} = this
            //验证输入合法性
            if(!nick_name){
                //用户名必须输入
                alert('用户名必须输入')
                return
            }else if(!/^1\d{10}$/.test(phone)){
                //手机号不正确
                alert('手机号不正确')
                return
            }else if(!password){
                //密码必须输入
                alert('密码必须输入')
                return
            }
            const result = await reqPwdRegister({nick_name,phone,password})
            if(result.code === 0){
                const user = {nick_name,phone,password}
                this.$store.dispatch('recordUser',user)
                this.$router.replace('/Chitchat')
            }
        },
    }
}
</script>

<style lang="stylus">
.register
    width 100%
    padding 0.4rem
    background-color #fff
    .state
        display flex
        justify-content space-between
    .cancel
        margin 0.8rem 0 
        font-size 0.64rem
        color green
        text-align left
    .register_content
        height 16rem
        width 90%
        margin 0 auto
        display flex
        justify-content space-between
        flex-direction column
        span 
            font-size 0.8rem
        img
            margin 0 auto
            height 2.2rem
            width 2.2rem
        .form_item
            padding .32rem
            font-size 0.64rem
            text-align left
            border-bottom .02rem solid #eee
            .label_sty
                display inline-block
                width 3rem
            input 
                line-height 0.84rem
                font-size 0.64rem
        .form_ok
            margin-top 1.6rem
            a
                color purple
            button 
                width 96%
                height 1.6rem
                color #fff
                border none
                border-radius .2rem
                background-color #57be6a
                margin-top 0.4rem
                font-size 0.64rem
</style>