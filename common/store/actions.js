import { STORE, EVENT_SOURCE_MESSAGE_TYPES, POPUP_VARIANTS } from "@Constants"
import api from "@Common/api"
import { useEventSource } from "@Hooks"

export default {
	async [STORE.ACTIONS.INIT]({ commit, dispatch }) {
		const token = new URLSearchParams(location.search).get("token")
		commit(STORE.MUTATIONS.SET_USER_TOKEN, { token })

		await Promise.all([
			dispatch(STORE.ACTIONS.FETCH_USER),
			dispatch(STORE.ACTIONS.FETCH_ADMIN),
		])

		await Promise.all([
			dispatch(STORE.ACTIONS.PROJECTS_FETCH_DATE),
			dispatch(STORE.ACTIONS.PROJECTS_FETCH),
			dispatch(STORE.ACTIONS.FILES_FETCH_ALL),
		])

		dispatch(STORE.ACTIONS.INIT_EVENT_SOURCE)
	},
	async [STORE.ACTIONS.FETCH_ADMIN]({ commit, rootState: { token } }) {
		const admin = (await api.fetchAdmin(token)) ?? false
		commit(STORE.MUTATIONS.SET_ADMIN, { admin })
	},
	async [STORE.ACTIONS.FETCH_USER]({ commit, rootState: { token } }) {
		const user = await api.fetchUser(token)
		commit(STORE.MUTATIONS.SET_USER, { user })
	},
	[STORE.ACTIONS.INIT_EVENT_SOURCE]({ commit, dispatch, state }) {
		let env = "DEV"

		switch (window.location.hostname) {
			case "projets.ageo.fr":
				env = "PROD"
				break
			case "rec-projets.ageo.fr":
				env = "REC"
				break
			case "localhost":
			default:
				env = "DEV"
		}

		const eventSource = useEventSource({
			user: state.user,
			env,
		})

		eventSource.onMessage(e => {
			const { sender, projects } = state

			if (sender) {
				commit(STORE.MUTATIONS.SET_SENDER, { sender: false })
				return
			}

			const {
				message,
				type = null,
				project = null,
				event = null,
				file = null,
				date = null,
			} = JSON.parse(e?.data ?? {})

			let variant = POPUP_VARIANTS.INFO

			switch (type) {
				case EVENT_SOURCE_MESSAGE_TYPES.NEW_PROJECT:
					commit(STORE.MUTATIONS.PROJECTS_ADD, { project }, { root: true })
					commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date }, { root: true })
					break
				case EVENT_SOURCE_MESSAGE_TYPES.UPDATE_PROJECT:
					commit(STORE.MUTATIONS.PROJECTS_UPDATE, { project }, { root: true })
					commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date }, { root: true })
					break
				case EVENT_SOURCE_MESSAGE_TYPES.DELETE_PROJECT:
					commit(STORE.MUTATIONS.PROJECTS_REMOVE, { project }, { root: true })
					commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date }, { root: true })
					variant = POPUP_VARIANTS.WARNING
					break
				case EVENT_SOURCE_MESSAGE_TYPES.NEW_EVENT:
					commit(
						STORE.MUTATIONS.HISTORY_ADD,
						{ project_id: event.project_id, event },
						{ root: true }
					)
					commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date }, { root: true })
					break
				case EVENT_SOURCE_MESSAGE_TYPES.UPDATE_EVENT:
					commit(
						STORE.MUTATIONS.HISTORY_UPDATE,
						{ project_id: event.project_id, event },
						{ root: true }
					)
					commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date }, { root: true })
					break
				case EVENT_SOURCE_MESSAGE_TYPES.DELETE_EVENT:
					commit(
						STORE.MUTATIONS.HISTORY_REMOVE,
						{ project_id: event.project_id, event },
						{ root: true }
					)
					commit(STORE.MUTATIONS.PROJECTS_SET_DATE, { date }, { root: true })
					variant = POPUP_VARIANTS.WARNING
					break
				case EVENT_SOURCE_MESSAGE_TYPES.NEW_FILE:
					commit(STORE.MUTATIONS.FILES_ADD, { file }, { root: true })
					break
				case EVENT_SOURCE_MESSAGE_TYPES.DELETE_FILE:
					commit(STORE.MUTATIONS.FILES_REMOVE, { file }, { root: true })
					variant = POPUP_VARIANTS.WARNING
					break
				default:
					return
			}

			dispatch(STORE.ACTIONS.PROJECTS_FILTER, { filters: projects.filters })
			commit(STORE.MUTATIONS.POPUPS_ADD, { message, variant })
		})

		commit(STORE.MUTATIONS.SET_EVENT_SOURCE, { eventSource })
	},
}
