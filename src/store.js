import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    epics: {
      data: [],
      done: false,
      error: null,
    },
    taskList: {
      data: [],
      done: false,
      error: null,
    },
  },
  getters: {
    getEpics: state => (state.epics.done && !state.epics.error ? state.epics.data : null),
    getEpicTasksById: (state, getters) => (id) => {
      const epics = getters.getEpics ? getters.getEpics : null;
      const currentEpic = epics ? epics.find(item => item.id === id) : null;
      // Epic doesn't exist or epicId is invalid
      if (typeof currentEpic === 'undefined' || !id) {
        return 'error';
      }
      return currentEpic ? currentEpic.tasks : null;
    },
    getTaskListById: (state, getters) => (id) => {
      if (getters.getEpicTasksById(id) === 'error') {
        return 'error';
      }
      const tasks = getters.getEpicTasksById(id) ? getters.getEpicTasksById(id) : null;
      return tasks && state.taskList.done ? state.taskList.data.filter(item => tasks.includes(item.id)) : null;
    },
  },
  mutations: {
    setEpicsSuccess(state, payload) {
      state.epics = {
        data: [...payload],
        done: true,
      };
    },

    setEpicsError(state, payload) {
      state.epics = {
        done: true,
        error: payload,
      };
    },

    setTaskListSuccess(state, payload) {
      state.taskList = {
        data: [...payload],
        done: true,
      };
    },

    setTaskListError(state, payload) {
      state.taskList = {
        done: true,
        error: payload,
      };
    },

    createNewTask(state, { name, id }) {
      const arrayOfIds = state.taskList.data.map(item => item.id);
      const newId = Math.max(...arrayOfIds) + 1;
      const currentEpic = state.epics.data.find(item => item.id === id);

      currentEpic.tasks = [...currentEpic.tasks, newId];
      state.taskList.data = [{
        name,
        id: newId,
        task_finished: false,
      },
      ...state.taskList.data];
    },

    editTask(state, { name, id }) {
      const currentTask = state.taskList.data.find(item => item.id === id);

      currentTask.name = name;
    },

    deleteTask(state, id) {
      const taskIndex = state.taskList.data.findIndex(item => item.id === id);

      state.taskList.data.splice(taskIndex, 1);
    },

    finishTask(state, id) {
      const currentTask = state.taskList.data.find(item => item.id === id);

      currentTask.task_finished = true;
    },
  },
  actions: {
    fetchData({ dispatch }) {
      dispatch('fetchEpics');
      dispatch('fetchTaskList');
    },

    fetchEpics({ commit }) {
      fetch('/epics.json')
        .then(res => res.json())
        .then(json => commit('setEpicsSuccess', json))
        .catch(error => commit('setEpicsError', error));
    },

    fetchTaskList({ commit }) {
      fetch('/task-list.json')
        .then(res => res.json())
        .then(json => commit('setTaskListSuccess', json))
        .catch(error => commit('setTaskListError', error));
    },
  },
});
