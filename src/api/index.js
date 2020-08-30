//包含n个接口请求函数的模块

import ajax from './ajax'
const BASE_URL = 'http://localhost:3000'

//注册
export const reqPwdRegister = function({nick_name,phone,password}){
    return ajax(BASE_URL + '/register',{nick_name,phone,password},'POST')
}
//手机号密码登录
export const reqPwdLogin = function({phone,password}){
    return ajax(BASE_URL + '/login', {phone,password},'POST')
}
//根据session获取用户信息
export const reqUserInfo = () => ajax(BASE_URL + '/login')
//获取短信验证码
export const reqVerfyCode = function({phone}){
    return ajax(BASE_URL + '/message',{phone},'POST')
}
//短信登录
export const reqMsgLogin = function({phone,verifyCode}){
    return ajax(BASE_URL + '/msgLogin',{phone,verifyCode},'POST')
}
//搜索用户并判断是否好友
export const reqSearch = function({phone,userID}){
    return ajax(BASE_URL + '/search',{phone,userID},'POST')
}
//发送好友请求
export const reqApplyFriend = function({userID,friendsID,application,markName}){
    return ajax(BASE_URL + '/applyFriend',{userID,friendsID,application,markName},'POST')
}
//搜索请求好友列表
export const reqSearchApplyList = function({userID}){
    return ajax(BASE_URL + '/searchApplyFriend',{userID},'POST')
}
//搜索用户信息
export const reqUserMsg = function({_id}){
    return ajax(BASE_URL + '/searchApplyMsg',{_id},'POST')
}
//加为好友
export const reqAddFriend = function({userID,friendsID,markName}){
    return ajax(BASE_URL + '/confirmFriend',{userID,friendsID,markName},'POST')
}
//获取好友列表
export const reqGetFriendList = function({userID}){
    return ajax(BASE_URL + '/getFriendList',{userID},'POST')
}
//获取聊天信息
export const reqGetChatMsg = function({userID,friendsID,page}){
    return ajax(BASE_URL + '/getChatMsg',{userID,friendsID,page},'POST')
}
//创建群表
export const reqCreateGroup = function({selectedListMsg,userMsg}){
    return ajax(BASE_URL + '/createGroup',{selectedListMsg,userMsg},'POST')
}
//获取群聊天信息
export const reqGetGroupChatMsg = function({groupID,page}){
    return ajax(BASE_URL + '/getGroupChatMsg',{groupID,page},'POST')
}
//异步获取单聊最新信息，以及未读消息数
export const reqGetSingle = function({singleNews}){
    return ajax(BASE_URL + '/getSingle',{singleNews},'POST')
}
//清除未读消息数
export const reqClearTip = function({userID,friendsID}){
    return ajax(BASE_URL + '/clearTip',{userID,friendsID},'POST')
}
//异步获取群聊最新信息，以及未读消息数
export const reqGetGroup = function({groupNews}){
    return ajax(BASE_URL + '/getGroup',{groupNews},'POST')
}
//搜索群详情
export const reqGroupDetail = function({_id}){
    return ajax(BASE_URL + '/searchGroupDetail',{_id},'POST')
}
//搜索群列表
export const reqGetGroupList = function({userID}){
    return ajax(BASE_URL + '/getGroupList',{userID},'POST')
}
