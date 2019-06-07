<template>
  <div class="container">
    <div v-if="taskList === 'error'" class="d-flex flex-column align-items-center mt-5">
      <h1>You access non-existent Epic.</h1>
      <h3>Please be sure you provide a correct address.</h3>
    </div>
    <div v-else>
      <div class="input-group mt-3">
        <input
          type="text"
          v-model="newTask"
          placeholder="What you need to do?"
          class="form-control"
          @keyup.enter="createNewTask()"
        >
        <div class="input-group-append">
          <button
            class="btn btn-outline-success"
            type="button"
            @click="createNewTask()"
          >Add New Task</button>
        </div>
        <CustomModal v-if="showWorningModal" @closeModal="closeModal()">
          <h2 slot="header" class="text-light">Create New Task</h2>
          <span slot="body">You need to provide a "Name" to the new task!</span>
          <button slot="footer" class="btn btn-primary" @click="closeModal()">Ok</button>
        </CustomModal>
      </div>
      <hr>
      <transition name="fade-span">
        <span
          v-if="!taskList || !taskList.length"
        >The Epic doesn't have the task. You can create one.</span>
      </transition>
      <transition-group name="list" tag="div">
        <div v-for="item in taskList" :key="item.id">
          <div class="card w-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col" :class="{'finished-task': item.task_finished}">
                  <span>{{ item.name }}</span>
                  <input type="text" v-model="item.name" :hidden="!item.editing">
                </div>
                <div class="col d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-success ml-1"
                    :disabled="item.task_finished"
                    @click="finishTask(item.id)"
                  >{{ item.task_finished ? 'Finished' : 'Finish' }}</button>
                  <button
                    type="button"
                    class="btn btn-primary ml-1"
                    :disabled="item.task_finished"
                    @click="editTask(item.id, item.name)"
                  >Edit</button>
                  <button
                    type="button"
                    class="btn btn-danger ml-1"
                    @click="deleteTask(item.id)"
                  >Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <CustomModal v-if="showEditModal" @closeModal="closeModal()">
        <h2 slot="header" class="text-light">Edit</h2>
        <div slot="body" class="d-flex flex-column">
          <span class="pb-2">Edit your task name!</span>
          <input type="text" class="form-control" v-model="newNameForTask">
        </div>
        <div slot="footer">
          <button class="btn btn-danger" @click="closeModal()">Close</button>
          <button class="btn btn-success ml-2" @click="editTaskModal()">Save</button>
        </div>
      </CustomModal>
    </div>
  </div>
</template>

<script>
import CustomModal from '@/components/CustomModal.vue';

export default {
  name: 'TaskList',
  data: function () {
    return {
      epicId: '',
      newTask: null,
      showEditModal: false,
      showWorningModal: false,
      editingTaskId: null,
      newNameForTask: '',
    };
  },

  components: {
    CustomModal,
  },

  created() {
    this.epicId = this.checkEpicId(this.$route.params.epicId);
  },

  beforeRouteUpdate(to, from, next) {
    this.epicId = this.checkEpicId(to.params.epicId);
    next();
  },

  computed: {
    taskList() {
      return this.$store.getters.getTaskListById(this.epicId);
    },
  },

  methods: {
    checkEpicId(id) {
      // Check if epicId contains just digit
      if (!/^[0-9]+$/.test(id)) {
        return null;
      }
      // Convert epicId to number
      if (typeof id !== 'number') {
        return parseInt(id, 10);
      }
      return id;
    },

    createNewTask() {
      // Check if the user has written something
      if (!this.newTask) {
        this.showWorningModal = true;
        return;
      }
      this.$store.commit('createNewTask', { name: this.newTask, id: this.epicId });
      this.newTask = '';
    },

    // Open edit modal with the current name of the task and save the id of the task.
    editTask(id, name) {
      this.editingTaskId = id;
      this.newNameForTask = name;
      this.showEditModal = true;
    },

    deleteTask(id) {
      this.$store.commit('deleteTask', id);
    },

    finishTask(id) {
      this.$store.commit('finishTask', id);
    },

    closeModal() {
      this.showEditModal = false;
      this.showWorningModal = false;
    },

    editTaskModal() {
      this.$store.commit('editTask', { name: this.newNameForTask, id: this.editingTaskId });
      this.showEditModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.finished-task {
  text-decoration: line-through;
}

.fade-span-enter-active,
.fade-span-leave-active {
  position: absolute;
  transition: opacity 1.5s;
}
.fade-span-enter,
.fade-span-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-50%);
}
.list-move {
  transition: transform 1s;
}
</style>
