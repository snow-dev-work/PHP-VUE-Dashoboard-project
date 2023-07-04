import { STORE } from "@Constants"
import api from "@/../../common/api"
import moment from "moment"
moment.locale("fr")

export default {
	namespaced: false,
	state: () => ({
		list: [],
	}),
	getters: {
		[STORE.GETTERS.FILES_GET_BY_PROJECT]: state => project_id =>
			state.list.filter(file => file.project_id === project_id),
		[STORE.GETTERS.FILES_GET]: state => id =>
			state.list.find(file => file.id === id),
	},
	mutations: {
		[STORE.MUTATIONS.FILES_SET_LIST](state, { list }) {
			state.list = list.map(file => {
				const date = moment(file.date, "YYYY-MM-DD HH:mm")

				return {
					...file,
					date,
				}
			})
		},
		[STORE.MUTATIONS.FILES_ADD](state, { file }) {
			if (state.list.some(f => f.id === file.id)) {
				state.list = state.list.map(f => {
					if (f.id === file.id)
						return {
							...file,
							date: moment(file.date, "YYYY-MM-DD HH:mm"),
						}
					return f
				})
				return
			}

			state.list.push({ ...file, date: moment(file.date, "YYYY-MM-DD HH:mm") })
		},
		[STORE.MUTATIONS.FILES_REMOVE](state, { file }) {
			state.list = state.list.filter(f => f.id !== file.id)
		},
	},
	actions: {
		async [STORE.ACTIONS.FILES_FETCH_ALL]({ rootState: { token }, commit }) {
			const list = await api.files.fetchAll(token)
			commit(STORE.MUTATIONS.FILES_SET_LIST, { list })
		},
		async [STORE.ACTIONS.FILES_POST](
			{ rootState: { token }, commit },
			{ data }
		) {
			commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
			const file = await api.files.post(token, data)
			if (file === null)
				return commit(
					STORE.MUTATIONS.SET_SENDER,
					{ sender: false },
					{ root: true }
				)

			commit(STORE.MUTATIONS.FILES_ADD, { file })
		},
		async [STORE.ACTIONS.FILES_DOWNLOAD]({ rootState: { token } }, { id }) {
			return await api.files.download(token, id)
		},
		async [STORE.ACTIONS.FILES_DELETE](
			{ rootState: { token }, commit },
			{ id }
		) {
			commit(STORE.MUTATIONS.SET_SENDER, { sender: true }, { root: true })
			const file = await api.files.remove(token, id)
			if (file === null)
				return commit(
					STORE.MUTATIONS.SET_SENDER,
					{ sender: false },
					{ root: true }
				)
			commit(STORE.MUTATIONS.FILES_REMOVE, { file })
		},
	},
}
