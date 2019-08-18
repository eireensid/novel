import Vue from 'vue'
import Router from 'vue-router'
import NovelList from './components/NovelList'
import NovelEditor from './components/NovelEditor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'novel-list',
      component: NovelList
    },
    {
      path: '/editor/:id',
      name: 'novel-editor',
      component: NovelEditor
    }
  ]
})
