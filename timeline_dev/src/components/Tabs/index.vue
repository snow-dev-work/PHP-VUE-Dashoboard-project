<template>
	<article class="tabs">
		<header>
			<input
				hidden
				type="radio"
				id="tab_id_1"
				name="tab_id"
				value="by-collabs"
				v-model="componentId"
			/>
			<input
				hidden
				type="radio"
				id="tab_id_2"
				name="tab_id"
				value="by-projects"
				v-model="componentId"
			/>
			<label
				for="tab_id_1"
				class="tab__button"
				:class="[{ active: componentId === `by-collabs` }]"
			>
				Par collaborateurs
			</label>
			<label
				for="tab_id_2"
				class="tab__button"
				:class="[{ active: componentId === `by-projects` }]"
			>
				Par projets
			</label>
		</header>

		<main>
			<transition name="tab" mode="out-in" appear>
				<component :is="component" :_projects="projects" class="tab" />
			</transition>
		</main>
	</article>
</template>

<script>
import { mapState } from "@Modules/vuex"
import ByCollabs from "./ByCollabs.vue"
import ByProjects from "./ByProjects.vue"

export default {
	name: "Tabs",

	data() {
		const componentId = "by-collabs"

		return { componentId }
	},
	computed: {
		...mapState({
			__projects: ({ projects }) => projects.searched,
		}),
		projects() {
			return this.__projects
				.map(({ date_start, date_end, ...project }) => {
					if (date_start === null)
						[date_start, date_end] = [date_end, date_start]

					return {
						...project,
						date_start: date_start?.clone() ?? null,
						date_end: date_end?.clone() ?? null,
					}
				})
				.filter(project => project.date_start !== null)
				.map(({ date_start, date_end, ...project }) => {
					
					let isWeek = date_start._i.includes("S")
					let isQuarter = date_start._i.includes("T")

					if (isWeek) {
						date_start = date_start.clone().startOf("week")
					} else if (isQuarter) {
						date_start = date_start.clone().startOf("quarter")
					}

					if (date_end) {
						isWeek = date_end._i.includes("S")
						isQuarter = date_end._i.includes("T")

						if (isWeek) {
							date_end = date_end.clone().endOf("week")
						} else if (isQuarter) {
							date_end = date_end.clone().endOf("quarter")
						}
					}

					return { ...project, date_start, date_end }
				})
		},
		component() {
			switch (this.componentId) {
				case "by-collabs":
					return ByCollabs
				case "by-projects":
					return ByProjects
				default:
					return null
			}
		},
	},
}
</script>

<style scoped>
.tabs {
	display: grid;
	grid-template-rows: auto 1fr;
}

.tabs > header {
	display: flex;
	position: sticky;
	top: 0;
	z-index: 100;
	gap: 0;
	background-color: var(--bg-color);
}
.tabs > main {
	border: solid 1px var(--txt-color);
	border-top: none;
	height: 100%;
}
.tab__button {
	padding: 0.5em 1.5em;
	border: solid 1px var(--txt-color);
	font-weight: bold;
	text-transform: uppercase;
	text-align: center;
	flex: 1;
	cursor: pointer;

	transition-property: color, background-color;
	transition-duration: 150ms;
}

.tab__button:is(:hover, .active) {
	color: var(--bg-color);
	background-color: var(--txt-color);
}

.tab {
	padding: 1em;

	transition: opacity 150ms;
}
.tab-enter,
.tab-leave-to {
	opacity: 0;
}
</style>
