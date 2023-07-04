<template>
    <Timeline
      :series="series"
      :height="height"
      :options-custom="{
        yaxis: { show: true },
        dataLabels: { enabled: false },
        legend: { show: false },
      }"
    />
</template>

<script>
import Timeline from '@Components/Timeline.vue'
import { TIMELINE_STATUS_COLOR } from '@Constants'

export default {
  name: 'ByCollabs',
  components: { Timeline },
  props: {
    _projects: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    height() {
      const { length } = Object.keys(this.projects)
      const { clientHeight } = document.querySelector(".tabs > main") ?? { clientHeight: 500 }
      const height = length*200
      return height < clientHeight ? "100%" : `${height}`
    },
    projects() {
      return this._projects.reduce((projects, project) => {
        for (const developer of project.developers) {
          projects[developer] = [...(projects?.[developer] ?? []), project]
        }

        return projects
      }, {})
    },
    developers() {
      return Object.keys(this.projects).sort((a, b) => a.localeCompare(b))
    },
    series() {
      return this._projects.map((project) => {
        const name = project.title
        const data = project.developers.map((developer) => {
          const x = developer
          const y = [
            project.date_start.clone(),
            project.date_end?.clone() ??
              project.date_start.clone().add(1, 'days'),
          ].map((date) =>
            date.clone().startOf('day').utc(true).toDate().getTime(),
          )
          return {
            x,
            y,
            fillColor: TIMELINE_STATUS_COLOR[project.status] ?? '#333333',
            project,
          }
        })

        if (project.referent_info) {
          data.push({
            x: project.referent_info,
            y: [
              project.date_start.clone(),
              project.date_end?.clone() ??
                project.date_start.clone().add(1, 'days'),
            ].map((date) =>
              date.clone().startOf('day').utc(true).toDate().getTime(),
            ),
            fillColor: TIMELINE_STATUS_COLOR[project.status] ?? '#333333',
            project,
          })
        }

        data.sort(({ x: a }, { x: b }) => a.localeCompare(b))

        return { name, data }
      })
    },
  },
}
</script>

<style scoped>
.by-collabs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 100%));
  gap: 1em;
}

.timeline-enter-active,
.timeline-leave-active {
  transition: opacity 300ms;
}

.timeline-enter,
.timeline-leave-to {
  opacity: 0;
}
</style>
