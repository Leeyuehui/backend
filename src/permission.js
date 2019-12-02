import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import router from './router'
import store from './store'

const whiteList = ['/sysUser/login','/404','/pass'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  // next()             // 白名单
  // return
  if(whiteList.indexOf(to.path)!== -1 || to.path.indexOf("edit") != -1){
    console.log(to.path)
    console.log("white")
    next()             // 白名单
    return
  }
next()
  // if(store.getters.logined){
  //   if (to.path === '/login') {
  //     next({ path: '/' })
  //   }else if(store.getters.perms.indexOf(to.path) === -1 && ['/dashboard'].indexOf(to.path) === -1){
  //     if(process.env.NODE_ENV === 'development'){
  //       console.log("reject:"+to.path)
  //     }
  //     next("/404")   // 无权限
  //   }else{
  //     next()
  //   }
  // }else if(from.path !== '/login'){
  //   next("/login")
  // }else{
  //   NProgress.done() // 结束Progress
  // }

  if(store.getters.logined){
    if (to.path === '/sysUser/login') {
      next({ path: '/' })
    }else{
      next()
    }
  }else if(from.path !== '/sysUser/login'){
    next("/sysUser/login")
  }else{
    NProgress.done() // 结束Progress
  }

})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
