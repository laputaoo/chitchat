//用于直接更新state的方法
import {RECEIVE_USER_INFO,RECEIVE_TARGET_DETAIL,RECEIVE_FRIEND_LIST,RECEIVE_CHAT_MSG,RESET_CHAT_MSG,RECEIVE_GROUP_CHAT_MSG,RESET_GROUP_CHAT_MSG,RECEIVE_SINGLE_NEWS,RECORD_CHATING_TARGET,UPDATE_SINGLE_NEWS,CLEAE_TIP,RECEIVE_GROUP_NEWS,UPDATE_GROUP_NEWS,RECEIVE_GROUP_LIST,CLEAE_GROUP_TIP} from './mutation-types'


export default{
    [RECEIVE_USER_INFO] (state, {userInfo}) {
        state.userInfo = userInfo
    },
    [RECEIVE_TARGET_DETAIL] (state, {targetDetail}) {
        state.targetDetail = targetDetail
    },
    [RECEIVE_FRIEND_LIST] (state, {friendList}) {
        state.friendList = friendList
    },
    [RECEIVE_CHAT_MSG] (state, {chatMsg}) {
        for(let i in chatMsg){
            state.chatMsg.unshift(chatMsg[i]) 
        }
    },
    [RESET_CHAT_MSG] (state) {
        state.chatMsg = []
        state.chatingTarget = {}
    },
    [RECEIVE_GROUP_CHAT_MSG] (state, {groupChatMsg}) {
        for(let i in groupChatMsg){
            state.groupChatMsg.unshift(groupChatMsg[i]) 
        }
    },
    [RESET_GROUP_CHAT_MSG] (state) {
        state.groupChatMsg = []
        state.chatingTarget = {}
    },
    [RECEIVE_SINGLE_NEWS] (state,{singleNews}) {
        state.singleNews = singleNews
    },
    [RECEIVE_GROUP_NEWS] (state,{groupNews}) {
        state.groupNews = groupNews
    },

    [RECORD_CHATING_TARGET] (state,{id}) {
        state.chatingTarget = id
    },
    [UPDATE_SINGLE_NEWS] (state,{singleNews}) {
        state.singleNews = singleNews
    },
    [UPDATE_GROUP_NEWS] (state,{groupNews}) {
        state.groupNews = groupNews
    },
    [CLEAE_TIP] (state,{singleNewsList}) {
        state.singleNews = singleNewsList
    },
    [RECEIVE_GROUP_LIST] (state, {groupList}) {
        state.groupList = groupList
    },
    [CLEAE_GROUP_TIP] (state,{groupNewsList}) {
        state.groupNews = groupNewsList
    },
}