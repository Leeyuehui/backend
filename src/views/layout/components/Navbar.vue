<style rel="stylesheet/scss" lang="scss" scoped>
.MMP{
    display:inline-block; 
    font-size: 16px; 
    line-height: 50px; 
    margin-left: 60px;
    position: relative;
    top:-20px;
    color: #00B0F0;
    text-decoration:underline;
}
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .breadcrumb-container {
        float: left;
    }
    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }
    .right-menu {
        float: right;
        height: 100%;
        &:focus {
            outline: none;
        }
        .right-menu-item {
            display: inline-block;
            margin: 0 8px;
        }
        .screenfull {
            height: 20px;
        }
        .international {
            vertical-align: top;
            .international-icon {
                font-size: 20px;
                cursor: pointer;
                vertical-align: -5px;
            }
        }
        .theme-switch {
            vertical-align: 15px;
        }
        .avatar-container {
            height: 50px;
            margin-right: 30px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}

</style>

<template>

<el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <!-- 跑马灯系列  去他妈的跑马灯 杀马特系列吧 -->
    <router-link v-if="messNum" class="MMP" :to="{ name: 'pendingList' }"><span>提醒：有{{messNum}}条官方账号待处理互动</span></router-link>
    <div class="right-menu">

        <el-tooltip effect="dark" content="全屏" placement="bottom">
            <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>

        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <span class="el-dropdown-link">
        {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class="inlineBlock" to="/pass">
                    <el-dropdown-item>
                        修改密码
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                    <span @click="logout" style="display:block;">退出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

</el-menu>

</template>

<script>

import {
    mapGetters
}
from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import Screenfull from './Screenfull'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

export default {
    components: {
        Breadcrumb,
        Hamburger,
        Screenfull
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'nickname'
        ])
    },
    data() {
        return {
            api: {
                messNum: "/message/queryMessagesCount",
            },
            messNum:'',        //待处理互动条数
        };
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        },
        logout() {
            NProgress.start()
            this.$store.dispatch('Logout')
            this.$http.post("/sysUser/logout", (res) => {
                setTimeout(() => {
                    NProgress.done();
                    location.reload();
                }, 500)
            })
        },
        getMessNum(){
            this.$http.get({
                url:this.api.messNum,
                success:res=>{
                    this.messNum = res.data;
                }
            })
        },
    },
    mounted() {
        // this.$http.get('/messList', res => {
        //     if (res.num > 0) {
        //         this.$notify.info({
        //             title: '消息',
        //             message: res.label+'共有未读消息：'+res.num+'条',
        //             duration: 0
        //         });
        //     }
        // })
        this.getMessNum();
    }
}

</script>
