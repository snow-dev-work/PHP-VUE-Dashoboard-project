<template>
	<Timeline :series="series" :options-custom="optionsCustom" />
</template>

<script>
import Timeline from "@Components/Timeline.vue"
import { STATUS } from "@Constants"

export default {
	name: "ByProjects",
	components: { Timeline },
	props: {
		_projects: {
			type: Array,
			default: () => []
		}
	},
	data() {
		const optionsCustom = {
			yaxis: { show: true, labels: { minWidth: "min-content", maxWidth: "500px" } }
		}

		return { optionsCustom }
	},
	computed: {
		series() {
			const data = this._projects.map(project => {
				const x = project.title
				const y = [
					project.date_start.clone(),
					project.date_end?.clone() ?? project.date_start.clone().add(1, "days")
				].map(date =>
					date
						.clone()
						.startOf("day")
						.utc(true)
						.toDate()
						.getTime()
				)

				const fillColor =
					project.status === STATUS.PRODUCTION
						? "#00ffbf"
						: project.status === STATUS.RECIPE
						? "#ff8000"
						: project.status === STATUS.PROGRESS
						? (project.progression < 50 ? "#03fc62" : project.progression < 90 && project.progression >= 50 ? "#fca903" : "#fc0303")
						: "#c999ff"

				return { x, y, fillColor, project }
			})
			return [{ data }]
		}
	}
}
</script>

<style></style>
