<template>
<div class="login" ref="login">
    <div class="login_content">
        <span>微信账号登录</span>
        <div>
            <section class="form_item">
                <label for="phone" class="label_sty">手机号</label><input type="text" id="phone" v-model="phone">
            </section>
            <section class="form_item" v-show="!sign">
                <label for="password" class="label_sty">密码</label><input type="password" id="password" v-model="password" placeholder="填写微信密码">
            </section>
            <section class="form_item" v-show="sign">
                <label for="password" class="label_sty">验证码</label><input v-model="verifyCode" placeholder="填写验证码">
                <button class="checking" @click="getVerifyCode()" v-show="!exchange">获取验证码</button>
                <span class="waiting" v-show="exchange">已发送{{time}}s</span>
                <!-- <span></span> -->
            </section>
            <span class="switch fl" @click="toggle()" v-show="!sign">用短信验证码登陆</span>
            <span class="switch fl" @click="toggle()" v-show='sign'>用密码登陆</span>
        </div>
        <div class="form_ok">
            <router-link
                to="/register">没有账号？请点击这里进入注册页面</router-link>
            <button @click="submit()">登录</button>
        </div>
    </div>  
</div>
  
</template>

<script>
import {reqPwdLogin,reqVerfyCode,reqMsgLogin} from '../api/index'
import { mapState } from 'vuex'
export default {
    data(){
        return {
            phone: '',
            password: '',
            sign: false,
            verifyCode:'',
            exchange: false,
            time: 60
        }
    },
    mounted: function(){
        this.$refs.login.style.height = document.documentElement.clientHeight/(document.documentElement.clientWidth/15)-0.72 +'rem'
    },
    methods: {
        toggle(){
            this.sign = !this.sign
        },
        async getVerifyCode(){
            let {phone} = this
            if(!/^1\d{10}$/.test(phone)){
                //手机号不正确
                alert('手机号输入有误')
                return
                }
            // console.log({phone})
            const result = await reqVerfyCode({phone}) //发送请求获取验证码
            if(result.code === 0){ //发送成功
                /*短信发送成功后
                    1。切换显示，显示倒计时的画面（要申明一个变量exchange来记录状态,0表示发送前的状态，1表示发送成功的状态）
                    2.设置60秒倒计时)(申明一个变量time记录倒计时时间)
                    3.倒计时一到，将页面切换回发送验证码的画面
                    */
                this.exchange = !this.exchange
                let t = setInterval(()=>{
                    this.time -= 1
                    if(this.time <= -1){
                        this.exchange = !this.exchange
                        this.time = 60
                        window.clearInterval(t)
                        }
                    },1000)
                console.log(result.msg)
                }else{//发送失败
                alert('该手机号未注册')
            }
        },
        async submit(){
            let {phone,password,verifyCode,sign} = this
            //验证输入合法性
            if(!/^1\d{10}$/.test(phone)){
                //手机号不正确
                alert('手机号不正确')
                return
            }
            if(!sign){          //使用密码登录
                if(!password){
                    //密码必须输入
                    alert('密码必须输入')
                    return
                }
                const result = await reqPwdLogin({phone,password})
                // console.log(result)
                if(result.code === 0){
                    //将昵称存入vuex中
                    this.$store.dispatch('recordUser',result.data) //登录成功，此时state中已存在userInfo
                    this.$socket.open() //将websocket打开
                    this.init() //对主页面进行初始化
                    this.$router.replace('/Chitchat')
                }
            }else{          //使用手机号短信登录
                if(!/\d{6}$/.test(verifyCode)){
                    alert('请输入六位数字验证码')
                    return
                }
                const result = await reqMsgLogin({phone,verifyCode})
                console.log(result)
                if(result.code === 0){//验证通过
                    //将昵称存入vuex中
                    this.$store.dispatch('recordUser',result.data) //登录成功，此时state中已存在userInfo
                    this.$socket.open()  //将websocket打开
                    this.init() //对主页面进行初始化
                    this.$router.replace('/Chitchat')
                }else{
                    alert('验证码错误，请重新输入')
                }
            }
        },
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
            console.log(lastNews)
            if(result){//此处将localstorage中的值放入vuex中
                let groupNews = lastNews.groupNews
                let singleNews = lastNews.singleNews
                this.$store.dispatch('getGroup',{groupNews}) 
                this.$store.dispatch('getSingle',{singleNews})
            }
        },
    },
    computed: {
        ...mapState(['userInfo'])
    }    
}
</script>

<style lang="stylus">
.login
    width 100%
    padding 0.4rem
    background-color #fff
    .state
        display flex
        justify-content space-between
    .login_content
        height 16rem
        width 90%
        margin 4rem auto 0
        display flex
        justify-content space-between
        flex-direction column
        span 
            font-size 0.8rem
        .form_item
            padding-left 0.3rem
            font-size 0.64rem
            height 1.8rem
            line-height 1.8rem
            text-align left
            border-bottom .02rem solid #eee
            .label_sty
                display inline-block
                width 3rem
            input 
                font-size 0.64rem
                width 6rem
            .checking
                padding 0.38rem
                border 0.02rem solid #ddd
                background-color #fff
            .waiting
                padding 0.38rem
                font-size 0.55rem
        .switch
            margin-left 0.3rem
            margin-top 0.5rem
            font-size 0.5rem
            color #800080
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