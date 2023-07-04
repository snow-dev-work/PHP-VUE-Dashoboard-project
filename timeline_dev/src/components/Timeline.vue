<template>
  <Charts :type="type" :width="width" :height="height" :options="options" :series="formattedSeries" />
</template>

<script>
import { STATUS } from '@Constants'
import _ from '@Modules/lodash'

export default {
  name: 'Timeline',
  props: {
    series: {
      type: Array,
      default: () => [{ data: [] }],
    },
    optionsCustom: {
      type: Object,
      default: () => ({}),
    },
    height: {
      type: String,
      default: () => '100%',
    },
  },
  data() {
    const today = this.$moment()
    const monthsOfYear = [
      ...this.$moment
        .range(today.clone().startOf('year'), today.clone().endOf('year'))
        .by('months'),
    ]
    const daysOfWeek = [
      ...this.$moment
        .range(today.clone().startOf('week'), today.clone().endOf('week'))
        .by('days'),
    ]

    const type = 'rangeBar'
    const width = '100%'
    const locales = [
      {
        name: 'fr',
        options: {
          months: monthsOfYear.map((d) => d.format('MMMM')),
          shortMonths: monthsOfYear.map((d) => d.format('MMM')),
          days: daysOfWeek.map((d) => d.format('dddd')),
          shortDays: daysOfWeek.map((d) => d.format('ddd')),
          toolbar: {
            download: 'Télécharger SVG',
            selection: 'Selection',
            selectionZoom: 'Zoom sur la selection',
            zoomIn: 'Zoomer',
            zoomOut: 'Dézoomer',
            reset: 'Réinitialiser le zoom',
          },
        },
      },
    ]
    const zoom = {
      enabled: true,
      type: 'x',
      autoScaleYaxis: false,
    }

    const events = {
      beforeZoom(ctx) {
        ctx.w.config.xaxis.range = undefined
      },
    }

    const delaysAreHiglight = false

    const toolbar = {
      show: true,
      tools: {
        customIcons: [
          {

            icon: `<i style="font-style: normal; font-weight: 600; color: crimson">⚠</i>`,
            title: "Mettre en évidence les retards",
            click: () => {
              this.toggleHighlightDelays()
            }
          }
        ]
      }
    }

    const chart = {
      type,
      defaultLocale: 'fr',
      locales,
      zoom,
      events,
      toolbar,
    }

    const bar = {
      borderRadius: 5,
      horizontal: true,
      barHeight: '80%',
      dataLabels: { hideOverflowingLabels: false },
    }
    const plotOptions = { bar }
    const dataLabels = {
      enabled: true,
      style: { colors: ['#f3f4f5', '#fff'] },
      formatter(values, { seriesIndex, dataPointIndex, w }) {
        const { project = {} } = w.config.series[seriesIndex].data[
          dataPointIndex
        ]

        const { timeSpent = 0.0, estimation = 0.0 } = project
        let label = `${timeSpent}`
        if (estimation) {
          label += ` / ${estimation}`
        }

        let { progression, status } = project // get project's progression
        let progress = ""
        if (status === "EN COURS") {
          // if (progression < 25) progression = 0
          // if (progression < 50 && progression >= 25) progression = 25
          // if (progression < 75 && progression >= 50) progression = 50
          // if (progression < 100 && progression >= 75) progression = 75
          // if (progression === 100) progression = 100

          progress = `Progress: ${progression} %`
        }
        if (status === "EN ATTENTE") {
          progress = "EN ATTENTE"
        }

        label += " JH"
        return label + " " + progress
      },
    }
    const xaxis = {
      type: 'datetime',
      /* min: +this.$moment().startOf("year"),
      max: +this.$moment().endOf("year"), */
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM yyyy',
          day: 'dd MMM',
          hour: '',
        },
      },
      min: +this.$moment().clone().subtract(3, 'months'),
      max: +this.$moment().clone().add(1, 'year'),
    }
    const yaxis = { show: false }
    const grid = {
      row: {
        colors: ['#f3f4f5', '#fff'],
        opacity: 1,
      },
    }
    const tooltip = {
      followCursor: true,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const { project } = w.config.series[seriesIndex].data[dataPointIndex]
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
          timeSpent = 0.0,
          estimation = 0.0,
        } = project
        const descriptionHTML =
          description === null
            ? ''
            : `
						<p style="width: 100%; text-align: justify">
							${description.replace(/\n/g, '<br>')}
						</p>
					`

        const datesHTML =
          (date_start === null ? '' : `<span>${date_start._i}`) +
          (date_end === null ? '</span>' : ` ~ ${date_end._i}</span>`)

        const timeSpentHTML = `
					<span>Temps consommé: ${timeSpent}${estimation ? ` / ${estimation}` : ""} JH</span>
				`

        const serviceHTML = `
						<div>
							<h4>Demandeur</h4>
							<p>${service}${applicant !== null ? ` (${applicant})` : ''}</p>
						</div>
					`

        const referent_infoHTML = `
						<div>
							<h4>Scrum Master</h4>
							<p>${referent_info}</p>
						</div>
					`
        const referent_businessHTML = `
						<div>
							<h4>Product Owner</h4>
							<p>${referent_business}</p>
						</div>
					`

        const developersHTML = `
						<div>
							<h4>Developpeurs</h4>
							<ul>
								${developers.map((dev) => `<li>${dev}</li>`).join('')}
							</ul>
						</div>
					`

        const details = `
						<section class="arrow_box_details">
							${serviceHTML}
							${referent_info === null ? '' : referent_infoHTML}
							${referent_business === null ? '' : referent_businessHTML}
							${developers.length === 0 ? '' : developersHTML}
						</section>
					`

        return `
						<article class="arrow_box">
							<header>
								<h3>${title}</h3>
								<span class="${status.toLocaleLowerCase().replace(' ', '')}-txt">
									${status}${status === STATUS.WAITING ? '' : ` ${progression}%`}
								</span>
							</header>
							${datesHTML}
							${timeSpentHTML}
							${descriptionHTML}
							${details}
						</article>
					`
      },
    }

    const annotations = {
      xaxis: [
        {
          x: +this.$moment().startOf('day'),
          x2: +this.$moment().endOf('day'),
          borderColor: '#f00',
          label: {
            style: {
              background: '#f00',
              color: '#fff',
            },
            text: "Aujourd'hui",
          },
        },
      ],
    }

    const options = {
      annotations,
      chart,
      plotOptions,
      dataLabels,
      xaxis,
      yaxis,
      grid,
      tooltip,
      noData: {
        text: 'Aucun projet à afficher',
      },
    }

    return { optionsDefault: options, type, width, delaysAreHiglight }
  },
  computed: {
    today() {
      return this.$moment()
    },
    options() {
      return _.merge(this.optionsDefault, this.optionsCustom)
    },
    formattedSeries() {
      if (this.delaysAreHiglight) return this.series.map(serie => {
        return {
          ...serie,
          data: serie.data.map(d => {
            if (![STATUS.PROGRESS, STATUS.WAITING].includes(d.project.status)) return d

            if (d.project.status === STATUS.WAITING) {
              if (d.project.date_start.isSameOrBefore(this.today)) return {
                ...d,
                fillColor: "#990000",
              }

              return d
            }

            if (d.project.status === STATUS.PROGRESS) {
              if (!d.project.date_end) return d
              if (d.project.date_end.isSameOrBefore(this.today)) return {
                ...d,
                fillColor: "#990000",
              }
            }

            return d
          }),
        }
      })
      return this.series
    }
  },
  methods: {
    toggleHighlightDelays() {
      this.delaysAreHiglight = !this.delaysAreHiglight
    }
  }
}
</script>

<style></style>
