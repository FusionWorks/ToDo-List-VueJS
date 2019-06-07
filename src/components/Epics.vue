<template>
  <div class="container pt-5" v-if="epics && epics.length">
    <div v-for="(item, index) in epics" :key="index">
      <div class="card full-width">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col">{{ item.name }}</div>
            <div class="col">
              <button
                type="button"
                class="btn btn-primary float-right"
                @click="goToTaskList(item.id)"
              >View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Epics',

  methods: {
    // Redirect user to epic task list
    goToTaskList(id) {
      this.$router.push({ name: 'taskList', params: { epicId: id } });
    },
  },

  computed: {
    // Get list of epics from Vuex
    epics() {
      return this.$store.getters.getEpics;
    },
  },
};
</script>

<style lang="scss">
.full-width {
  width: 100%;
}
</style>
