
<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "../ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      routes: []
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    // let _this = this;
    // this.$http.get("/menu/list",res=>{
    //   console.log('hhhhh',res)
    //   let menuList = res.data;
    //   this.routes = menuList;
    //   //console.log(this.routes)
    // })

    this.routes = [
        {
            path: "/",
            meta: { icon: null, title: "运营管理" },
            children: [
                {
                    path: "",
                    meta: { icon: null, title: "首页资源位" },
                    children: [
                        {
                            path: "/banner/list?groupId=0",
                            meta: { icon: "form", title: "banner" }
                        },
                        {
                            path: "/homeTheme",
                            meta: { icon: "form", title: "首页话题" }
                        },
                        {
                            path: "/homePosts",
                            meta: { icon: "form", title: "首页置顶帖子" }
                        },
                        {
                            path: "/homeAds",
                            meta: { icon: "form", title: "首页弹层" }
                        },
                        {
                            path: '/banner/list?groupId=-1',
                            meta: { icon: "form", title: "信息流banner" }
                        }
                    ]
                },

                {
                    path: "/honours",
                    meta: { icon: null, title: "荣誉称号" }
                },

                {
                    path: "/sendBolster",
                    meta: { icon: null, title: "发抱枕" }
                },

                {
                    path: "/hot",
                    name: "hot",
                    meta: { title: "最热tab排序", icon: "" },
                    children: [
                        {
                            path: "/hot/toTop",
                            name: "hot-toTop",
                            meta: { title: "置顶帖", icon: "form" }
                        },
                        {
                            path: "/hot/setGrade",
                            name: "hot-setGrade",
                            meta: { title: "设排序分", icon: "form" }
                        }
                    ]
                },

                {
                    path: "/circle",
                    name: "circle",
                    meta: { title: "圈子&话题管理", icon: "" },
                    children: [
                        {
                            path: "/circle/list",
                            meta: { icon: "form", title: "圈子列表" }
                        },
                        {
                            path: "/gambitManage",
                            meta: { icon: "form", title: "话题列表" }
                        }
                    ]
                },

                {
                    path: "/admin",
                    name: "admin",
                    meta: { title: "管理员设置", icon: "" },
                    children: [
                    {
                        path: "/admin/list",
                        meta: { icon: "form", title: "管理员列表" }
                    }
                    ]
                },

                {
                    path: "/official",
                    name: "official",
                    meta: { title: "官方帐号", icon: "" },
                    children: [
                        {
                            path: "/official/pendingList",
                            meta: { icon: "form", title: "待处理互动" }
                        },
                        {
                            path: "/official/list",
                            meta: { icon: "form", title: "官方帐号设置" }
                        },
                        {
                            path: "send",
                            meta: { icon: "form", title: "官方帐号发帖" },
                            children: [
                                {
                                    path: "/official/send",
                                    meta: { icon: "form", title: "待发布列表" }
                                },
                                {
                                    path: "/official/send/published",
                                    meta: { icon: "form", title: "已发布列表" }
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "/captureContent",
                    name: "captureContent",
                    meta: { title: "抓取内容管理", icon: null },
                    children: [
                        {
                            path: "/captureContent/contentPublic",
                            name: "captureContent-contentPublic",
                            meta: { title: "内容发布", icon: "form" }
                        },
                        {
                            path: "/captureContent/publicList",
                            name: "captureContent-publicList",
                            meta: { title: "待发布列表", icon: "form" }
                        },
                        {
                            path: "/captureContent/publicedList",
                            name: "captureContent-publicedList",
                            meta: { title: "已发布列表", icon: "form" }
                        }
                    ]
                }
            ]
        },
        {
            path: "/moaderation",
            meta: { icon: null, title: "内容管理" },
            children: [
            {
                path: "/checkBar",
                meta: { icon: null, title: "内容审核" },
                children: [
                    {
                        path: "/contentCheck",
                        meta: { icon: "", title: "敏感词过滤" }
                    },
                    {
                        path: "/reportCheck",
                        meta: { icon: null, title: "举报池" }
                    },
                    {
                        path: "/imageCheck",
                        meta: { icon: null, title: "图片审核池" }
                    },
                    {
                        path: "/userHeadCheck",
                        meta: { icon: null, title: "头像审核池" }
                    }
                ]
            },
            {
                path: "/concentSearch",
                meta: { icon: null, title: "内容搜索" },
                children: [
                    {
                        path: "/post",
                        meta: { icon: "form", title: "帖子搜索" }
                    },
                    {
                        path: "/searchComment",
                        meta: { icon: "form", title: "评论搜索" }
                    }
                ]
            }
            ]
        },
        {
            path: "/userManage",
            meta: { icon: null, title: "用户管理" },
            children: [
                {
                    path: "/userManage",
                    meta: { icon: "form", title: "用户搜索" }
                },
                {
                    path: "/userManage/userFeedback",
                    meta: { icon: "form", title: "用户反馈" }
                }
            ]
        },
        {
            path: "/news",
            meta: { icon: null, title: "消息推送" },
            children: [
                {
                    path: "/template",
                    meta: { icon: "form", title: "模板消息" },
                    children: [
                        {
                            path: "/ytMessage",
                            meta: { icon: "", title: "夜听文章更新" }
                        },
                        {
                            path: "/activeMessage",
                            meta: { icon: null, title: "活动模板" }
                        }
                    ]
                },
                {
                    path: "/news",
                    meta: { icon: "form", title: "站内消息" }
                },
                {
                    path: "/news/newsSet",
                    meta: { icon: "form", title: "消息设置" }
                }
            ]
        },
        {
            path: "/operationalData",
            meta: { icon: null, title: "运营数据" },
            children: [
                {
                    path: "/circleData",
                    meta: { icon: "form", title: "圈子数据" }
                },
                {
                    path: "topicData",
                    meta: { icon: "form", title: "话题数据" }
                },
                {
                    path: "postData",
                    meta: { icon: "form", title: "帖子数据" }
                },
                {
                    path: "bannerData",
                    meta: { icon: "form", title: "banner数据" }
                }
            ]
        },
        {
            path: "/topicMaster",
            meta: { icon: null, title: "话题主" },
            children: [
                {
                    path: "/topicCheck",
                    meta: { icon: null, title: "话题主质检" },
                    children: [
                        {
                            path: "/postRecommend",
                            meta: { icon: "", title: "话题主帖子推荐池" }
                        },
                        {
                            path: "/postDelete",
                            meta: { icon: null, title: "话题主帖子删除池" }
                        },
                        {
                            path: "/commentDelete",
                            meta: { icon: null, title: "话题主评论删除池" }
                        }
                    ]
                }
            ]
        },
        {
            path: "/privatechat",
            meta: { icon: null, title: "用户私聊管理" },
            children: [
                {
                    path: "/privatechat",
                    meta: { icon: null, title: "用户私聊" },
                },
                // {
                //     path: "/privatechat/sensitive",
                //     meta: { icon: null, title: "私聊敏感词库" },
                // }
            ]
        }
    ];
  }
};
</script>
