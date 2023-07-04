import { STORE, FILTER_KEYS, ORDER, STATUS } from "@Constants"
import api from "@Common/api"
import { scrollToProject } from "@Utils"
import moment from "moment"

export default {
	async [STORE.ACTIONS.PROJECTS_FETCH_DATE]({ commit, rootState: { token } }) {
		const date = await api.projects.fetchDate(token)
		commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date })
	},
	async [STORE.ACTIONS.PROJECTS_FETCH]({
		commit,
		dispatch,
		state,
		rootState: { token },
	}) {
		const list = (await api.projects.fetchAll(token)) ?? []
		commit(STORE.MUTATIONS.PROJECTS_SET_LIST, { list })
		dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
	},
	async [STORE.ACTIONS.PROJECTS_POST](
		{ commit, dispatch, state, rootState: { token } },
		{ data }
	) {
		commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
		const project = await api.projects.post(token, data)
		if (project === null)
			return commit(
				STORE.MUTATIONS.SET_SENDER,
				{ sender: false },
				{ root: true }
			)

		commit(STORE.MUTATIONS.PROJECTS_ADD, { project })
		await dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
		scrollToProject({ id: project.id })
	},
	async [STORE.ACTIONS.PROJECTS_PUT](
		{ commit, dispatch, state, rootState: { token } },
		{ id, data }
	) {
		commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
		const project = await api.projects.put(token, id, data)

		if (project === null) {
			commit(STORE.MUTATIONS.SET_SENDER, { sender: false }, { root: true })
			return false
		}

		commit(STORE.MUTATIONS.PROJECTS_UPDATE, { project })
		await dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
		scrollToProject({ id })
	},
	async [STORE.ACTIONS.PROJECTS_DELETE](
		{ commit, dispatch, state, rootState: { token } },
		{ id }
	) {
		commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
		const project = await api.projects.remove(token, id)
		if (project === null) {
			commit(STORE.MUTATIONS.SET_SENDER, { sender: false }, { root: true })
			return false
		}
		commit(STORE.MUTATIONS.PROJECTS_REMOVE, { project })
		dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
	},
	async [STORE.ACTIONS.HISTORY_POST](
		{ state, commit, dispatch, rootState: { token } },
		{ project_id, data }
	) {
		commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
		const event = await api.history.post(token, project_id, data)
		if (event === null)
			return commit(
				STORE.MUTATIONS.SET_SENDER,
				{ sender: false },
				{ root: true }
			)
		commit(STORE.MUTATIONS.HISTORY_ADD, { project_id, event })
		await dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
	},
	async [STORE.ACTIONS.HISTORY_PUT](
		{ state, commit, dispatch, rootState: { token } },
		{ project_id, id, data }
	) {
		commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
		const event = await api.history.put(token, project_id, id, data)
		if (event === null)
			return commit(
				STORE.MUTATIONS.SET_SENDER,
				{ sender: false },
				{ root: true }
			)
		commit(STORE.MUTATIONS.HISTORY_UPDATE, { project_id, event })
		dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
	},
	async [STORE.ACTIONS.HISTORY_DELETE](
		{ state, commit, dispatch, rootState: { token } },
		{ project_id, id }
	) {
		commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
		const event = await api.history.remove(token, project_id, id)
		if (event === null)
			return commit(
				STORE.MUTATIONS.SET_SENDER,
				{ sender: false },
				{ root: true }
			)
		commit(STORE.MUTATIONS.HISTORY_REMOVE, { project_id, event })
		dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: state.filters })
	},
	[STORE.ACTIONS.PROJECTS_FILTER](
		{ state, commit, dispatch },
		{ filters = {} }
	) {
		let filtered = [...state.list]

		LOOP_FILTER: for (const key in filters) {
			if (!Object.values(FILTER_KEYS).includes(key)) continue LOOP_FILTER

			let filter = filters[key]
			if (filter === null || filter.length === 0) continue LOOP_FILTER

			if (key !== FILTER_KEYS.STATUS && filter.length === 0)
				continue LOOP_FILTER

			if (Array.isArray(filter)) {
				filter = filter.map(f => f.toLocaleUpperCase())

				filtered = filtered.filter(project => {
					let property = project[key]
					if (property === null) return false

					if (Array.isArray(property)) {
						property = property.map(prop => prop.toLocaleUpperCase())

						if (property.some(value => filter.includes(value))) return true
					} else {
						property = property.toLocaleUpperCase()
						if (filter.includes(property)) return true
					}

					return false
				})
			} else {
				switch (key) {
					case FILTER_KEYS.DATE_RANGE:
						const date_range = moment.range(
							filter.start?.clone() ?? moment().startOf("year"),
							filter.end?.clone() ?? moment().endOf("year")
						)

						filtered = filtered.filter(project => {
							if (project.date_end === null) return true

							return date_range.contains(project.date_end)
						})
						continue LOOP_FILTER
					case FILTER_KEYS.STATUS:
						if (/all/i.test(filter)) break
					default:
						filter = filter.toLocaleUpperCase()
						filtered = filtered.filter(project => {
							let property = project[key] ?? null
							if (property === null) return false

							if (Array.isArray(property)) {
								property = property.map(prop => prop.toLocaleUpperCase())
								if (property.includes(filter)) return true
							} else {
								property = property.toLocaleUpperCase()
								if (property === filter) return true
							}

							return false
						})
				}
			}
		}
		commit(STORE.MUTATIONS.PROJECTS_SET_FILTERED, { filtered })
		commit(STORE.MUTATIONS.PROJECTS_SET_FILTERS, { filters })

		dispatch(STORE.ACTIONS.PROJECTS_SORT)
	},
	[STORE.ACTIONS.PROJECTS_SORT]({
		state: { filtered, yardsticks, search },
		commit,
		dispatch,
	}) {
		const sorted = [...filtered]

		if (yardsticks.size === 0) {
			commit(STORE.MUTATIONS.PROJECTS_SET_SORTED, { sorted })

			return
		}

		/** @const {Set} */ const FUNCTION_SET = new Set()

		LOOP_YARDSTICKS: for (const [key, order] of yardsticks) {
			switch (key) {
				case "progression":
					FUNCTION_SET.add(({ [key]: a }, { [key]: b }) => {
						a = Number(a)
						b = Number(b)

						if (order === ORDER.ASC) return a - b
						return b - a
					})
					continue LOOP_YARDSTICKS

				case "status":
					FUNCTION_SET.add(({ [key]: a }, { [key]: b }) => {
						switch (a) {
							case STATUS.PRODUCTION:
								if (b === STATUS.PRODUCTION) return 0
								return order === ORDER.ASC ? 1 : -1
							case STATUS.RECIPE:
								if (b === STATUS.PRODUCTION) return order === ORDER.ASC ? -1 : 1
								if (b === STATUS.RECIPE) return 0
								return order === ORDER.ASC ? 1 : -1
							case STATUS.PROGRESS:
								if ([STATUS.PRODUCTION, STATUS.RECIPE].includes(b))
									return order === ORDER.ASC ? -1 : 1
								if (b === STATUS.PROGRESS) return 0
								return order === ORDER.ASC ? 1 : -1
							case STATUS.WAITING:
								if (
									[STATUS.PRODUCTION, STATUS.RECIPE, STATUS.PROGRESS].includes(
										b
									)
								)
									return order === ORDER.ASC ? -1 : 1
								if (b === STATUS.WAITING) return 0
								return order === ORDER.ASC ? 1 : -1
							case STATUS.CANCELLED:
							default:
								if (b === STATUS.CANCELLED) return 0
								return order === ORDER.ASC ? -1 : 1
						}
					})
					continue LOOP_YARDSTICKS

				case "date":
					FUNCTION_SET.add((a, b) => {
						const date_a =
							a.status === STATUS.WAITING ? a.date_start : a.date_end
						const date_b =
							a.status === STATUS.WAITING ? b.date_start : b.date_end

						if (date_a === null) return 1
						if (date_b === null) return -1

						if (date_a.isBefore(date_b)) return order === ORDER.ASC ? -1 : 1
						if (date_a.isSame(date_b)) return 0

						return order === ORDER.ASC ? 1 : -1
					})
					continue LOOP_YARDSTICKS

				default:
					FUNCTION_SET.add(({ [key]: a }, { [key]: b }) => {
						console.log(a, b)
						if (order === ORDER.ASC) {
							if (a === null) return 1
							if (b === null) return -1

							return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
						}

						if (b === null) return 1
						if (a === null) return -1

						return b.toLocaleLowerCase().localeCompare(a.toLocaleLowerCase())
					})

					continue LOOP_YARDSTICKS
			}
		}

		sorted.sort((a, b) => {
			return [...FUNCTION_SET.values()].reduce((accumulator, current) => {
				const result = accumulator || current(a, b)
				return result
			}, 0)
		})

		commit(STORE.MUTATIONS.PROJECTS_SET_SORTED, { sorted })

		dispatch(STORE.ACTIONS.PROJECTS_SEARCH, { search })
	},
	[STORE.ACTIONS.PROJECTS_SEARCH]({ commit, state: { sorted, search } }) {
		let searched = [...sorted]
		if (search.length === 0) {
			return commit(STORE.MUTATIONS.PROJECTS_SET_SEARCHED, { searched })
		}

		searched = searched.filter(project => {
			const values = [
				project.title.toLocaleUpperCase(),
				project.service.toLocaleUpperCase(),
				project.status.toLocaleUpperCase(),
				...project.developers.map(dev => dev.toLocaleUpperCase()),
			]

			if (project.applicant !== null)
				values.push(project.applicant.toLocaleUpperCase())

			if (project.referent_info !== null)
				values.push(project.referent_info.toLocaleUpperCase())

			for (const value of values) {
				if (value.includes(search.toLocaleUpperCase())) return true
			}
		})

		commit(STORE.MUTATIONS.PROJECTS_SET_SEARCHED, { searched })
	},
}
