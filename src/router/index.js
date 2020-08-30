import Vue from 'vue'
import VueRouter from 'vue-router'
import Chitchat from '../views/Chitchat.vue'
import Directories from '../views/Directories.vue'
import Discover from '../views/Discover.vue'
import My from '../views/My'
import Register from '../views/Register'
import Login from '../views/Login'
import Chat from '../views/Chat'
import AddFriends from '../views/AddFriends'
import Details from '../views/Details'
import ApplyFriends from '../views/ApplyFriends'
import NewFriends from '../views/NewFriends'
import CreateGroup from '../views/CreateGroup'
import GroupChat from '../views/GroupChat'
import GroupList from '../views/GroupList'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/chitchat',
        component: Chitchat,
        meta: {
            showFooter: true,
        }
    },
    {
        path: '/directories',
        component: Directories,
        meta: {
            showFooter: true,
        }
    },
    {
        path: '/discover',
        component: Discover,
        meta: {
            showFooter: true,
        }
    },
    {
        path: '/my',
        component: My,
        meta: {
            showFooter: true,
            whiteBg: true
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
           whiteBg: true 
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            whiteBg: true 
         }
    },
    {
        path: '/chat',
        component: Chat
    },
    {
        path: '/groupchat',
        component: GroupChat
    },
    {
        path: '/addfriends',
        component: AddFriends
    },
    {
        path: '/details',
        component: Details,
        props: true,
        meta: {
            whiteBg: true
        }
    },
    {
        path: '/applyfriends',
        component: ApplyFriends,
        meta: {
            whiteBg: true
        }
    },
    {
        path: '/newfriends',
        component: NewFriends,
    },
    {
        path: '/creategroup',
        component: CreateGroup,
    },
    {
        path: '/grouplist',
        component: GroupList,
    }

]

const router = new VueRouter({
    routes
})

export default router