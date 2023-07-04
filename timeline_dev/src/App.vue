<template>
  <div id="timeline">
    <transition name="overlay" mode="out-in" appear>
      <Overlay v-if="overlayIsVisible" />
    </transition>
    <Popups />
    <Header view="TIMELINE" />
    <main>
      <Tabs />
    </main>
  </div>
</template>

<script>
  import { useMoment } from "@Common/hooks"
  import Header from "@CommonComponents/Header.vue"
  import { STATUS, STORE } from "@Constants"
  import { mapActions, mapState } from "@Modules/vuex"

  const moment = useMoment()

  const Overlay = () =>
    import(
      /** webpackChunkName = "overlay" */ "@CommonComponents/Overlay/index.vue"
    )

  const Popups = () =>
    import(
      /** webpackChunkName = "popups" */ "@CommonComponents/Popups/index.vue"
    )

  const Tabs = () =>
    import(/** webpackChunkName = "tabs" */ "@Components/Tabs/index.vue")

  export default {
    name: "App",
    components: { Header, Overlay, Popups, Tabs },
    data() {
      const year = this.$moment().format("YYYY")

      return { year }
    },
    computed: {
      ...mapState({
        overlayIsVisible: ({ overlay }) => overlay.visible,
        projects: ({ projects }) => projects.searched,
        token: ({ token }) => token,
        update: ({ projects }) => projects.date,
        yardsticks: ({ projects }) => projects.yardsticks,
      }),
      _projects() {
        const _projects = this.projects
          .map(({ date_start, date_end, ...project }) => {
            if (date_start === null)
              [date_start, date_end] = [date_end, date_start]

            date_start = moment.max(
              moment().startOf("year"),
              date_start ?? moment().startOf("year")
            )

            console.log(date_start._i)

            return {
              ...project,
              date_start: date_start?.clone() ?? null,
              date_end: date_end?.clone() ?? null,
            }
          })
          .filter(project => project.date_start !== null)

        _projects.sort(({ date_start: a = 0 }, { date_start: b = 0 }) => +a - b)

        const projects = _projects.reduce((acc, cur) => {
          const { developers } = cur
          for (const developer of developers) {
            acc[developer] = [...(acc?.[developer] ?? []), cur]
          }

          return acc
        }, {})

        return projects
      },
      charts() {
        const today = this.$moment()
        const monthsOfYear = [
          ...this.$moment
            .range(today.clone().startOf("year"), today.clone().endOf("year"))
            .by("months"),
        ]
        const daysOfWeek = [
          ...this.$moment
            .range(today.clone().startOf("week"), today.clone().endOf("week"))
            .by("days"),
        ]
        const type = "rangeBar"
        const height = "95%"
        const locales = [
          {
            name: "fr",
            options: {
              months: monthsOfYear.map(d => d.format("MMMM")),
              shortMonths: monthsOfYear.map(d => d.format("MMM")),
              days: daysOfWeek.map(d => d.format("dddd")),
              shortDays: daysOfWeek.map(d => d.format("ddd")),
              toolbar: {
                download: "Télécharger SVG",
                selection: "Selection",
                selectionZoom: "Zoom sur la selection",
                zoomIn: "Zoomer",
                zoomOut: "Dézoomer",
                reset: "Réinitialiser le zoom",
              },
            },
          },
        ]
        const chart = { height, type, defaultLocale: "fr", locales }
        const series = [
          {
            data: this._projects.map(project => {
              const x = project.title
              const y = [
                project.date_start.clone().startOf("day"),
                project.date_end?.clone().startOf("day") ??
                  project.date_start.clone().add(1, "days").startOf("day"),
              ].map(date => date.toDate().getTime())

              const fillColor =
                project.status === STATUS.PRODUCTION
                  ? "#00ffbf"
                  : project.status === STATUS.RECIPE
                  ? "#ff8000"
                  : project.status === STATUS.PROGRESS
                  ? "#4c60fa"
                  : "#c999ff"

              return { x, y, fillColor, project }
            }),
          },
        ]
        const bar = {
          horizontal: true,
          distributed: true,
          dataLabels: { hideOverflowingLabels: false },
        }
        const plotOptions = { bar }
        const dataLabels = {
          enabled: false,
          style: { colors: ["#f3f4f5", "#fff"] },
          formatter(values, options) {
            const label = values[options.dataPointIndex]
            return label
          },
        }
        const xaxis = {
          type: "datetime",
          labels: {
            datetimeFormatter: {
              year: "yyyy",
              month: "MMM yyyy",
              day: "dd MMM",
              hour: "HH:mm",
            },
          },
        }
        const yaxis = { show: true }
        const grid = {
          row: {
            colors: ["#f3f4f5", "#fff"],
            opacity: 1,
          },
        }
        const tooltip = {
          followCursor: true,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const { project } =
              w.config.series[seriesIndex].data[dataPointIndex]
            const {
              title,
              description,
              date_start,
              date_end,
              status,
              service,
              applicant,
              referent_info,
              referent_business,
              developers,
              progression,
            } = project
            const descriptionHTML =
              description === null
                ? ""
                : `
						<p style="width: 100%; text-align: justify">
							${description.replace(/\n/g, "<br>")}
						</p>
					`

            const datesHTML =
              (date_start === null ? "" : `<span>${date_start._i}`) +
              (date_end === null ? "</span>" : ` ~ ${date_end._i}</span>`)

            const serviceHTML = `
						<div>
							<h4>Demandeur</h4>
							<p>${service}${applicant !== null ? ` (${applicant})` : ""}</p>
						</div>
					`

            const referent_infoHTML = `
						<div>
							<h4>Référent Informatique</h4>
							<p>${referent_info}</p>
						</div>
					`
            const referent_businessHTML = `
						<div>
							<h4>Référent Métier</h4>
							<p>${referent_business}</p>
						</div>
					`

            const developersHTML = `
						<div>
							<h4>Developpeurs</h4>
							<ul>
								${developers.map(dev => `<li>${dev}</li>`).join("")}
							</ul>
						</div>
					`

            const details = `
						<section class="arrow_box_details">
							${serviceHTML}
							${referent_info === null ? "" : referent_infoHTML}
							${referent_business === null ? "" : referent_businessHTML}
							${developers.length === 0 ? "" : developersHTML}
						</section>
					`

            return `
						<article class="arrow_box">
							<header>
								<h3>${title}</h3>
								<span class="${status.toLocaleLowerCase().replace(" ", "")}-txt">
									${status}${status === STATUS.WAITING ? "" : ` ${progression}%`}
								</span>
							</header>
							${datesHTML}
							${descriptionHTML}
							${details}
						</article>
					`
          },
        }
        const options = {
          chart,
          plotOptions,
          dataLabels,
          xaxis,
          yaxis,
          grid,
          tooltip,
        }

        return {
          type,
          height,
          series,
          options,
        }
      },
      years() {
        const years = [
          ...new Set(
            this.projects.map(
              ({ date_start }) => date_start?.format("YYYY") ?? null
            )
          ),
        ].filter(year => year !== null)

        return years
      },
    },
    methods: {
      ...mapActions({
        sort: STORE.ACTIONS.PROJECTS_SORT,
      }),
    },
    beforeMount() {
      this.yardsticks.delete("status")
      this.$store.dispatch(STORE.ACTIONS.INIT)
    },
  }
</script>

<style src="@CommonAssets/css/variables.css"></style>
<style>
  #timeline {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  #timeline .header {
    grid-column: 1 / -1;
    padding: 2em;
  }

  #timeline > main {
    display: grid;
    align-content: stretch;
    padding: 2em;
    padding-top: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .arrow_box {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    max-width: 500px;
    white-space: normal;
  }

  .arrow_box_details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5em;
  }

  .arrow_box_details > :nth-child(even) {
    justify-self: end;
    text-align: end;
  }

  .arrow_box h4 {
    text-transform: uppercase;
    font-size: 0.75em;
  }

  .arrow_box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
