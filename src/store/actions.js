import {RECEIVE_USER_INFO,RECEIVE_TARGET_DETAIL,RECEIVE_FRIEND_LIST,RECEIVE_CHAT_MSG,RESET_CHAT_MSG,RECEIVE_GROUP_CHAT_MSG,RESET_GROUP_CHAT_MSG,RECEIVE_SINGLE_NEWS,RECORD_CHATING_TARGET,UPDATE_SINGLE_NEWS,CLEAE_TIP,RECEIVE_GROUP_NEWS,UPDATE_GROUP_NEWS,RECEIVE_GROUP_LIST,CLEAE_GROUP_TIP} from './mutation-types'
import {reqUserInfo,reqGetFriendList,reqGetChatMsg,reqGetGroupChatMsg,reqGetSingle,reqUserMsg,reqClearTip,reqGetGroup,reqGroupDetail,reqGetGroupList} from '../api/index'
import sort from '../../public/sort'

export default{
    //同步记录用户信息
    recordUser ({commit},userInfo) {
        commit(RECEIVE_USER_INFO,{userInfo})
    },
    //同步获取好友详情
    recordMsg({commit},targetDetail){
        commit(RECEIVE_TARGET_DETAIL,{targetDetail})
    },
    //异步获取用户信息,
    async getUserInfo({commit}){
        const result = await reqUserInfo()
        return new Promise(function(reslove,reject){
            if(result.code === 0){
                const userInfo = result.data
                commit(RECEIVE_USER_INFO,{userInfo})
                console.log('用户数据加载成功')
                reslove(userInfo)
            }else{
                reject()
            }
        })
        
    },
    //异步获取朋友列表
    async getFriendList({commit},callBack){
        let userID = this.state.userInfo._id
        const result = await reqGetFriendList({userID})
        if(result.code == 0){
            let friendList = result.data
            .reduce((customers,line)=>{
                let sortName = sort.getSpell(line.nick_name)//对nameSort中的字符串进行处理，将中文字符串的首字母转换成拼音
                customers.push([sortName,line])//在每一行的对象前面加一个字符串构成一个数组[ 'a', { id: 4, imgUrl: 'UD08.gif', name: '阿三' } ]
                return customers //返回数组
                }, []) //设置初始值为空数组
            .sort()
            .reduce((customers,line)=>{// 由于sort()方法是做用在一个数组上的，所以这里再reduce一次
            line[0]=line[0].charAt(0) //将排好的数组中的每一项的第一个字符串进行转换，取该字符串的第一个字母，效果如下
            customers[line[0]] = customers[line[0]] || []//将处理好的数组中的每一项的第一个字符串作为customers中每一项的属性名( customers[line[0]] = [] 相当于自动去重，customers[line[0]] || [] 为了防止每次遍历覆盖了之前push进去的值)
            customers[line[0]].push(line[1])
            return customers
            },{})
        // this.addressBooks = friendList
        commit(RECEIVE_FRIEND_LIST,{friendList})
        callBack()
        }else{
            console.log('网络出错')
        }
    },
    //异步获取单聊信息
    async getChatMsg({commit},{userID,friendsID,page}){
        const result = await reqGetChatMsg({userID,friendsID,page})
        // console.log(friendsID)
        if(result.code == 0){
            const chatMsg = result.data
            commit(RECEIVE_CHAT_MSG,{chatMsg})
            console.log('聊天信息获取成功')
            }else{
                console.log('网络出错')
            }
    },  
    //异步获取群聊信息
    async getGroupChatMsg({commit},{groupID,page}){
        const result = await reqGetGroupChatMsg({groupID,page})
        console.log(result)
        if(result.code == 0){
            let groupChatMsg = result.data
            commit(RECEIVE_GROUP_CHAT_MSG,{groupChatMsg})
            // callBack()
            console.log('聊天信息获取成功')
            }else{
                console.log('网络出错')
            }
    },
    //异步获取单聊最新信息，以及未读消息数
    async getSingle({commit},{singleNews}){
        // console.log('singleNews------------',{singleNews})
        const result = await reqGetSingle({singleNews})
        // console.log(friendsID)
        if(result.code == 0){
            let singleNews = result.data
            // console.log(singleNews)
            let userID = this.state.userInfo._id            
            for(let i=0;i<singleNews.length;i++){
                // singleNews[i].time = time.dateTime(singleNews[i].time)
                if(singleNews[i].userID == userID){//如果发送者是自己,这里这样处理是因为最新消息有可能是自己发的，也有可能是好友发的
                    let _id = singleNews[i].friendsID
                    // console.log('如果发送者是自己  ',_id)
                    let detail = await reqUserMsg({_id})
                    // console.log(detail)
                    if(detail.code == 0){//搜索到用户信息
                        singleNews[i].imgUrl = detail.data.imgUrl
                        singleNews[i].nick_name = detail.data.nick_name
                    }
                }else{//发送者是对方
                    let _id = singleNews[i].userID
                    // console.log('发送者是对方  ',_id)
                    let detail = await reqUserMsg({_id})
                    if(detail.code == 0){//搜索到用户信息
                        singleNews[i].imgUrl = detail.data.imgUrl
                        singleNews[i].nick_name = detail.data.nick_name
                    }                    
                }
                if(i == singleNews.length - 1){
                    commit(RECEIVE_SINGLE_NEWS,{singleNews})
                    // callBack()
                    console.log('聊天信息获取成功')
                    }else{
                        console.log('网络出错')
                    }                    
                }
            }
    },
    //异步获取群聊聊最新信息，以及未读消息数
    async getGroup({commit},{groupNews}){
        // console.log('actions',userID)
        // console.log('before----------------',groupNews)
        const result = await reqGetGroup({groupNews})
        // console.log(friendsID)
        if(result.code == 0){
            let groupNews = result.data
            // console.log('after----------------',groupNews)
            for(let i=0;i<groupNews.length;i++){
                let _id = groupNews[i].groupID
                // console.log('群ID', _id)
                let detail = await reqGroupDetail({_id})//获取群的详细信息
                // console.log(detail)
                if(detail.code == 0){//搜索到群详情
                    groupNews[i].imgUrl = detail.data.imgUrl
                    groupNews[i].name = detail.data.name
                }
                if(i == groupNews.length - 1){
                    commit(RECEIVE_GROUP_NEWS,{groupNews})
                    console.log('聊天信息获取成功')
                    }else{
                        console.log('网络出错')
                    }                    
                }
            }
    },
    //异步获取群列表
    async getGroupList({commit}){
        let userID = this.state.userInfo._id
        const result = await reqGetGroupList({userID})
        if(result.code == 0){
            // console.log(result.data)
            let groupList = result.data
            commit(RECEIVE_GROUP_LIST,{groupList})
        }else{
            console.log('网络出错')
        }
    },
    //清除聊天信息
    resetChatMsg({commit}){
        commit(RESET_CHAT_MSG)
    },
    //清除群聊信息
    resetGroupChatMsg({commit}){
        commit(RESET_GROUP_CHAT_MSG)
    },
    //记录当前聊天对象的ID
    recordChatingTarget({commit},id){
        commit(RECORD_CHATING_TARGET,{id})
    },
    //更新singleNews的值
    updateSingleNews({commit},{singleNews}){
        commit(UPDATE_SINGLE_NEWS,{singleNews})
    },
    //更新groupNews的值
    updateGroupNews({commit},{groupNews}){
        commit(UPDATE_GROUP_NEWS,{groupNews})
    },
    //异步清除未读消息数
    clearTip({commit},{userID,friendsID}){
        let singleNewsList = this.state.singleNews
        singleNewsList.forEach(async(item)=>{
            if(item.userID == friendsID && item.friendsID == userID && item.tip != 0){ //原本tip为0的不需要发请求
                const result = await reqClearTip({userID,friendsID})
                if(result.code == 0){//未读消息数修改成功
                    item.tip = 0
                    console.log(singleNewsList)
                    commit(CLEAE_TIP,{singleNewsList})  //将state中的tip更新 
                    let lastNews = {singleNews : this.state.singleNews,groupNews : this.state.groupNews}
                    localStorage.setItem(this.state.userInfo._id,JSON.stringify(lastNews))                                           
                }
            }
        })
       
    },    
    //异步清除群未读消息数
    clearGroupTip({commit},{groupID}){
        let groupNewsList = this.state.groupNews
        groupNewsList.forEach((item)=>{
            if(item.groupID == groupID && item.tip != 0){ //原本tip为0的不需要发请求
                item.tip = 0
                console.log(groupNewsList)
                commit(CLEAE_GROUP_TIP,{groupNewsList})  //将state中的tip更新                       
            }
        })
        let lastNews = {singleNews : this.state.singleNews,groupNews : this.state.groupNews}
        localStorage.setItem(this.state.userInfo._id,JSON.stringify(lastNews))  
    },    
}