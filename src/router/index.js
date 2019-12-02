import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layout'
const _import = require('./_import')
import NoFound from '@/views/404'
Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/sysUser/login',
    component: _import('login'),
    hidden: true
  },
  {
    path: '/404',
    component: NoFound,
    hidden: true
  },
  {
    path: '/',
    component: _import('layout'),
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: true,
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: _import('dashboard'),
        meta: {
          title: '首页'
        }
      },
      {
        name: 'pass',
        path: 'pass',
        component: _import('f0/09'),
        meta: {
          title: '修改密码'
        }
      }
    ]
  },


  // banner
  {
    path: '/banner',
    component: _import('layout'),
    name: 'banner',
    meta: {
      title: 'banner'
    },
    children: [
      {
        name: 'banner-list',
        path: 'list',
        component: _import('banner/list'),
        meta: {
          title: 'banner',
          icon: 'form'
        }
      },
      {
        name: 'banner-edit',
        path: 'edit',
        component: _import('banner/edit'),
        meta: {
          title: 'banner编辑',
          icon: 'form'
        }
      }
    ]
  },


  // 最热tab排序
  {
    path: '/hot',
    component: _import('layout'),
    name: 'hot',
    meta: {
      title: '最热tab排序'
    },
    children: [
      {
        name: 'hot-toTop',
        path: 'toTop',
        component: _import('hot/toTop'),
        meta: {
          title: '置顶帖',
          icon: 'form'
        }
      },

      {
        name: 'toTop-addTop',
        path: 'toTop/addTop',
        component: _import('hot/toTop/addTop'),
        meta: {
          title: '添加置顶',
          icon: 'form'
        }
      },

      {
        name: 'hot-setGrade',
        path: 'setGrade',
        component: _import('hot/setGrade'),
        meta: {
          title: '设排序分',
          icon: 'form'
        }
      },
      {
        name: 'setGrade-plus',
        path: 'setGrade/plus',
        component: _import('hot/setGrade/plus'),
        meta: {
          title: '添加排序分',
          icon: 'form'
        }
      }
    ]
  },

  // 圈子&话题管理
  {
    path: '/circle',
    component: _import('layout'),
    name: 'circle',
    meta: {
      title: '圈子&话题管理'
    },
    children: [
      {
        name: 'circle-list',
        path: 'list',
        component: _import('circle/list'),
        meta: {
          title: '圈子列表',
          icon: 'form'
        }
      },
      {
        name: 'circle-edit',
        path: 'circleEdit',
        component: _import('circle/circleEdit'),
        meta: {
          title: '圈子资料编辑',
          icon: 'form'
        }
      },
      {
        name: 'topic-list',
        path: 'gambit',
        component: _import('circle/gambit'),
        meta: {
          title: '圈内话题列表',
          icon: 'form'
        }
      },
      {
        name: 'circle-banner',
        path: 'circleBanner',
        component: _import('banner/list'),
        meta: {
          title: '圈内banner',
          icon: 'form'
        }
      },
      {
        name: 'topic-edit',
        path: 'gambit/edit',
        component: _import('circle/gambit/edit'),
        meta: {
          title: '圈内话题编辑',
          icon: 'form'
        }
      },

      {
        name: 'circle-hotTopic',
        path: 'hotTopic',
        component: _import('circle/hotTopic'),
        meta: {
          title: '热议话题',
          icon: 'form'
        }
      },

      {
        name: 'circle-hotTopicEdit',
        path: 'hotTopic/edit',
        component: _import('circle/hotTopic/edit'),
        meta: {
          title: '新增热议话题',
          icon: 'form'
        }
      },
      {
        name: 'groupPost',
        path: 'groupPost',
        component: _import('concentSearch/post'),
        meta: {
          title: '圈内帖子',
          icon: 'form'
        }
      },
      {
        name: 'circle-topicPost',
        path: 'topicPost',
        component: _import('concentSearch/post'),
        meta: {
          title: '话题帖子',
          icon: 'form'
        }
      },
      {
        name: 'circle-postDetail',
        path: 'postDetail',
        component: _import('circle/postDetail'),
        meta: {
          title: '帖子详情',
          icon: 'form'
        }
      },
      {
        name: 'circle-postEdit',
        path: 'postEdit',
        component: _import('circle/postEdit'),
        meta: {
          title: '编辑帖子',
          icon: 'form'
        }
      }
    ]
  },

  // 管理员设置
  {
    path: '/admin',
    name: 'admin',
    component: _import('layout'),
    meta: {
      title: '管理员设置',
      icon: ''
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: _import('admin/list'),
        meta: {
          title: '管理员列表',
          icon: 'form'
        }
      }
    ]
  },


  // 官方
  {
    path: '/official',
    name: 'official',
    component: _import('layout'),
    meta: {
      title: '官方帐号',
      icon: ''
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: _import('official/list'),
        meta: {
          title: '官方帐号设置',
          icon: 'form'
        }
      },
      {
        path: 'send',
        name: 'send',
        component: _import('official/send'),
        meta: {
          title: '待发布列表',
          icon: 'form'
        }
      },
      {
        path: 'send/published',
        name: 'published',
        component: _import('official/send/published'),
        meta: { title: '已发布列表', icon: 'form' }
      },
      {
        path: 'send/posted',
        name: 'posted',
        component: _import('official/send/posted'),
        meta: { title: '发布新帖', icon: 'form' }
      },
      {
        path: 'send/prePublishEdit',
        name: 'prePublishEdit',
        component: _import('official/send/prePublishEdit'),
        meta: { title: '编辑帖子', icon: 'form' }
      },
      {
        path: 'pendingList',
        name: 'pendingList',
        component: _import('official/pendingList'),
        meta: { title: '待处理互动', icon: 'form' }
      }
    ]
  },


  // 用户管理
  {
    path: '/userManage',
    name: 'userManage',
    component: _import('layout'),
    meta: {
      title: '用户管理',
      icon: ''
    },
    children: [
      {
        path: '',
        name: 'userManage',
        component: _import('userManage'),
        meta: {
          title: '用户搜索',
          icon: 'form'
        }
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        component: _import('userManage/userDetail'),
        meta: {
          title: '用户详情',
          icon: 'form'
        }
      },
      {
        path: 'userFeedback',
        name: 'userFeedback',
        component: _import('userManage/userFeedback'),
        meta: {
          title: '用户反馈',
          icon: 'form'
        }
      },
    ]
  },


  // 内容搜索
  {
    path: '/concentSearch',
    name: 'concentSearch',
    component: _import('layout'),
    meta: {
      title: '内容搜索',
      icon: ''
    },
    children:[
      {
        path: '/post',
        name: 'post',
        component: _import('concentSearch/post'),
        meta: {
          title: '帖子搜索',
          icon: ''
        },
      },
      {
        path: '/searchComment',
        name: 'searchComment',
        component: _import('concentSearch/searchComment'),
        meta: {
          title: '评论搜索',
          icon: ''
        },
      },
    ]
  },
  
  
    // 消息推送
    {
      path: '/news',
      name: 'news',
      component: _import('layout'),
      meta: {title: '消息推送',icon: ''},
      children:[
        {
          path: '',
          name: 'inside',
          component: _import('news'),
          meta: {
          title: '站内消息',
          icon: ''
          },
        },
        {
          path: '/template',
          name: 'template',
          component: _import('news/template'),
          meta: {
          title: '模板消息',
          icon: ''
          },
        },
        {
          path: '/ytMessage',
          name: 'ytMessage',
          component: _import('news/template/ytMessage'),
          meta: {
          title: '夜听文章更新',
          icon: ''
          },
        },
        {
          path: '/activeMessage',
          name: 'activeMessage',
          component: _import('news/template/activeMessage'),
          meta: {
          title: '活动模板',
          icon: ''
          },
        },
        {
          path: 'systemEdit',
          name: 'systemEdit',
          component: _import('news/systemEdit'),
          meta: {
          title: '系统消息编辑',
          icon: ''
          },
        },
        {
          path: 'templateEdit',
          name: 'templateEdit',
          component: _import('news/templateEdit'),
          meta: {
          title: '模板消息编辑',
          icon: ''
          },
        },
        {
          path: 'newsSet',
          name: 'newsSet',
          component: _import('news/newsSet'),
          meta: {
            title: '消息设置',
            icon: ''
          },
        },
      ]
    },

    //话题
    {
        path: '/homeTheme',
        component: _import('layout'),
        name: 'homeTheme',
        meta: {
            title: '首页话题',
            icon: 'form'
        },
        children: [
            {
                path:'',
                name:'homeTheme',
                component: _import('homeTheme'),
                meta:{
                    title: '首页话题',
                    icon: 'form'
                }
            },
            {
                path:'themeEdit',
                name:'themeEdit',
                component: _import('homeTheme/themeEdit'),
                meta:{
                    title: '话题编辑',
                    icon: 'form'
                }
            }
        ]
    },

    // 话题管理
    {
        path: '/gambitManage',
        name: 'gambitManage',
        component: _import('layout'),
        meta: {
            title: '话题管理',
            icon: ''
        },
        children:[
            {
                path:'',
                name:'gambitManage',
                component: _import('gambitManage'),
                meta:{
                    title: '话题管理',
                    icon: 'form'
                }
            }
        ]
    },

    //首页置顶帖子
    {
        path: '/homePosts',
        name: 'homePosts',
        component: _import('layout'),
        meta: {
            title: '首页置顶帖子',
            icon: ''
        },
        children:[
            {
                path:'',
                name:'homePosts',
                component: _import('homePosts'),
                meta:{
                    title: '首页置顶帖子',
                    icon: 'form'
                }
            },  
            {
                path:'edit',
                name:'hpEdit',
                component: _import('homePosts/edit'),
                meta:{
                    title: '首页置顶帖子编辑',
                    icon: 'form'
                }
            },
        ]
    },

    // 发抱枕
    {
        path: '/sendBolster',
        name: 'sendBolster',
        component: _import('layout'),
        meta: {
            title: '发抱枕',
            icon: ''
        },
        children:[
            {
                path:'',
                name:'sendBolster',
                component: _import('sendBolster'),
                meta:{
                    title: '发抱枕',
                    icon: 'form'
                }
            }
        ]
    },

    // 私聊
    {
        path: '/privateChat',
        name: 'privateChat',
        component: _import('layout'),
        meta: {
            title: '用户私聊管理',
            icon: ''
        },
        children:[
            {
                path:'',
                name:'privateChat',
                component: _import('privateChat'),
                meta:{
                    title: '用户私聊',
                    icon: 'form'
                }
            },
            {
                path:'sensitive',
                name:'sensitive',
                component: _import('privateChat/sensitive'),
                meta:{
                    title: '用户私聊',
                    icon: 'form'
                }
            }
        ]
    },

    // 首页弹层
    {
        path: '/homeAds',
        name: 'homeAds',
        component: _import('layout'),
        meta: {
            title: '首页弹层',
            icon: ''
        },
        children:[
            {
                path:'',
                name:'homeAds',
                component: _import('homeAds'),
                meta:{
                    title: '首页弹层',
                    icon: 'form'
                }
            },
            {
                path:'edit',
                name:'adsEdit',
                component: _import('homeAds/edit'),
                meta:{
                    title: '首页弹层编辑',
                    icon: 'form'
                }
            }
        ]
    },

    // 荣誉称号
    {
        path: '/honours',
        name: 'honours',
        component: _import('layout'),
        meta: {
            title: '荣誉称号',
            icon: ''
        },
        children:[
            {
                path:'',
                name:'honours',
                component: _import('honours'),
                meta:{
                    title: '荣誉称号',
                    icon: 'form'
                }
            }
        ]
    },





  {
    path: '/artice',
    name: 'artice',
    component: _import('layout'),
    meta: {
      title: '文章管理',
      icon: ''
    },
    children: [
      {
        path: 'list',
        name: 'artice-list',
        component: _import('artice/list'),
        meta: {
          title: '已发布文章',
          icon: 'form'
        }
      },
      {
        path: 'edit',
        name: 'edit',
        component: _import('artice/list/edit'),
        meta: {
          title: '编辑/添加 文章',
          icon: 'form'
        }
      },
      {
        path: 'draftList',
        name: 'draftList',
        component: _import('artice/draft'),
        meta: {
          title: '待发布文章',
          icon: 'form'
        }
      },
      {
        path: 'collection',
        name: 'collection',
        component: _import('artice/collection'),
        meta: {
          title: '文章收藏',
          icon: 'form'
        }
      },
      {
        path: "send/prePublishEdit",
        "name": "prePublishEdit",
        "component": _import("official/send/prePublishEdit"),
        "meta": {"title": "待发布帖子编辑","icon": "form"}
      },
    ]
  },
  {
    path: '/comment',
    name: 'comment',
    component: _import('layout'),
    meta: {
      title: '评论管理',
      icon: ''
    },
    children: [
      {
        path: 'list',
        name: 'comment-list',
        component: _import('comment'),
        meta: {
          title: '评论列表',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/manage',
    name: 'manage',
    component: _import('layout'),
    meta: {
      title: '用户管理',
      icon: ''
    },
    children: [
      {
        path: 'wxUser',
        name: 'wxUser',
        component: _import('manage/wxUser'),
        meta: {
          title: '微信用户管理',
          icon: 'form'
        }
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        component: _import('manage/userDetail'),
        meta: {
          title: '用户评论详情',
          icon: 'form'
        }
      },
      {
        path: 'feed',
        name: 'feed',
        component: _import('manage/feed'),
        meta: {
          title: '用户反馈',
          icon: 'form'
        }
      }
    ]
  },
  //内容管理
  {
    path: '/moderation',
    name: 'moderation',
    component: _import('layout'),
    meta: {
      title: '内容管理',
      icon: ''
    },
    children: [
      {
        path: '/contentCheck',
        name: 'contentCheck',
        component: _import('moderation/contentCheck'),
        meta: {
          title: '敏感词过滤',
          icon: ''
        }
      },
      {
        path: 'contentCheck/postCheck',
        name: 'postCheck',
        component: _import('moderation/contentCheck/postCheck'),
        meta: {
          title: '审核帖子列表',
          icon: ''
        }
      },
      {
        path: 'contentCheck/commentCheck',
        name: 'commentCheck',
        component: _import('moderation/contentCheck/commentCheck'),
        meta: {
          title: '审核评论列表',
          icon: ''
        }
      },
      {
        path: '/reportCheck',
        name: 'reportCheck',
        component: _import('moderation/reportCheck'),
        meta: {
          title: '举报池',
          icon: ''
        },
      },
      {
        path: 'reportCheck/commentCheck',
        name: 'commentCheck',
        component: _import('moderation/reportCheck/commentCheck'),
        meta: {
          title: '举报评论待审核',
          icon: ''
        }
      },
      {
        path: 'reportCheck/postCheck',
        name: 'postCheck',
        component: _import('moderation/reportCheck/postCheck'),
        meta: {
          title: '举报帖子待审核',
          icon: ''
        }
      },
      {
        path: 'reportCheck/userCheck',
        name: 'userCheck',
        component: _import('moderation/reportCheck/userCheck'),
        meta: {
          title: '举报用户待审核',
          icon: ''
        }
      },
      {
        path: '/imageCheck',
        name: 'imageCheck',
        component: _import('moderation/imageCheck'),
        meta: {
          title: '图片审核池',
          icon: ''
        },
      },
      {
        path: 'imageCheck/check',
        name: 'imageCheck',
        component: _import('moderation/imageCheck/check'),
        meta: {
          title: '图片待审核列表',
          icon: ''
        }
      },
      {
        path: '/userHeadCheck',
        name: 'userHeadCheck',
        component: _import('moderation/userHeadCheck'),
        meta: {
          title: '用户头像待审核',
          icon: ''
        },
      },
      {
        path: 'userHeadCheck/check',
        name: 'check-list',
        component: _import('moderation/userHeadCheck/check'),
        meta: {
          title: '用户头像待审核列表',
          icon: ''
        }
      },
    ]
  },
  {
    path: '/captureContent',
    name: 'captureContent',
    component: _import('layout'),
    meta: {
      title: '抓取内容管理',
      icon: null
    },
    children: [
      {
        path: 'contentPublic',
        name: 'contentPublic',
        component: _import('captureContent/contentPublic'),
        meta: {
          title: '内容发布',
          icon: ''
        }
      },
      {
        path: 'publicList',
        name: 'publicList',
        component: _import('captureContent/publicList'),
        meta: {
          title: '待发布列表',
          icon: ''
        }
      },
      {
        path: 'publicedList',
        name: 'publicedList',
        component: _import('captureContent/publicedList'),
        meta: {
          title: '已发布列表',
          icon: ''
        }
      }
    ]
  },
  //运营数据
  {
    path: '/operationalData',
    name: 'operationalData',
    component: _import('layout'),
    meta: {title: '运营数据',icon: ''},
    children:[
      {
        path: '/circleData',
        name: 'circleData',
        component: _import('operationalData/circleData'),
        meta: {
          title: '圈子数据',
          icon: ''
        },
      },
      {
        path: '/topicData',
        name: 'topicData',
        component: _import('operationalData/topicData'),
        meta: {
          title: '话题数据',
          icon: ''
        }
      },
      {
        path: '/postData',
        name: 'postData',
        component: _import('operationalData/postData'),
        meta: {
          title: '帖子数据',
          icon: ''
        },
      },
      {
        path: '/bannerData',
        name: 'bannerData',
        component: _import('operationalData/bannerData'),
        meta: {
          title: 'banner数据',
          icon: ''
        },
      },
    ]
  },
  //话题主
  {
    path: '/topicMaster',
    name: 'topicMaster',
    component: _import('layout'),
    meta: {
      title: '话题主',
      icon: ''
    },
    children: [
      {
        path: '/topicCheck',
        name: 'topicCheck',
        component: _import('topicMaster/topicCheck'),
        meta: {
          title: '话题主质检',
          icon: ''
        }
      },
      {
        path: '/postRecommend',
        name: 'postRecommend',
        component: _import('topicMaster/topicCheck/postRecommend'),
        meta: {
          title: '话题主帖子推荐池',
          icon: ''
        }
      },
      {
        path: '/postDelete',
        name: 'postDelete',
        component: _import('topicMaster/topicCheck/postDelete'),
        meta: {
          title: '话题主帖子删除池',
          icon: ''
        }
      },
      {
        path: '/commentDelete',
        name: 'commentDelete',
        component: _import('topicMaster/topicCheck/commentDelete'),
        meta: {
          title: '话题主评论删除池',
          icon: ''
        },
      },
     
    ]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
