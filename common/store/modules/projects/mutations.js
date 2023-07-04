import { STORE } from "@Constants"
import moment from "moment"
moment.locale("fr")

export default {
	[STORE.MUTATIONS.PROJECTS_SET_DATE](state, { date }) {
		state.date = moment(date, ["YYYY-MM-DD"])
	},
	[STORE.MUTATIONS.PROJECTS_SET_LIST](state, { list }) {
		state.list = list.map(project => {
			const date_start =
				project.date_start === null
					? null
					: moment(project.date_start, ["DD/MM/YYYY", "YYYY-[T]Q", "YYYY-[S]W"])

			const date_end =
				project.date_end === null
					? null
					: moment(project.date_end, ["DD/MM/YYYY", "YYYY-[T]Q", "YYYY-[S]W"])

			const history = project.history.map(event => {
				const date = moment(event.date, [
					"YYYY-MM-DD HH:mm",
					"DD/MM/YYYY HH:mm",
					"DD/MM/YYYY",
				])

				return {
					...event,
					date,
				}
			})

			const timeSpent = project.timeSpent

			return {
				...project,
				date_start,
				date_end,
				history,
				timeSpent,
			}
		})
	},
	[STORE.MUTATIONS.PROJECTS_ADD](state, { project }) {
		if (state.list.some(p => p.id === project.id)) return

		const PROJECT = { ...project }

		if (project.date_start !== null)
			PROJECT.date_start = moment(project.date_start, [
				"DD/MM/YYYY",
				"YYYY-[T]Q",
				"YYYY-[S]W",
			])

		if (project.date_end !== null)
			PROJECT.date_end = moment(project.date_end, [
				"DD/MM/YYYY",
				"YYYY-[T]Q",
				"YYYY-[S]W",
			])

		state.list = [...state.list, PROJECT]
	},
	[STORE.MUTATIONS.PROJECTS_UPDATE](state, { project }) {
		const PROJECT = { ...project }
		// console.log("STORE | MUTATIONS | PROJECTS_UPDATE", PROJECT)
		if (project.date_start !== null)
			PROJECT.date_start = moment(project.date_start, [
				"DD/MM/YYYY",
				"YYYY-[T]Q",
				"YYYY-[S]W",
			])

		// console.log("STORE | MUTATIONS | PROJECTS_UPDATE", PROJECT.date_start)

		if (project.date_end !== null)
			PROJECT.date_end = moment(project.date_end, [
				"DD/MM/YYYY",
				"YYYY-[T]Q",
				"YYYY-[S]W",
			])

		// console.log("STORE | MUTATIONS | PROJECTS_UPDATE", PROJECT.date_end)

		for (const event of PROJECT?.history ?? []) {
			// console.log("STORE | MUTATIONS | PROJECTS_UPDATE", event)
			event.date = moment(event.date, [
				"YYYY-MM-DD HH:mm",
				"DD/MM/YYYY HH:mm",
				"DD/MM/YYYY",
			])
		}

		// console.log("STORE | MUTATIONS | PROJECTS_UPDATE", PROJECT)
		state.list = state.list.map(p => {
			if (p.id === PROJECT.id) return { ...p, ...PROJECT }
			return p
		})
		// console.log("STORE | MUTATIONS | PROJECTS_UPDATE", state.list)
	},
	[STORE.MUTATIONS.PROJECTS_REMOVE](state, { project }) {
		state.list = state.list.filter(p => p.id !== project.id)
	},
	[STORE.MUTATIONS.PROJECTS_SET_FILTERED](state, { filtered }) {
		state.filtered = filtered
	},
	[STORE.MUTATIONS.PROJECTS_SET_FILTERS](state, { filters }) {
		state.filters = filters
	},
	[STORE.MUTATIONS.PROJECTS_SET_SORTED](state, { sorted }) {
		state.sorted = sorted
	},
	[STORE.MUTATIONS.PROJECTS_SET_SEARCH](state, { search }) {
		state.search = search
	},
	[STORE.MUTATIONS.PROJECTS_SET_SEARCHED](state, { searched }) {
		state.searched = searched
	},
	[STORE.MUTATIONS.PROJECTS_SELECT](state, { id }) {
		state.selected = state.list.find(project => project.id === id)
	},
	[STORE.MUTATIONS.PROJECTS_UNSELECT](state) {
		state.selected = undefined
	},
	[STORE.MUTATIONS.HISTORY_ADD](state, { project_id, event }) {
		state.list = state.list.map(project => {
			if (project.id === project_id) {
				if (project.history.some(e => e.id === event.id)) return project

				const EVENT = { ...event }
				EVENT.id =
					EVENT.id ?? Math.max(...project.history.map(e => e.id), 0) + 1
				project.history = [...project.history, EVENT]
				EVENT.date = moment(EVENT.date, [
					"YYYY-MM-DD HH:mm",
					"DD/MM/YYYY HH:mm",
					"DD/MM/YYYY",
				])
			}
			return project
		})
	},
	[STORE.MUTATIONS.HISTORY_REMOVE](state, { project_id, event }) {
		state.list = state.list.map(project => {
			if (project.id === project_id) {
				return {
					...project,
					history: project.history.filter(e => e.id !== event.id),
				}
			}

			return project
		})
	},
	[STORE.MUTATIONS.HISTORY_UPDATE](state, { project_id, event }) {
		state.list = state.list.map(project => {
			if (project.id === project_id) {
				const history = project.history.map(e => {
					if (e.id === event.id) {
						const date = moment(event.date, [
							"YYYY-MM-DD HH:mm",
							"DD/MM/YYYY HH:mm",
							"DD/MM/YYYY",
						])
						console.log(
							date.format("DD/MM/YYYY HH:mm"),
							e.date.format("DD/MM/YYYY HH:mm")
						)
						return {
							...event,
							date,
						}
					}
					return e
				})
				return {
					...project,
					history,
				}
			}
			return project
		})
	},
}
