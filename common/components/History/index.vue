<template>
  <section class="project-history">
    <h3>Historique</h3>
    <transition-group
      tag="div"
      name="project-history__list"
      class="project-history__list"
      ref="histories"
    >
      <HistoryItem
        v-for="event in _history"
        :key="event.id"
        v-bind="event"
        :project_id="id"
      />
    </transition-group>

    <div class="project-history__new" v-if="admin">
      <HistoryForm
        v-if="show_form"
        :id="id"
        :container="histories"
        @hide="show_form = false"
      />

      <template v-else>
        <input
          type="checkbox"
          :id="`history-form__input__${id}`"
          hidden
          v-model="show_form"
        />
        <label
          class="btn"
          :for="`history-form__input__${id}`"
          :style="{ margin: 'auto' }"
        >
          <Icon icon="comment" />
          Ajouter un événement
        </label>
      </template>
    </div>
  </section>
</template>

<script>
import { mapState } from '@Modules/vuex'
import HistoryForm from './Form.vue'
import HistoryItem from './Item.vue'

export default {
  name: 'History',
  components: { HistoryItem, HistoryForm },
  props: {
    id: Number,
    history: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const show_form = false

    return { show_form }
  },
  computed: {
    ...mapState({
      admin: ({ admin }) => admin,
    }),
    _history() {
      return this.history.sort(({ date: a }, { date: b }) =>
        a.isBefore(b) ? 1 : a.isSame(b) ? 0 : -1,
      )
    },
    histories() {
      return this.$refs.histories.$el
    },
  },
  mounted() {
    console.log(this.histories)
  },
}
</script>

<style scoped>
.project-history {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
}
.project-history__list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 30vh;
  gap: 2em;
}
.project-history__new {
  margin: auto;
  width: 100%;
  display: grid;
  place-items: center;
}
</style>
