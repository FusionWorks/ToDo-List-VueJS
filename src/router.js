import Vue from 'vue';
import Router from 'vue-router';
import Epics from '@/components/Epics.vue';
import TaskList from '@/components/TaskList.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'task',
      component: Epics,
    },
    {
      path: '/task/:epicId',
      name: 'taskList',
      component: TaskList,
    },
  ],
});
